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

## Step 5 — Auto-rebuild on publish

The `deploy-blog` Sanity Function runs on Sanity's infrastructure when a
published post or author is created, updated, or deleted. It authenticates as an
organization-owned GitHub App, obtains a short-lived installation token, and
dispatches `deploy.yml` on `master`. Draft and version edits are excluded.

The GitHub App configuration is intentionally narrow:

- **App ID:** `4474304`
- **Installation ID:** `150961368`
- **Installed repository:** `Kamino-Finance/kamino-blog-frontend` only
- **Repository permission:** Actions, read and write
- **Contents and organization permissions:** none
- **User authorization and GitHub App webhooks:** disabled

Do not create a PAT, OAuth client secret, or direct Sanity webhook for this flow.

### Deploy the Sanity Blueprint

Use Node 24 on a trusted workstation, then authenticate with a Sanity account
that can deploy Blueprints and create robot tokens:

```bash
cd studio
npm ci
npx sanity@latest login
npx sanity@latest blueprints stacks --project-id 2kksiz70
```

If the project does not already have the blog production Stack, create and link
it to the checked-in Blueprint:

```bash
npx sanity@latest blueprints init . \
  --project-id 2kksiz70 \
  --stack-name production
```

If the Stack already exists, link it instead of creating another one:

```bash
npx sanity@latest blueprints init . \
  --project-id 2kksiz70 \
  --stack-id <existing-stack-id>
```

Review and deploy the resources:

```bash
npm run blueprints:plan
npm run blueprints:deploy
```

The Blueprint creates the function and gives it a Sanity Viewer robot token
instead of the default Editor token. The function does not use the token, but
the narrower role limits the automatically injected Sanity credential.

### Add the GitHub App private key

The function expects the downloaded GitHub App PEM as a base64-encoded function
environment variable. Replace the path below with the absolute path to the PEM:

```bash
KAMINO_GITHUB_APP_KEY_B64="$(base64 < /absolute/path/to/github-app.private-key.pem | tr -d '\n')"
npx sanity@latest functions env add \
  deploy-blog \
  GITHUB_APP_PRIVATE_KEY_BASE64 \
  "$KAMINO_GITHUB_APP_KEY_B64"
unset KAMINO_GITHUB_APP_KEY_B64
```

Confirm only the environment-variable name is listed:

```bash
npx sanity@latest functions env list deploy-blog
```

Never put the PEM in the repository, a `.env` file, GitHub Actions, or a
`SANITY_STUDIO_*` variable. After the end-to-end test succeeds, remove the local
PEM or move it into the company's approved secrets vault.

### Test publishing

1. Ensure the GitHub `Deploy to Prod` environment does not require a manual
   reviewer.
2. Disable any old Sanity webhook that calls GitHub directly, so a publish does
   not create duplicate builds.
3. Publish a harmless post change in the Studio.
4. Check the Function logs with
   `npx sanity@latest functions logs deploy-blog`.
5. Confirm `Deploy blog to AWS` completes and the change appears on
   `https://kamino.com/blog`.
6. Repeat with an unpublish or delete to confirm content removal also deploys.

To rotate the GitHub App key, generate a new key, replace the Function variable
with the command above, test a publish, and then revoke the old key in the GitHub
App settings.

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
| `GITHUB_APP_PRIVATE_KEY_BASE64` | Sanity Function | Base64-encoded GitHub App PEM. Managed only with `sanity functions env`; never exposed to the Studio/browser. |

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
- [ ] Sanity Blueprint deployed and `deploy-blog` has its GitHub App private key
- [ ] Old direct-to-GitHub Sanity webhooks disabled; a test publish triggers one build
- [ ] `sitemap.xml` + `feed.xml` regenerated with the production `SITE_URL`
- [ ] Newsletter `submitEmail` in [`src/components/blog/NewsletterCta.tsx`](src/components/blog/NewsletterCta.tsx) wired to your ESP (currently a stub)
- [ ] Per-post OG/meta and reduced-motion behavior spot-checked in prod

---

## Ownership after handoff

| Piece | Owner | Notes |
| --- | --- | --- |
| Sanity project, Studio, content, schema, adapter, publish function | Kamino | Invited / transferred; Blueprint is under `studio/` |
| S3, CloudFront, AWS deploy role | Kamino infra | Managed by the webapp CloudFormation stack |
| Build and deployment workflow | Kamino frontend | Runs on `master` and Sanity publish dispatches |
