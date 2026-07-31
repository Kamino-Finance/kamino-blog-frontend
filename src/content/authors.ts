import type { Author } from './types'

/**
 * Author directory. Bylines reference these by slug. Avatars render as branded
 * monograms seeded by `avatarSeed` (a real CMS supplies `avatarUrl` photos,
 * which win). Roles use plain-language team descriptors, not internal titles.
 */
export const AUTHORS: Author[] = [
  {
    slug: 'maya-osei',
    name: 'Maya Osei',
    role: 'Product',
    bio: 'Works on the consumer surfaces of Kamino — the flows that turn onchain finance into something anyone can use.',
    avatarSeed: 3,
  },
  {
    slug: 'daniel-roux',
    name: 'Daniel Roux',
    role: 'Protocol Engineering',
    bio: 'Builds and audits the lending core. Writes about the mechanics under the hood.',
    avatarSeed: 7,
  },
  {
    slug: 'priya-nair',
    name: 'Priya Nair',
    role: 'Markets & Risk',
    bio: 'Sets and monitors the risk frameworks behind Kamino’s markets and vaults.',
    avatarSeed: 12,
  },
  {
    slug: 'leo-fischer',
    name: 'Leo Fischer',
    role: 'Partnerships',
    bio: 'Works with issuers and institutions bringing real-world assets and capital onchain.',
    avatarSeed: 19,
  },
  {
    slug: 'the-kamino-team',
    name: 'The Kamino Team',
    role: 'Kamino',
    bio: 'Notes and announcements from across the team.',
    avatarSeed: 1,
  },
]

const BY_SLUG = new Map<string, Author>(AUTHORS.map((a) => [a.slug, a]))

export function getAuthor(slug: string): Author | undefined {
  return BY_SLUG.get(slug)
}
