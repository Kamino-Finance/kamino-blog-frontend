/**
 * Generates `public/sitemap.xml` and `public/feed.xml` from the content source.
 *
 * Run: `npm run feeds` (uses tsx to read the TS content directly). At launch,
 * once `contentSource` is backed by Sanity, this script regenerates the feeds
 * from live content with no changes. Override the base URL with `SITE_URL`.
 *
 *   SITE_URL=https://kamino.finance/blog npm run feeds
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { getAllPosts, CATEGORIES } from '../src/content/source'
import { stripInlineMarks } from '../src/lib/text'
import { isoDateTime } from '../src/lib/date'

const SITE = (process.env.SITE_URL ?? 'https://kamino.finance/blog').replace(/\/$/, '')
const here = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(here, '../public')

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const posts = getAllPosts()

/* ── sitemap.xml ─────────────────────────────────────────────────────────── */
const urls = [
  { loc: SITE, lastmod: posts[0]?.publishedAt },
  ...CATEGORIES.map((c) => ({ loc: `${SITE}/category/${c.slug}`, lastmod: undefined })),
  ...posts.map((p) => ({ loc: `${SITE}/${p.slug}`, lastmod: p.updatedAt ?? p.publishedAt })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url>\n    <loc>${esc(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`)
  .join('\n')}
</urlset>
`

/* ── feed.xml (RSS 2.0) ──────────────────────────────────────────────────── */
const items = posts
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/${p.slug}</guid>
      <pubDate>${new Date(isoDateTime(p.publishedAt)).toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(stripInlineMarks(p.excerpt))}</description>
    </item>`,
  )
  .join('\n')

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kamino Blog</title>
    <link>${SITE}</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Product launches, partner stories, and deep dives from the team building onchain finance at Kamino.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`

writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap)
writeFileSync(resolve(publicDir, 'feed.xml'), feed)
console.log(`Wrote sitemap.xml (${urls.length} urls) and feed.xml (${posts.length} items) → ${publicDir}`)
