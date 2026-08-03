# Kamino Blog

A standalone, production-ready blog frontend for **kamino.com/blog** —
announcements, partner stories, and product deep dives — built to the Kamino
design language with rich page transitions. It comes with a fully wired
**Sanity** CMS so marketing publishes without developer involvement.

This repository is the entire deliverable: the website (`src/`) **and** the
Sanity Studio marketing uses (`studio/`). It builds and runs on its own — no
monorepo, no `@kamino/*` packages, no workspace setup.

---

## What you're shipping (read this first)

The blog already works end to end: it pulls **published** content from Sanity at
build time, renders it, and marketing edits it in the Studio. Clone it, run it,
and you'll see the real content immediately.

To take it live at **kamino.com/blog**, the dev team does five things. Each is
detailed step-by-step in **[`HANDOFF.md`](HANDOFF.md)** — that file is the go-live
runbook; this README explains how the pieces fit.

1. **Get Sanity access + a read token.** Join the Sanity project (`2kksiz70`) and
   set `SANITY_READ_TOKEN` in your build environment. *(HANDOFF Step 1)*
2. **Deploy it through GitHub Actions.** The production workflow builds with
   `BLOG_BASE=/blog/` and uploads to the dedicated AWS bucket. *(HANDOFF Step 3)*
3. **Deploy the Sanity publish function.** Every published content change
   triggers the production workflow through the repository-scoped GitHub App.
   *(HANDOFF Step 5)*
4. **Wire the newsletter** form to your email provider — it's a stub today.
   *(see [Newsletter](#newsletter))*
5. **Deploy the Studio** under your own host, or keep the existing one.
   *(HANDOFF Step 6)*

The application remains independent from the main webapp. Its build and
deployment lifecycle is owned by this repository.

---

## Quick start

```bash
npm ci
npm run dev        # http://localhost:5250
npm run build      # sync from Sanity → generate feeds → typecheck → build to dist/
npm run check      # typecheck + lint
```

Use Node 20.19+, 22.13+, or 24+. With no `SANITY_READ_TOKEN` set, local `dev` and
`build` fall back to the committed seed content. Copy `.env.example` to
`.env.local` to configure it locally (both are gitignored).

---

## How content works

Every surface reads content through **one module** — `src/content/source.ts`
(`getAllPosts`, `getPost`, `getPostsByCategory`, `getRelatedPosts`, `searchPosts`,
…). Nothing in the UI touches storage directly.

That module reads `src/content/generated/content.json`, which is produced from
Sanity at build time:

```
Sanity (Studio)  ──prebuild sync──▶  content.json  ──▶  source.ts  ──▶  UI
```

- **`scripts/sync-content.ts`** (runs in `prebuild`, or `npm run sync`) fetches
  published posts + authors from Sanity and maps them through
  **`sanity/adapter.ts`** (Sanity portable-text → the app's block model).
- Local builds fall back to seed content when Sanity is unavailable. Production
  sets `SANITY_SYNC_REQUIRED=true`, which fails the deployment instead of
  publishing seed content.
- Body content is a CMS-agnostic **block model** (`src/content/types.ts`) rendered
  by one `<PostBody>`: paragraph, headings, lists, image, gallery, quote, callout,
  code, table, stat, embed, divider.

---

## The Sanity CMS

Project `2kksiz70`, dataset `production`.

- **Studio** (`studio/`) — currently deployed at
  **https://kamino-blog.sanity.studio**. Marketing authors and publishes here.
  `cd studio && npm run deploy` updates it.
- **Schema** — `studio/schemaTypes/` is the source of truth for content shape. If
  you change it, update `sanity/adapter.ts` to match.
- **Read token** — build-only, in `SANITY_READ_TOKEN`; never shipped to the
  browser. Create a **Viewer** token at manage.sanity.io → project `2kksiz70` →
  API → Tokens.
- **Seeding** — `npm run seed:sanity` regenerates `seed.ndjson`; import with
  `cd studio && npm run import`.

**Auto-rebuild on publish.** Because content is baked in at build time, a publish
takes effect on the next rebuild. The `deploy-blog` Sanity Function authenticates
as a repository-scoped GitHub App and calls the GitHub Actions
`workflow_dispatch` endpoint after published posts or authors change. Draft edits
do not invoke it. Full setup instructions are in [`HANDOFF.md`](HANDOFF.md)
(Step 5).

---

## Deploying at kamino.com/blog

The app is subpath-ready. Build with the base path and canonical URL set:

```bash
BLOG_BASE=/blog/ SITE_URL=https://kamino.com/blog npm run build
```

`vite.config.ts` reads `BLOG_BASE` (asset paths); `src/main.tsx` derives the
router `basename` from it automatically. `public/sitemap.xml` and
`public/feed.xml` regenerate on every build from `SITE_URL`.

Production deploys are defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
The workflow builds on pushes to `master` or manual dispatches, assumes the AWS
deployment role through GitHub OIDC, uploads `dist/` to the private blog bucket,
and invalidates the blog's viewer and rewritten mutable paths. CloudFront selects
the blog origin for `/blog` and `/blog/*`; its viewer-request function maps SPA
routes to the blog bucket's root `index.html`.

---

## Environment variables

| Variable | When | Purpose |
| --- | --- | --- |
| `SANITY_READ_TOKEN` | build | Pull published content from Sanity. Required by the production workflow. |
| `SANITY_SYNC_REQUIRED` | production build | Fail instead of deploying seed content when Sanity cannot be read. |
| `BLOG_BASE` | build | Subpath base, e.g. `/blog/`. Sets asset paths + router basename. Leave unset for local dev. |
| `SITE_URL` | build (feeds) | Canonical URL for `sitemap.xml` + `feed.xml`. |
| `SANITY_PROJECT_ID` | build (optional) | Overrides the default `2kksiz70`. |
| `GITHUB_APP_PRIVATE_KEY_BASE64` | Sanity Function | Base64-encoded private key for the repository-scoped GitHub App. Set with `sanity functions env add`, never as a Studio variable. |

---

## Project structure

```
src/
  content/        content model (types.ts), the data seam (source.ts),
                  generated/content.json, and local seed posts/
  components/     blog/ (PostBody + block renderers, cards, featured hero,
                  search, reading progress, TOC, lightbox…), illustrations/, ui/
  design/         vendored motion tiers + curated icons
  styles/vendor/  vendored design tokens (byte-identical to the Kamino DS)
  pages/          Index · Post · Category · Author · NotFound
sanity/           portable-text → block-model adapter (used at build time)
scripts/          sync-content.ts (Sanity → content.json), generate-feeds.ts
studio/           the Sanity Studio, Blueprint, and publish function
public/fonts/     vendored Aeonik / Aeonik Fono
```

Routes (`src/main.tsx`): `/` index · `/:slug` post · `/category/:slug` ·
`/authors/:slug` · `*` 404. Uses a **data router** — required for the
View-Transitions shared-element cover→hero morph.

---

## Illustrations

Covers and inline visuals are first-class slots; set them in Sanity. Cover art
renders **16:9** (1920×1080 works well) — the banner on cards, the featured hero,
and the post header. When an image is absent,
`src/components/illustrations/CoverArt.tsx` renders a category-tinted placeholder
so nothing is ever empty. Body images support `inline` / `wide` / `full` widths
plus captions; galleries get a lightbox; video embeds take a poster image.

---

## Newsletter

The subscribe form (`src/components/blog/NewsletterCta.tsx`) is wired end to end
with a **stubbed** `submitEmail`. Replace it with a POST to your email provider
(Loops, Customer.io, etc.); the idle / submitting / success / error states are
already built.

---

## Design tokens

`src/styles/vendor/` and `tailwind/` are byte-identical copies of the Kamino
design system, vendored for portability. See each folder's README for provenance
and how to re-sync after a design-system update.
