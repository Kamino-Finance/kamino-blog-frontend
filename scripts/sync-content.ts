/**
 * Build-time content sync. Fetches posts + authors from Sanity, maps them to
 * the app's content model via the adapter, and writes
 * `src/content/generated/content.json` — which `contentSource` reads.
 *
 * Runs in `prebuild` (and can be run manually via `npm run sync`). Local builds
 * fall back to seed content when Sanity is unavailable. Production builds set
 * `SANITY_SYNC_REQUIRED=true` so missing or unreachable CMS content fails the
 * deployment instead.
 *
 * The read token is build-only (server-side); it never reaches the browser.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import { toPost } from '../sanity/adapter'
import type { Author, Post } from '../src/content/types'

const here = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(here, '..')
const outDir = resolve(appRoot, 'src/content/generated')
const outFile = resolve(outDir, 'content.json')

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? '2kksiz70'
const DATASET = process.env.SANITY_DATASET ?? 'production'
const SANITY_SYNC_REQUIRED = process.env.SANITY_SYNC_REQUIRED === 'true'

// Minimal .env.local loader so local runs pick up the token without a
// dependency; in CI the token comes from the deployment environment.
function loadLocalEnv() {
  const envPath = resolve(appRoot, '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

function write(payload: { posts: Post[]; authors: Author[] }) {
  mkdirSync(outDir, { recursive: true })
  writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n')
}

async function main() {
  if (!process.env.SANITY_READ_TOKEN) loadLocalEnv()
  const token = process.env.SANITY_READ_TOKEN

  if (!token) {
    if (SANITY_SYNC_REQUIRED) throw new Error('SANITY_READ_TOKEN is required for production builds')
    console.warn('[sync-content] No SANITY_READ_TOKEN; writing empty payload (app falls back to local seed).')
    write({ posts: [], authors: [] })
    return
  }

  const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: '2025-02-19', token, useCdn: false, perspective: 'published' })
  const builder = createImageUrlBuilder(client)
  const urlFor = (source: unknown) => builder.image(source as never).url()

  try {
    const [rawPosts, rawAuthors] = await Promise.all([
      client.fetch<Record<string, unknown>[]>(
        `*[_type=="post" && defined(slug.current)]{ ..., "authors": authors[]->{"slug": slug} } | order(publishedAt desc)`,
      ),
      client.fetch<{ slug: string; name: string; role?: string; bio?: string }[]>(
        `*[_type=="author" && defined(slug.current)]{"slug": slug.current, name, role, bio}`,
      ),
    ])

    const posts: Post[] = rawPosts.map((doc) => toPost(doc as never, urlFor))
    const authors: Author[] = rawAuthors.map((a) => ({ slug: a.slug, name: a.name, role: a.role ?? '', bio: a.bio, avatarSeed: 0 }))

    write({ posts, authors })
    console.log(`[sync-content] Wrote ${posts.length} posts + ${authors.length} authors from Sanity → ${outFile}`)
  } catch (error) {
    if (SANITY_SYNC_REQUIRED) throw error
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`[sync-content] Sanity fetch failed (${message}); writing empty payload (app falls back to local seed).`)
    write({ posts: [], authors: [] })
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[sync-content] ${message}`)
  process.exitCode = 1
})
