import { motion } from 'framer-motion'
import clsx from 'clsx'
import { PostListItem } from './PostListItem'
import type { ResolvedPost } from '../../content/types'
import { STAGGER_CONTAINER } from '../../design/motion'

/**
 * Vertical stack of Stripe-style post blocks — generous spacing with a hairline
 * divider between blocks.
 */
export function PostList({ posts }: { posts: ResolvedPost[] }) {
  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible" className="flex flex-col">
      {posts.map((post, i) => (
        <div key={post.slug} className={clsx(i > 0 && 'mt-[56px] border-t border-border pt-[56px]')}>
          <PostListItem post={post} />
        </div>
      ))}
    </motion.div>
  )
}
