/**
 * Generates `seed.ndjson` from the local seed content, ready for
 * `sanity dataset import`. Transforms the block model into Sanity documents:
 * authors, and posts with portable-text bodies + banner images uploaded via the
 * `_sanityAsset` file directive. One-shot seeding so the Studio + live site are
 * populated; marketing then edits in Sanity.
 *
 * Run via `npm run seed:sanity` (tsx) → writes seed.ndjson at the app root.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { POSTS } from '../src/content/posts'
import { AUTHORS } from '../src/content/authors'
import { isoDateTime } from '../src/lib/date'
import type { Block, InlineText } from '../src/content/types'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(here, '../public')

/** Local `/illustrations/x.png` → `_sanityAsset` file directive (absolute). */
const asset = (src?: string) => (src ? `image@file://${resolve(publicDir, '.' + src)}` : undefined)

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_/g

/** Inline markdown → portable-text spans + link markDefs. */
function inline(text: InlineText, key: string) {
  const children: Record<string, unknown>[] = []
  const markDefs: Record<string, unknown>[] = []
  let last = 0
  let i = 0
  let m: RegExpExecArray | null
  INLINE.lastIndex = 0
  const span = (t: string, marks: string[]) => {
    if (t) children.push({ _type: 'span', _key: `${key}s${i++}`, text: t, marks })
  }
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) span(text.slice(last, m.index), [])
    if (m[1] !== undefined) {
      const dk = `${key}l${i}`
      markDefs.push({ _key: dk, _type: 'link', href: m[2] })
      span(m[1], [dk])
    } else if (m[3] !== undefined) span(m[3], ['code'])
    else if (m[4] !== undefined) span(m[4], ['strong'])
    else if (m[5] !== undefined) span(m[5], ['em'])
    else if (m[6] !== undefined) span(m[6], ['em'])
    last = m.index + m[0].length
  }
  if (last < text.length) span(text.slice(last), [])
  if (children.length === 0) span('', [])
  return { children, markDefs }
}

/** One Block → one or more portable-text nodes. */
function toPT(block: Block, key: string): Record<string, unknown>[] {
  switch (block._type) {
    case 'paragraph': {
      const { children, markDefs } = inline(block.text, key)
      return [{ _type: 'block', _key: key, style: block.variant === 'lead' ? 'lead' : 'normal', markDefs, children }]
    }
    case 'heading':
      return [{ _type: 'block', _key: key, style: block.level === 2 ? 'h2' : 'h3', markDefs: [], children: [{ _type: 'span', _key: `${key}s`, text: block.text, marks: [] }] }]
    case 'list':
      return block.items.map((item, j) => {
        const { children, markDefs } = inline(item, `${key}i${j}`)
        return { _type: 'block', _key: `${key}i${j}`, style: 'normal', listItem: block.style, level: 1, markDefs, children }
      })
    case 'quote':
      return [{ _type: 'quote', _key: key, text: block.text, attribution: block.attribution, source: block.source }]
    case 'callout':
      return [{ _type: 'callout', _key: key, tone: block.tone, title: block.title, text: block.text }]
    case 'code':
      return [{ _type: 'code', _key: key, language: block.language, filename: block.filename, code: block.code }]
    case 'table':
      return [{ _type: 'table', _key: key, head: block.head, rows: block.rows.map((r, j) => ({ _key: `${key}r${j}`, cells: r })) }]
    case 'stat':
      return [{ _type: 'stat', _key: key, items: block.items.map((s, j) => ({ _key: `${key}s${j}`, value: s.value, label: s.label })) }]
    case 'image':
      return [{ _type: 'image', _key: key, _sanityAsset: asset(block.src), alt: block.alt, caption: block.caption, width: block.width }]
    case 'gallery':
      return [{ _type: 'gallery', _key: key, items: block.items.map((it, j) => ({ _type: 'image', _key: `${key}g${j}`, _sanityAsset: asset(it.src), alt: it.alt, caption: it.caption })) }]
    case 'embed':
      return [{ _type: 'embed', _key: key, kind: block.kind, url: block.url, title: block.title, ...(block.posterUrl ? { poster: { _type: 'image', _sanityAsset: asset(block.posterUrl) } } : {}) }]
    case 'divider':
      return [{ _type: 'divider', _key: key }]
  }
}

const docs: Record<string, unknown>[] = []

for (const a of AUTHORS) {
  docs.push({ _id: `author.${a.slug}`, _type: 'author', name: a.name, slug: { _type: 'slug', current: a.slug }, role: a.role, bio: a.bio })
}

for (const p of POSTS) {
  docs.push({
    _id: `post.${p.slug}`,
    _type: 'post',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    category: p.category,
    tags: p.tags,
    authors: p.authors.map((slug, j) => ({ _type: 'reference', _key: `a${j}`, _ref: `author.${slug}` })),
    publishedAt: isoDateTime(p.publishedAt),
    excerpt: p.excerpt,
    cover: p.coverImageUrl ? { _type: 'image', _sanityAsset: asset(p.coverImageUrl) } : undefined,
    coverFocus: p.coverFocus ?? 'center',
    featured: Boolean(p.featured),
    seo: p.seo ? { title: p.seo.title, description: p.seo.description } : undefined,
    body: p.body.flatMap((b, i) => toPT(b, `b${i}`)),
  })
}

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n'
const out = resolve(here, '../seed.ndjson')
writeFileSync(out, ndjson)
console.log(`Wrote ${docs.length} documents (${AUTHORS.length} authors + ${POSTS.length} posts) → ${out}`)
