import type { Post } from '../types'
import { ANNOUNCEMENTS } from './announcements'
import { PARTNER_STORIES } from './partnerStories'
import { DEEP_DIVES } from './deepDives'

/**
 * The full seed corpus. Grouped by category in sibling modules (mirroring the
 * repo's single-file data-module pattern) and concatenated here. `source.ts`
 * sorts + resolves; nothing else imports these arrays directly.
 */
export const POSTS: Post[] = [...ANNOUNCEMENTS, ...PARTNER_STORIES, ...DEEP_DIVES]
