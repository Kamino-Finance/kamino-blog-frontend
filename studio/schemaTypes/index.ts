import { post } from './post'
import { author } from './author'
import { blockContent } from './blockContent'

/**
 * Schema types for the blog's Sanity Studio. Wire into your Studio config:
 *
 *   import { schemaTypes } from './schema'
 *   export default defineConfig({ schema: { types: schemaTypes }, ... })
 */
export const schemaTypes = [post, author, blockContent]
