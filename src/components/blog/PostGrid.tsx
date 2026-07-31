import { AnimatePresence, motion } from 'framer-motion'
import { PostCard } from './PostCard'
import type { ResolvedPost } from '../../content/types'
import { STAGGER_CONTAINER } from '../../design/motion'

/**
 * Responsive post grid with two motion behaviours:
 *   - Initial reveal: children stagger up via the container variants.
 *   - Filter reflow: `layout` + `<AnimatePresence mode="popLayout">` lets
 *     remaining cards glide to their new positions while removed cards fade out
 *     and new ones rise in — no snap.
 */
export function PostGrid({ posts }: { posts: ResolvedPost[] }) {
  return (
    <motion.div
      layout
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
