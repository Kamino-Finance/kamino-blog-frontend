/**
 * Content model — the single source of truth for the blog's data shape.
 *
 * This is deliberately shaped like what a headless CMS (Sanity) returns, so the
 * entire UI renders against this model and NOT against any storage detail.
 * Today the data is local, typed seed content (`./posts/*`); at launch a thin
 * adapter maps Sanity documents → these same types (see `../../sanity/`), and
 * the UI never changes. The `contentSource` in `./source.ts` is the only place
 * the UI reaches for data.
 */

/** The three editorial categories. Exactly one per post. */
export type CategorySlug = 'announcements' | 'partner-stories' | 'deep-dives'

export interface Category {
  slug: CategorySlug
  /** Display name, e.g. "Partner Stories". */
  name: string
  /** One-line description used on the category landing + filter chips. */
  description: string
  /**
   * Category accent, expressed as a design-system CSS variable name (no raw
   * hex — token rule). Drives the cover-art palette family and badge tint.
   */
  accentVar: string
}

export interface Author {
  slug: string
  name: string
  /** Role/title shown under the byline, e.g. "Protocol Engineering". */
  role: string
  /** Short bio for the author view. */
  bio?: string
  /**
   * Deterministic seed for the generated monogram avatar. A real CMS supplies
   * a photo URL via `avatarUrl` instead; when present it wins.
   */
  avatarSeed: number
  avatarUrl?: string
}

export interface SeoMeta {
  /** Overrides the `<title>`; defaults to the post title + " · Kamino Blog". */
  title?: string
  /** Meta description + OG description; defaults to the excerpt. */
  description?: string
  /** OG image URL. When absent, the post's cover art is used. */
  ogImage?: string
}

/* ─── Cover / inline art ──────────────────────────────────────────────────
 * Illustration slots are first-class. Today they render a branded, deterministic
 * placeholder (the design team's real illustrations drop in later via the CMS).
 * Any art block also accepts a real `src`, which wins when present — that's the
 * seam the design team fills.
 */

export type ArtFamily = CategorySlug | 'neutral'

export interface ArtSpec {
  /** Which generated composition to render (deterministic, stable per post). */
  variant: number
  /** Palette family; defaults to the post's category when omitted. */
  family?: ArtFamily
}

/* ─── Body blocks (Sanity portable-text-shaped) ───────────────────────────── */

/**
 * Inline text carries a restricted markdown subset that the renderer resolves:
 * `**bold**`, `_italic_`, `` `code` ``, and `[label](href)`. The Sanity adapter
 * emits these same strings from portable-text spans, so the renderer is shared.
 */
export type InlineText = string

export interface ParagraphBlock {
  _type: 'paragraph'
  text: InlineText
  /** `lead` renders a larger intro paragraph (used right after the hero). */
  variant?: 'default' | 'lead'
}

export interface HeadingBlock {
  _type: 'heading'
  level: 2 | 3
  text: string
  /** Stable anchor id for the table of contents + deep links. */
  id: string
}

export interface ImageBlock {
  _type: 'image'
  /** Real image URL (CMS-supplied). When absent, `art` renders in its place. */
  src?: string
  art?: ArtSpec
  alt: string
  caption?: InlineText
  /** Column treatment: text-column, breakout, or edge-to-edge. */
  width: 'inline' | 'wide' | 'full'
}

export interface GalleryBlock {
  _type: 'gallery'
  items: { src?: string; art?: ArtSpec; alt: string; caption?: InlineText }[]
}

export interface QuoteBlock {
  _type: 'quote'
  text: string
  attribution?: string
  /** Optional role/company for the attributed speaker. */
  source?: string
}

export interface CalloutBlock {
  _type: 'callout'
  tone: 'info' | 'success' | 'warning'
  title?: string
  text: InlineText
}

export interface CodeBlock {
  _type: 'code'
  language: 'ts' | 'tsx' | 'bash' | 'json' | 'rust' | 'text'
  filename?: string
  code: string
}

export interface ListBlock {
  _type: 'list'
  style: 'bullet' | 'number'
  items: InlineText[]
}

export interface TableBlock {
  _type: 'table'
  head: string[]
  rows: string[][]
}

export interface DividerBlock {
  _type: 'divider'
}

export interface EmbedBlock {
  _type: 'embed'
  kind: 'video' | 'tweet'
  url: string
  title?: string
  /** Real poster image URL for video embeds (CMS-supplied). */
  posterUrl?: string
  /** Poster/preview art for video embeds when no `posterUrl` is set. */
  art?: ArtSpec
}

export interface StatBlock {
  _type: 'stat'
  items: { value: string; label: string }[]
}

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | GalleryBlock
  | QuoteBlock
  | CalloutBlock
  | CodeBlock
  | ListBlock
  | TableBlock
  | DividerBlock
  | EmbedBlock
  | StatBlock

export interface Post {
  slug: string
  title: string
  category: CategorySlug
  tags: string[]
  /** Author slugs; first is the primary byline. */
  authors: string[]
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string
  updatedAt?: string
  /** Card + meta-description summary. Keep to ~1–2 sentences. */
  excerpt: string
  /** Cover art spec — the placeholder illustration slot. */
  cover: ArtSpec
  /** Real cover image URL (CMS-supplied); wins over `cover` art when present. */
  coverImageUrl?: string
  /**
   * Focal point for cropping the cover into card/hero aspect ratios — the
   * local analog of a CMS image hotspot. Defaults to `center`; set it when a
   * banner's key content (e.g. an edge-anchored headline) sits off-centre.
   */
  coverFocus?: 'center' | 'left' | 'right' | 'top'
  featured?: boolean
  seo?: SeoMeta
  body: Block[]
}

/** A post with derived, render-time fields the UI reads. */
export interface ResolvedPost extends Post {
  readingMinutes: number
}
