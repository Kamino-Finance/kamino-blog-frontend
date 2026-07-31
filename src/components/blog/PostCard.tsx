import { Link, useViewTransitionState } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { ResolvedPost } from '../../content/types'
import { PostCover } from './PostCover'
import { CategoryBadge } from '../ui/Badge'
import { Byline } from './Byline'
import { STAGGER_ITEM } from '../../design/motion'

/**
 * Vertical post card — the grid unit. The whole card is the link (no inner
 * CTA). Hover follows the house recipe: a 2px lift, a soft shadow, a firming
 * border, and a slow cover zoom. On click, the cover carries a
 * `view-transition-name` so it morphs into the post hero where the browser
 * supports the View Transitions API.
 */
export function PostCard({ post, stagger = true }: { post: ResolvedPost; stagger?: boolean }) {
  const to = `/${post.slug}`
  const transitioning = useViewTransitionState(to)

  return (
    <motion.article
      layout
      variants={stagger ? STAGGER_ITEM : undefined}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
      className="h-full"
    >
      <Link
        to={to}
        viewTransition
        className="group flex h-full flex-col overflow-hidden rounded-[16px] border-[0.5px] border-border bg-background transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-[2px] hover:border-foreground/15 hover:shadow-lift focus-visible:outline-none focus-visible:shadow-focus-ring"
      >
        <div className="relative aspect-[16/9] overflow-hidden border-b-[0.5px] border-border">
          <div
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            style={{ viewTransitionName: transitioning ? `cover-${post.slug}` : undefined }}
          >
            <PostCover post={post} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[10px] p-[20px]">
          <h3
            className="text-foreground transition-colors duration-150 group-hover:text-secondary"
            style={{ fontFamily: "'Aeonik', sans-serif", fontWeight: 500, fontSize: 19, lineHeight: 1.24, letterSpacing: '-0.02em' }}
          >
            {post.title}
          </h3>
          <p className="line-clamp-2 text-[14px] leading-[1.5] text-muted-foreground">{post.excerpt}</p>
          <div className="mt-auto flex flex-col gap-[8px] pt-[6px]">
            <CategoryBadge category={post.category} variant="label" interactive={false} />
            <Byline authors={post.authors} publishedAt={post.publishedAt} readingMinutes={post.readingMinutes} linkAuthors={false} />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

/**
 * Horizontal compact row — used in search results and dense lists. Cover
 * thumbnail on the left, meta on the right.
 */
export function PostRow({ post, onNavigate }: { post: ResolvedPost; onNavigate?: () => void }) {
  return (
    <Link
      to={`/${post.slug}`}
      viewTransition
      onClick={onNavigate}
      className={clsx(
        'group flex items-center gap-[16px] rounded-[14px] border-[0.5px] border-transparent p-[10px] transition-[background-color,border-color] duration-150 ease-out hover:border-border hover:bg-canvas focus-visible:outline-none focus-visible:shadow-focus-ring',
      )}
    >
      <div className="relative aspect-[16/9] w-[120px] shrink-0 overflow-hidden rounded-[10px] border-[0.5px] border-border">
        <PostCover post={post} />
      </div>
      <div className="flex min-w-0 flex-col gap-[5px]">
        <CategoryBadge category={post.category} variant="label" interactive={false} />
        <h4 className="truncate text-[15px] font-medium leading-[1.3] text-foreground">{post.title}</h4>
        <p className="line-clamp-1 text-[13px] text-muted-foreground">{post.excerpt}</p>
      </div>
    </Link>
  )
}
