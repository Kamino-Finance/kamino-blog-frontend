import type { Block, InlineText } from '../content/types'

/** URL-safe slug from arbitrary text. Used for tags and heading ids. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Strip the inline markdown subset (`**`, `_`, `` ` ``, `[label](href)`) down
 * to plain text — for word counts, search indexing, and meta descriptions.
 */
export function stripInlineMarks(text: InlineText): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → label
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic (single asterisk)
    .replace(/`([^`]+)`/g, '$1') // code
    .replace(/(?<![\w*])_([^_]+)_(?![\w*])/g, '$1') // italic (underscore)
    .trim()
}

/** Approximate plain-text word count of a block's textual content. */
function blockWords(block: Block): number {
  const count = (t: string) => stripInlineMarks(t).split(/\s+/).filter(Boolean).length
  switch (block._type) {
    case 'paragraph':
      return count(block.text)
    case 'heading':
      return count(block.text)
    case 'quote':
      return count(block.text)
    case 'callout':
      return count(block.text) + (block.title ? count(block.title) : 0)
    case 'list':
      return block.items.reduce((n, item) => n + count(item), 0)
    case 'table':
      return block.rows.reduce((n, row) => n + row.reduce((m, cell) => m + count(cell), 0), 0)
    default:
      return 0
  }
}

/**
 * Reading time in minutes at 220 wpm, with a small fixed cost per visual block
 * (images/embeds/galleries) so image-heavy posts don't under-report. Floored at
 * 1 minute — mirrors how Stripe/Medium surface "N min read".
 */
export function readingMinutes(body: Block[]): number {
  const words = body.reduce((n, b) => n + blockWords(b), 0)
  const visuals = body.filter(
    (b) => b._type === 'image' || b._type === 'gallery' || b._type === 'embed',
  ).length
  return Math.max(1, Math.round(words / 220 + visuals * 0.15))
}
