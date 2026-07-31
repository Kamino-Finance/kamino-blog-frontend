/**
 * contentSource — the ONLY module the UI reaches for content.
 *
 * Content is pulled from Sanity at BUILD time (`scripts/sync-content.ts` writes
 * `./generated/content.json` via the adapter). This module reads that snapshot.
 * If it's empty — a dev checkout with no token, or Sanity unreachable — it falls
 * back to the local seed (`./posts`, `./authors`), so the app always has
 * content. Every derived value is computed once at module load.
 */
import generated from './generated/content.json'
import { POSTS as LOCAL_POSTS } from './posts'
import { AUTHORS as LOCAL_AUTHORS } from './authors'
import { CATEGORIES, getCategory } from './categories'
import { readingMinutes, stripInlineMarks } from '../lib/text'
import type { Author, CategorySlug, Post, ResolvedPost } from './types'

const GENERATED = generated as { posts: Post[]; authors: Author[] }
const sourcePosts: Post[] = GENERATED.posts.length > 0 ? GENERATED.posts : LOCAL_POSTS
const authorList: Author[] = GENERATED.authors.length > 0 ? GENERATED.authors : LOCAL_AUTHORS

function resolve(post: Post): ResolvedPost {
  return { ...post, readingMinutes: readingMinutes(post.body) }
}

/** All posts, newest first. */
const ALL: ResolvedPost[] = [...sourcePosts]
  .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  .map(resolve)

const BY_SLUG = new Map<string, ResolvedPost>(ALL.map((p) => [p.slug, p]))
const AUTHOR_BY_SLUG = new Map<string, Author>(authorList.map((a) => [a.slug, a]))

/** Look up an author by slug, from the active content source (Sanity or seed). */
export function getAuthor(slug: string): Author | undefined {
  return AUTHOR_BY_SLUG.get(slug)
}

export function getAllPosts(): ResolvedPost[] {
  return ALL
}

/** The single featured post for the index hero (falls back to newest). */
export function getFeaturedPost(): ResolvedPost {
  return ALL.find((p) => p.featured) ?? ALL[0]
}

/**
 * Curated set for the index highlights reel. A hand-picked spread across
 * categories (the editorial "start here"); falls back to the six most recent
 * so the reel is never empty.
 */
// Ordered so the reel does not lead with the posts shown in the blocks
// immediately above it on the index (featured + first two).
const HIGHLIGHT_SLUGS = [
  'fixed-rate-borrowing',
  'integrating-new-stablecoins',
  'falconx-institutional-liquidity',
  'stablecoin-yield-standard',
  'privy-onboarding',
  'allez-vault-risk-framework',
]

export function getHighlights(): ResolvedPost[] {
  const picked = HIGHLIGHT_SLUGS.map((s) => BY_SLUG.get(s)).filter((p): p is ResolvedPost => Boolean(p))
  return picked.length >= 3 ? picked : ALL.slice(0, 6)
}

export function getPost(slug: string): ResolvedPost | undefined {
  return BY_SLUG.get(slug)
}

export function getPostsByCategory(slug: CategorySlug): ResolvedPost[] {
  return ALL.filter((p) => p.category === slug)
}

/**
 * Related posts: same category first, then shared-tag overlap, newest as the
 * tiebreak. Excludes the post itself. Backfills from the rest of the category /
 * all posts so the rail is always full.
 */
export function getRelatedPosts(post: Post, limit = 3): ResolvedPost[] {
  const scored = ALL.filter((p) => p.slug !== post.slug).map((p) => {
    const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length
    const sameCategory = p.category === post.category ? 1 : 0
    return { post: p, score: sameCategory * 3 + sharedTags }
  })
  return scored
    .sort((a, b) => b.score - a.score || (a.post.publishedAt < b.post.publishedAt ? 1 : -1))
    .slice(0, limit)
    .map((s) => s.post)
}

export function getPostsByAuthor(authorSlug: string): ResolvedPost[] {
  return ALL.filter((p) => p.authors.includes(authorSlug))
}

/**
 * Client-side search over title, excerpt, tags, category, and author names.
 * Ranked: title hits beat excerpt/tag hits. Empty query returns nothing (the
 * UI shows recent posts as a resting state instead).
 */
export function searchPosts(query: string): ResolvedPost[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/)
  const scored = ALL.map((p) => {
    const title = p.title.toLowerCase()
    const excerpt = stripInlineMarks(p.excerpt).toLowerCase()
    const tags = p.tags.join(' ').toLowerCase()
    const authors = p.authors
      .map((slug) => getAuthor(slug)?.name.toLowerCase() ?? '')
      .join(' ')
    const category = getCategory(p.category).name.toLowerCase()
    let score = 0
    for (const term of terms) {
      if (title.includes(term)) score += 5
      if (tags.includes(term)) score += 3
      if (excerpt.includes(term)) score += 2
      if (authors.includes(term)) score += 2
      if (category.includes(term)) score += 1
    }
    return { post: p, score }
  })
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || (a.post.publishedAt < b.post.publishedAt ? 1 : -1))
    .map((s) => s.post)
}

/** Authors from the active content source (Sanity or seed). */
export const AUTHORS = authorList

export { CATEGORIES, getCategory }
