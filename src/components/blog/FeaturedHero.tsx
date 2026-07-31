import { Link, useViewTransitionState } from 'react-router-dom'
import type { ResolvedPost } from '../../content/types'
import { PostCover } from './PostCover'
import { Heading } from '../ui/atoms'
import { Byline } from './Byline'
import { getCategory } from '../../content/categories'
import { ArrowRightIcon } from '../../design/icons'

/**
 * Featured hero — a distinct, elevated lead card (Stripe-style): editorial text
 * on the left, a large banner panel on the right, sitting on a soft accent wash
 * so it reads as the marquee post, clearly set apart from the list below. The
 * banner carries the shared-element name for the cover→hero morph.
 */
export function FeaturedHero({ post }: { post: ResolvedPost }) {
  const to = `/${post.slug}`
  const transitioning = useViewTransitionState(to)
  const category = getCategory(post.category)

  return (
    <div className="relative">
      {/* soft accent wash behind the card for depth */}
      <div
        className="absolute inset-x-[-24px] inset-y-[-16px] -z-10 rounded-[32px]"
        style={{ background: `radial-gradient(60% 120% at 85% 0%, color-mix(in srgb, ${category.accentVar} 10%, transparent) 0%, transparent 70%)` }}
        aria-hidden
      />
      <Link
        to={to}
        viewTransition
        className="group grid overflow-hidden rounded-[20px] border-[0.5px] border-border bg-background shadow-lift transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-[2px] hover:shadow-[0_2px_4px_0_color-mix(in_srgb,var(--base-foreground)_5%,transparent),0_20px_48px_-16px_color-mix(in_srgb,var(--base-foreground)_18%,transparent)] focus-visible:outline-none focus-visible:shadow-focus-ring lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]"
      >
        <div className="flex flex-col justify-center gap-[18px] p-[28px] sm:p-[40px] lg:py-[48px]">
          <span className="text-[13px] font-medium" style={{ color: category.accentVar }}>
            Featured
          </span>
          <Heading as="h2" scale="section">
            {post.title}
          </Heading>
          <p className="max-w-[46ch] text-[16px] leading-[1.6] text-muted-foreground">{post.excerpt}</p>
          <div className="flex items-end gap-[12px]">
            <Byline authors={post.authors} publishedAt={post.publishedAt} readingMinutes={post.readingMinutes} variant="article" linkAuthors={false} />
            <ArrowRightIcon
              size={17}
              className="mb-[1px] shrink-0 text-secondary opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-[3px] group-hover:opacity-100"
            />
          </div>
        </div>

        <div className="relative order-first min-h-[240px] overflow-hidden border-b-[0.5px] border-border sm:min-h-[300px] lg:order-last lg:min-h-0 lg:border-b-0 lg:border-l-[0.5px]">
          <div
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            style={{ viewTransitionName: transitioning ? `cover-${post.slug}` : undefined }}
          >
            <PostCover post={post} priority />
          </div>
        </div>
      </Link>
    </div>
  )
}
