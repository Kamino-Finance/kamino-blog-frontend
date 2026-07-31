import type { Category, CategorySlug } from './types'

/**
 * The editorial categories. Each carries a design-system accent token used by
 * the cover-art palette and the category badge. Order here is the display order
 * in the category nav.
 */
export const CATEGORIES: Category[] = [
  {
    slug: 'announcements',
    name: 'Announcements',
    description: 'Launches, releases, and news from the team building Kamino.',
    accentVar: 'var(--base-secondary)',
  },
  {
    slug: 'partner-stories',
    name: 'Partner Stories',
    description: 'How issuers, institutions, and builders put Kamino to work.',
    accentVar: 'var(--base-secondary)',
  },
  {
    slug: 'deep-dives',
    name: 'Deep Dives',
    description: 'Long-form looks at the architecture, markets, and mechanics.',
    accentVar: 'var(--base-secondary)',
  },
]

const BY_SLUG = new Map<CategorySlug, Category>(CATEGORIES.map((c) => [c.slug, c]))

export function getCategory(slug: CategorySlug): Category {
  const category = BY_SLUG.get(slug)
  if (!category) throw new Error(`Unknown category: ${slug}`)
  return category
}
