# Kamino Blog — Production Handoff

Everything the dev team needs to take this blog live at **kamino.com/blog** with
the Sanity CMS running intact. Pair this with [`README.md`](README.md) (how the
app is built) — this doc is the go-live runbook.

Verified before handoff: `npm run check` (tsc + eslint) is green and the folder
has zero `@kamino/*` or workspace dependencies. The AWS deployment and Sanity
publish trigger must be smoke-tested together after the first production deploy.

---

## The mental model: two halves

**1. The Sanity backend transfers 100% intact.** You keep the exact same Sanity
project (`2kksiz70`), Studio, schema, content, adapter, and build-time sync.
There is nothing to rebuild on the CMS side. You need three things: access to the
project, a read token in your build environment, and the publish webhook pointed
at *your* host's rebuild trigger.

**2. Kamino owns the production hosting.** The static build is stored in a
dedicated private S3 bucket. The existing `kamino.com` CloudFront distribution
routes `/blog` to that bucket. GitHub Actions builds and deploys through AWS OIDC.

---

## Step 1 — Get access to Sanity

Dawid (project owner) invites the team at
**manage.sanity.io → project `2kksiz70` → Members**:

- Dev leads → **Administrator**
- Marketing authors → **Editor** (they publish in the Studio, no dev access)

If the project should sit under a Kamino org for billing/ownership, transfer it:
**Project settings → Transfer project** (or create a Kamino org and move it).

Create your own build token — do not reuse a personal one:
**API → Tokens → Add token → Viewer (read)**. This becomes `SANITY_READ_TOKEN`.

---

## Step 2 — Clone and install

This repository is the whole deliverable — the blog app plus the Sanity Studio
(`studio/`), nothing else. It stands alone; no monorepo or workspace packages are
required to build it.

```bash
git clone <this repo> kamino-blog && cd kamino-blog
npm ci
npm run check      # tsc + eslint — should be clean
npm run dev        # http://localhost:5250
npm run build      # runs prebuild sync + typecheck + build → dist/
```

The design system (tokens, Aeonik fonts, Tailwind preset, icons, motion tiers) is
vendored under `src/styles/vendor/`, `tailwind/`, `src/design/`, `public/fonts/` —
byte-identical copies of the DS, with provenance noted in each folder's README.
Re-sync them if the DS changes; otherwise the blog needs no workspace packages.

The npm package names (`@kamino/blog`, `studio/` → `@kamino/blog-studio`) are just
scoped names, not dependencies. Rename them freely.

---

## Step 3 — Deploy it at kamino.com/blog

The app is already subpath-ready. Build it with the base path set, and the router
derives its `basename` automatically ([`vite.config.ts`](vite.config.ts) reads
`BLOG_BASE`; [`src/main.tsx`](src/main.tsx) reads it back):

```bash
BLOG_BASE=/blog/ SITE_URL=https://kamino.com/blog npm run build
```

That makes every asset URL resolve under `/blog/` and mounts the router there.
The production workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Fetches published content from Sanity.
2. Builds the app with the production base and canonical URL.
3. Assumes `gh-kamino-blog-frontend-kamino-com-deploy` through GitHub OIDC.
4. Uploads hashed assets with immutable caching and mutable files with short caching.
5. Uploads `index.html` with caching disabled.
6. Invalidates both the public blog paths and their rewritten mutable paths in
   CloudFront. Hashed assets do not require invalidation.

CloudFront routes `/blog` and `/blog/*` to the dedicated blog bucket. Its
viewer-request function serves the bucket's root `index.html` for SPA routes and
strips the `/blog` prefix from asset requests. Redirects from the legacy blog
hostnames are managed separately in Cloudflare.

---

## Step 4 — Build-time content sync

`prebuild` runs [`scripts/sync-content.ts`](scripts/sync-content.ts) on every
build: it fetches **published** posts + authors from Sanity, maps portable-text →
the app's block model via [`sanity/adapter.ts`](sanity/adapter.ts), and writes
`src/content/generated/content.json`, which gets bundled. Cover images resolve to
`cdn.sanity.io` URLs and are served by Sanity's CDN.

- Set **`SANITY_READ_TOKEN`** in the GitHub `Deploy to Prod` environment. It is
  build-only and is never exposed to the browser.
- Production sets `SANITY_SYNC_REQUIRED=true`. Missing credentials or a failed
  Sanity request stops deployment instead of publishing local seed content.
- Local builds retain the seed fallback so development works without credentials.

---

## Step 5 — Auto-rebuild on publish (repoint the webhook)

Publishing rebuilds the site through Sanity, GitHub Actions, and AWS:

1. Create a fine-grained GitHub token from a service account. Limit repository
   access to `Kamino-Finance/kamino-blog-frontend` and grant only **Actions:
   Read and write**. Record its expiry so it can be rotated before it stops the
   publish flow.
2. In **manage.sanity.io → project `2kksiz70` → API → Webhooks**, update the
   existing webhook or create a new one with:
   - **URL:** `https://api.github.com/repos/Kamino-Finance/kamino-blog-frontend/actions/workflows/deploy.yml/dispatches`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["post", "author"]`
   - **Projection:** `{ "ref": "master" }`
   - **Drafts:** off
   - **Versions:** off
   - **Method:** POST
   - **HTTP header:** `Authorization: Bearer <fine-grained-token>`
   - **HTTP header:** `Accept: application/vnd.github+json`
   - **HTTP header:** `X-GitHub-Api-Version: 2026-03-10`
3. Ensure the GitHub `Deploy to Prod` environment does not require a manual
   reviewer if published content should deploy automatically.
4. Publish a test change, confirm the webhook attempt succeeds, and confirm the
   `Deploy blog to AWS` workflow completes.

---

## Step 6 — The Studio (marketing's editor)

`studio/` is the Sanity Studio, deployed at **kamino-blog.sanity.studio**
(`studioHost` in [`studio/sanity.cli.ts`](studio/sanity.cli.ts)). Marketing
authors and publishes there.

- Keep that URL as-is, or redeploy under your own host: edit `studioHost` in
  `sanity.cli.ts`, then `cd studio && npm run deploy`.
- Schema lives in `studio/schemaTypes/` — the source of truth for content shape.
  If you change it, update `sanity/adapter.ts` to match. Reseed sample content
  with `npm run seed:sanity` → `cd studio && npm run import`.

---

## Environment variables (complete list)

| Variable | When | Purpose |
| --- | --- | --- |
| `SANITY_READ_TOKEN` | build | Read published content from Sanity. Required by the production workflow. |
| `SANITY_SYNC_REQUIRED` | production build | Fail instead of deploying seed content when Sanity cannot be read. |
| `BLOG_BASE` | build | Subpath base, e.g. `/blog/`. Sets asset paths + router basename. |
| `SITE_URL` | build (feeds) | Canonical URL for `sitemap.xml` + `feed.xml`, e.g. `https://kamino.com/blog`. |
| `SANITY_PROJECT_ID` | build (optional) | Overrides the default `2kksiz70` if you ever point at another project. |

---

## What's hardcoded — and correct to keep

The Sanity project ID `2kksiz70` and dataset `production` appear in the Studio
config and the sync script (env-overridable there). These are the shared backend
you're keeping, so leave them. They are the only external coupling points.

---

## Pre-launch checklist

- [ ] Dev + marketing invited to Sanity project `2kksiz70` (project transferred to a Kamino org if desired)
- [ ] Own **Viewer** read token created → `SANITY_READ_TOKEN` set in the build env
- [ ] AWS CloudFormation stack contains the blog bucket, OAC, routes, and deploy role
- [ ] Builds clean standalone with `BLOG_BASE=/blog/ SITE_URL=https://kamino.com/blog`
- [ ] `Deploy blog to AWS` completes from `master` using GitHub OIDC
- [ ] `/blog` and `/blog/*` resolve on kamino.com, assets load under `/blog`, SPA fallback works
- [ ] Cloudflare redirects point legacy blog hostnames at `https://kamino.com/blog`
- [ ] Sanity webhook repointed to your rebuild trigger; a test publish triggers a build
- [ ] `sitemap.xml` + `feed.xml` regenerated with the production `SITE_URL`
- [ ] Newsletter `submitEmail` in [`src/components/blog/NewsletterCta.tsx`](src/components/blog/NewsletterCta.tsx) wired to your ESP (currently a stub)
- [ ] Per-post OG/meta and reduced-motion behavior spot-checked in prod

---

## Ownership after handoff

| Piece | Owner | Notes |
| --- | --- | --- |
| Sanity project, Studio, content, schema, adapter | Kamino | Invited / transferred; runs unchanged |
| S3, CloudFront, AWS deploy role | Kamino infra | Managed by the webapp CloudFormation stack |
| Build and deployment workflow | Kamino frontend | Runs on `master` and Sanity publish dispatches |
