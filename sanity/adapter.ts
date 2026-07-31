/**
 * Sanity → blog content adapter.
 *
 * This is the ONLY glue the FE team writes to go live: map Sanity documents to
 * the `Post`/`Block` model the UI already renders. Point `contentSource`
 * (src/content/source.ts) at these functions — backed by a Sanity fetch — and
 * the entire UI works unchanged.
 *
 * Portable text is serialised into the restricted inline-markdown the renderer
 * understands (**bold**, _italic_, `code`, [label](href)), so `<InlineText>`
 * and every block renderer stay exactly as-is.
 *
 * Types for Sanity inputs are kept intentionally light; this file lives outside
 * the app build (see eslint/tsconfig ignores) and is a reference for the FE team.
 */
import type { Block, Post, CategorySlug } from '../src/content/types'

type Span = { _type: 'span'; text: string; marks?: string[] }
type MarkDef = { _key: string; _type: string; href?: string }
type PTBlock = {
  _type: 'block'
  style?: string
  listItem?: 'bullet' | 'number'
  children: Span[]
  markDefs?: MarkDef[]
}
type PTNode = PTBlock | ({ _type: string } & Record<string, unknown>)

/** A caller-supplied image-URL builder, e.g. from `@sanity/image-url`. */
type UrlFor = (source: unknown) => string

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

/** Serialise one portable-text block's spans into inline markdown. */
function spansToInline(block: PTBlock): string {
  const defs = new Map((block.markDefs ?? []).map((d) => [d._key, d]))
  return block.children
    .map((span) => {
      let text = span.text
      const marks = span.marks ?? []
      if (marks.includes('code')) text = `\`${text}\``
      if (marks.includes('em')) text = `_${text}_`
      if (marks.includes('strong')) text = `**${text}**`
      const linkKey = marks.find((m) => defs.has(m))
      if (linkKey) {
        const href = defs.get(linkKey)?.href ?? '#'
        text = `[${text}](${href})`
      }
      return text
    })
    .join('')
}

/** Map a portable-text array to the blog's `Block[]`, grouping list items. */
export function portableTextToBlocks(pt: PTNode[], urlFor: UrlFor): Block[] {
  const blocks: Block[] = []
  let listBuffer: { style: 'bullet' | 'number'; items: string[] } | null = null

  const flushList = () => {
    if (listBuffer) {
      blocks.push({ _type: 'list', style: listBuffer.style, items: listBuffer.items })
      listBuffer = null
    }
  }

  for (const node of pt) {
    if (node._type === 'block') {
      const b = node as PTBlock
      if (b.listItem === 'bullet' || b.listItem === 'number') {
        if (listBuffer && listBuffer.style !== b.listItem) flushList()
        listBuffer ??= { style: b.listItem, items: [] }
        listBuffer.items.push(spansToInline(b))
        continue
      }
      flushList()
      const text = spansToInline(b)
      switch (b.style) {
        case 'h2':
          blocks.push({ _type: 'heading', level: 2, text, id: slugify(text) })
          break
        case 'h3':
          blocks.push({ _type: 'heading', level: 3, text, id: slugify(text) })
          break
        case 'lead':
          blocks.push({ _type: 'paragraph', variant: 'lead', text })
          break
        case 'blockquote':
          blocks.push({ _type: 'quote', text })
          break
        default:
          if (text.trim()) blocks.push({ _type: 'paragraph', text })
      }
      continue
    }

    flushList()
    const n = node as Record<string, unknown>
    switch (node._type) {
      case 'image':
        blocks.push({ _type: 'image', src: urlFor(n), alt: String(n.alt ?? ''), caption: n.caption as string | undefined, width: (n.width as 'inline' | 'wide' | 'full') ?? 'wide' })
        break
      case 'gallery':
        blocks.push({ _type: 'gallery', items: ((n.items as Record<string, unknown>[]) ?? []).map((it) => ({ src: urlFor(it), alt: String(it.alt ?? ''), caption: it.caption as string | undefined })) })
        break
      case 'callout':
        blocks.push({ _type: 'callout', tone: (n.tone as 'info' | 'success' | 'warning') ?? 'info', title: n.title as string | undefined, text: String(n.text ?? '') })
        break
      case 'code':
        blocks.push({ _type: 'code', language: (n.language as Extract<Block, { _type: 'code' }>['language']) ?? 'text', filename: n.filename as string | undefined, code: String(n.code ?? '') })
        break
      case 'stat':
        blocks.push({ _type: 'stat', items: (n.items as { value: string; label: string }[]) ?? [] })
        break
      case 'table':
        blocks.push({
          _type: 'table',
          head: (n.head as string[]) ?? [],
          rows: ((n.rows as { cells?: string[] }[]) ?? []).map((r) => r.cells ?? []),
        })
        break
      case 'quote':
        blocks.push({
          _type: 'quote',
          text: String(n.text ?? ''),
          attribution: n.attribution as string | undefined,
          source: n.source as string | undefined,
        })
        break
      case 'embed':
        blocks.push({ _type: 'embed', kind: (n.kind as 'video' | 'tweet') ?? 'video', url: String(n.url ?? ''), title: n.title as string | undefined, posterUrl: n.poster ? urlFor(n.poster) : undefined })
        break
      case 'divider':
        blocks.push({ _type: 'divider' })
        break
      default:
        // Surface unmapped block types loudly rather than dropping them silently.
        console.warn(`[sanity adapter] unmapped block type: ${node._type}`)
    }
  }

  flushList()
  return blocks
}

type SanityPost = {
  slug: { current: string }
  title: string
  category: CategorySlug
  tags?: string[]
  authors?: { slug: { current: string } }[]
  publishedAt: string
  updatedAt?: string
  excerpt: string
  cover?: unknown
  coverFocus?: 'center' | 'left' | 'right' | 'top'
  featured?: boolean
  seo?: { title?: string; description?: string; ogImage?: unknown }
  body: PTNode[]
}

/** Map a fetched Sanity post document to the app's `Post`. */
export function toPost(doc: SanityPost, urlFor: UrlFor): Post {
  return {
    slug: doc.slug.current,
    title: doc.title,
    category: doc.category,
    tags: doc.tags ?? [],
    authors: (doc.authors ?? []).map((a) => a.slug.current),
    publishedAt: doc.publishedAt.slice(0, 10),
    updatedAt: doc.updatedAt?.slice(0, 10),
    excerpt: doc.excerpt,
    cover: { variant: 0 },
    coverImageUrl: doc.cover ? urlFor(doc.cover) : undefined,
    coverFocus: doc.coverFocus,
    featured: doc.featured,
    seo: doc.seo && { title: doc.seo.title, description: doc.seo.description, ogImage: doc.seo.ogImage ? urlFor(doc.seo.ogImage) : undefined },
    body: portableTextToBlocks(doc.body, urlFor),
  }
}
