# Kamino Blog — Production Handoff

Everything the dev team needs to take this blog live at **kamino.com/blog** with
the Sanity CMS running intact. Pair this with [`README.md`](README.md) (how the
app is built) — this doc is the go-live runbook.

Verified before handoff: `npm run check` (tsc + eslint) is green, the folder has
zero `@kamino/*` / workspace dependencies, and the full publish→rebuild chain
works end to end against Sanity project `2kksiz70`.

---

## The mental model: two halves

**1. The Sanity backend transfers 100% intact.** You keep the exact same Sanity
project (`2kksiz70`), Studio, schema, content, adapter, and build-time sync.
There is nothing to rebuild on the CMS side. You need three things: access to the
project, a read token in your build environment, and the publish webhook pointed
at *your* host's rebuild trigger.

**2. The hosting is yours to own.** Where and how the site serves at
kamino.com/blog is your infrastructure decision. The current Vercel deployment
(`blog-roan-three-15.vercel.app`, on a personal account) is a working reference,
not the production target. Re-create the same three primitives on Kamino infra:
a build-time env var, a deploy trigger, and the Sanity webhook.

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
npm install
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

## Step 3 — Serve it at kamino.com/blog (the one real integration decision)

The app is already subpath-ready. Build it with the base path set, and the router
derives its `basename` automatically ([`vite.config.ts`](vite.config.ts) reads
`BLOG_BASE`; [`src/main.tsx`](src/main.tsx) reads it back):

```bash
BLOG_BASE=/blog/ SITE_URL=https://kamino.com/blog npm run build
```

That makes every asset URL resolve under `/blog/…` and the routes live under
`/blog`. Then wire the subpath one of three ways, depending on how kamino.com is
hosted:

**(a) Rewrite / multi-zone — recommended.** Keep the blog as its own deployment
and have the main kamino.com project proxy the `/blog` path to it. This is how
Stripe, Vercel, and most marketing sites host `/blog`: the blog ships and rebuilds
independently, and marketing publishes never touch the main app. On the *main*
project (Vercel example):

```jsonc
{
  "rewrites": [
    { "source": "/blog",        "destination": "https://<blog-host>/blog" },
    { "source": "/blog/:path*", "destination": "https://<blog-host>/blog/:path*" }
  ]
}
```

**(b) Reverse proxy.** If kamino.com sits behind nginx / Cloudflare, proxy
`/blog/*` to the blog origin. Same independence as (a).

**(c) Mount in the main app.** If kamino.com is a single app, serve the built
`dist/` as static assets under `/blog`. Heaviest coupling — a blog publish
rebuilds the whole app. Not recommended.

**Required regardless of choice:** an SPA fallback so every `/blog/*` path serves
`index.html` (the app is a client-rendered SPA). The included
[`vercel.json`](vercel.json) is the template:
`{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.

---

## Step 4 — Build-time content sync

`prebuild` runs [`scripts/sync-content.ts`](scripts/sync-content.ts) on every
build: it fetches **published** posts + authors from Sanity, maps portable-text →
the app's block model via [`sanity/adapter.ts`](sanity/adapter.ts), and writes
`src/content/generated/content.json`, which gets bundled. Cover images resolve to
`cdn.sanity.io` URLs and are served by Sanity's CDN.

- Set **`SANITY_READ_TOKEN`** in your host's build environment (build-only, never
  exposed to the browser).
- If the token is missing or Sanity is unreachable, the sync writes an empty
  payload and the app falls back to the committed local seed — so the build never
  fails on a bad network. Set the token in production so you get live content.

---

## Step 5 — Auto-rebuild on publish (repoint the webhook)

Publishing rebuilds the site through: **Sanity GROQ webhook → your host's deploy
trigger → rebuild (which reruns the sync)**. The webhook exists already; point it
at your infrastructure:

1. Create a rebuild trigger on your host — a Vercel **Deploy Hook**, a Netlify
   **Build Hook**, or a CI dispatch URL (GitHub Actions `repository_dispatch`).
2. **manage.sanity.io → project `2kksiz70` → API → Webhooks** → open the existing
   webhook and change its **URL** to your new trigger (or create a fresh one and
   delete the old one so it doesn't double-fire). Keep this config exactly:
   - **Filter:** `_type in ["post", "author"]`
   - **Trigger on:** Create, Update, Delete
   - **Drafts:** off · **Versions:** off · **Method:** POST
   - Projection / Secret: empty (the trigger URL is the credential)

Test it: edit and publish any post in the Studio, then confirm your host kicks off
a build. (This exact flow is verified working against the reference deployment.)

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
| `SANITY_READ_TOKEN` | build | Read published content from Sanity. Without it, falls back to local seed. |
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
- [ ] Builds clean standalone with `BLOG_BASE=/blog/ SITE_URL=https://kamino.com/blog`
- [ ] `/blog` and `/blog/*` resolve on kamino.com, assets load under `/blog`, SPA fallback works
- [ ] Sanity webhook repointed to your rebuild trigger; a test publish triggers a build
- [ ] `sitemap.xml` + `feed.xml` regenerated with the production `SITE_URL`
- [ ] Newsletter `submitEmail` in [`src/components/blog/NewsletterCta.tsx`](src/components/blog/NewsletterCta.tsx) wired to your ESP (currently a stub)
- [ ] Per-post OG/meta and reduced-motion behavior spot-checked in prod

---

## Ownership after handoff

| Piece | Owner | Notes |
| --- | --- | --- |
| Sanity project, Studio, content, schema, adapter | Kamino | Invited / transferred; runs unchanged |
| Blog hosting + rebuild trigger | Kamino infra | You deploy; repoint the webhook |
| Reference Vercel deployment (`blog-roan-three-15`) | Personal (temporary) | Delete once you're live, or transfer to your Vercel org |
