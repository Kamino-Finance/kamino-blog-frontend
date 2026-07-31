import { Link, useViewTransitionState } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ResolvedPost } from '../../content/types'
import { PostCover } from './PostCover'
import { Byline } from './Byline'
import { Heading } from '../ui/atoms'
import { getCategory } from '../../content/categories'
import { ArrowRightIcon } from '../../design/icons'
import { STAGGER_ITEM } from '../../design/motion'

/**
 * Post block for the list — modelled on Stripe's blog rows: a category eyebrow
 * (accent tick + label), a large title, a fuller ~3-line preview, byline, and a
 * "Read post" affordance on the left; a big banner on the right. Substantial
 * height (the image is large, not a thumbnail). The whole block is the link and
 * the banner carries the shared-element name for the cover→hero morph.
 */
export function PostListItem({ post, stagger = true }: { post: ResolvedPost; stagger?: boolean }) {
  const to = `/${post.slug}`
  const transitioning = useViewTransitionState(to)
  const category = getCategory(post.category)

  return (
    <motion.article variants={stagger ? STAGGER_ITEM : undefined}>
      <Link
        to={to}
        viewTransition
        className="group grid items-start gap-[24px] focus-visible:outline-none md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] md:gap-[44px]"
      >
        <div className="order-2 flex flex-col md:order-1">
          <Heading as="h3" scale="feature" className="transition-colors duration-150 group-hover:text-secondary">
            {post.title}
          </Heading>
          <p className="mt-[12px] line-clamp-3 max-w-[52ch] text-[16px] leading-[1.6] text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-[20px] flex flex-wrap items-center gap-x-[10px] gap-y-[6px]">
            <span className="text-[13px] font-medium" style={{ color: category.accentVar }}>
              {category.name}
            </span>
            <span className="h-[3px] w-[3px] rounded-full bg-border" aria-hidden />
            <Byline authors={post.authors} publishedAt={post.publishedAt} readingMinutes={post.readingMinutes} linkAuthors={false} />
            <ArrowRightIcon
              size={16}
              className="shrink-0 text-secondary opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-[3px] group-hover:opacity-100"
            />
          </div>
        </div>

        <div className="relative order-1 aspect-[16/9] overflow-hidden rounded-[16px] border-[0.5px] border-border md:order-2">
          <div
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            style={{ viewTransitionName: transitioning ? `cover-${post.slug}` : undefined }}
          >
            <PostCover post={post} />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
