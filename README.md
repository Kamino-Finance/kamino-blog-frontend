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
2. **Host it under the `/blog` subpath.** Build with `BLOG_BASE=/blog/` and route
   `kamino.com/blog` to this deployment. *(HANDOFF Step 3)*
3. **Point the publish webhook at your host.** A Sanity webhook → your deploy/build
   hook, so every publish rebuilds the site automatically. *(HANDOFF Step 5)*
4. **Wire the newsletter** form to your email provider — it's a stub today.
   *(see [Newsletter](#newsletter))*
5. **Deploy the Studio** under your own host, or keep the existing one.
   *(HANDOFF Step 6)*

That's the whole job. None of it changes the app code — it's access, hosting, and
two integration points.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5250
npm run build      # sync from Sanity → generate feeds → typecheck → build to dist/
npm run check      # typecheck + lint
```

Node 20+. With no `SANITY_READ_TOKEN` set, `dev` and `build` fall back to the
committed seed content, so the app always runs. Copy `.env.example` to
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
- If `SANITY_READ_TOKEN` is unset or Sanity is unreachable, the sync writes an
  empty payload and `source.ts` falls back to the local seed in
  `src/content/posts/*`. The build never fails on a bad network.
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
takes effect on the next rebuild. Wire it once: create a deploy/build hook on your
host, then add a Sanity **GROQ webhook** pointing at it (filter
`_type in ["post", "author"]`, "Include drafts" **off**, method POST). Every
publish then triggers a rebuild that re-syncs. Create GROQ webhooks from the
Sanity **manage dashboard** — the token API only makes the older "transaction"
type, which fires on every draft keystroke. Full steps in
[`HANDOFF.md`](HANDOFF.md) (Step 5); this flow is verified working.

---

## Deploying at kamino.com/blog

The app is subpath-ready. Build with the base path and canonical URL set:

```bash
BLOG_BASE=/blog/ SITE_URL=https://kamino.com/blog npm run build
```

`vite.config.ts` reads `BLOG_BASE` (asset paths); `src/main.tsx` derives the
router `basename` from it automatically. `public/sitemap.xml` and
`public/feed.xml` regenerate on every build from `SITE_URL`.

Serve the subpath by rewriting/proxying `/blog` from the main kamino.com site to
this deployment (the recommended multi-zone pattern), and make sure every
`/blog/*` path serves `index.html` — it's a client-rendered SPA, and
[`vercel.json`](vercel.json) is the fallback template. The three hosting patterns
(rewrite, reverse-proxy, mount-in-app) are compared in
[`HANDOFF.md`](HANDOFF.md) (Step 3).

---

## Environment variables

| Variable | When | Purpose |
| --- | --- | --- |
| `SANITY_READ_TOKEN` | build | Pull published content from Sanity. Falls back to seed if unset. |
| `BLOG_BASE` | build | Subpath base, e.g. `/blog/`. Sets asset paths + router basename. Leave unset for local dev. |
| `SITE_URL` | build (feeds) | Canonical URL for `sitemap.xml` + `feed.xml`. |
| `SANITY_PROJECT_ID` | build (optional) | Overrides the default `2kksiz70`. |

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
studio/           the Sanity Studio (marketing's editor)
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
