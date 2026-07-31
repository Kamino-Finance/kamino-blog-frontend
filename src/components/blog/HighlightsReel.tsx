import { useRef } from 'react'
import { Heading } from '../ui/atoms'
import { PostCard } from './PostCard'
import { ChevronLeftIcon, ChevronRightIcon } from '../../design/icons'
import type { ResolvedPost } from '../../content/types'

// Left offset that aligns the first card with the page container's content edge.
const GUTTER = 'max(var(--page-gutter), calc((100% - var(--page-max)) / 2 + var(--page-gutter)))'

/**
 * Highlights reel — a full-bleed, snap-scrolling strip of post cards that
 * breaks up the vertical list (Stripe-style). It is rendered OUTSIDE the page
 * container so it can run to the screen edge: the heading aligns to the content
 * column, and the scroll track pads to the container gutter on the left while
 * extending to the viewport edge on the right (cards scroll off-screen rather
 * than being clipped inside the frame). Arrow buttons scroll it on desktop.
 *
 * The gutter uses `%` (the section is full-width, so `100%` is the body content
 * width) rather than `vw`, so the first card aligns exactly with the container
 * regardless of the scrollbar.
 */
export function HighlightsReel({ posts }: { posts: ResolvedPost[] }) {
  const railRef = useRef<HTMLDivElement>(null)

  const nudge = (dir: 1 | -1) => railRef.current?.scrollBy({ left: dir * 336, behavior: 'smooth' })

  if (posts.length === 0) return null

  return (
    <section aria-label="Highlights" className="w-full">
      <div className="mx-auto flex max-w-[1120px] items-end justify-between gap-[16px] px-[20px] sm:px-[28px] lg:px-[48px]">
        <Heading as="h2" scale="feature">
          Highlights
        </Heading>
        <div className="hidden items-center gap-[8px] md:flex">
          <ReelButton label="Scroll left" onClick={() => nudge(-1)}>
            <ChevronLeftIcon size={18} />
          </ReelButton>
          <ReelButton label="Scroll right" onClick={() => nudge(1)}>
            <ChevronRightIcon size={18} />
          </ReelButton>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-[22px] flex snap-x gap-[20px] overflow-x-auto scroll-smooth pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          // Align the first card to the container's content edge, then run to
          // the screen edge (cards scroll off rather than being clipped).
          // `scrollPaddingLeft` matches the gutter so snapping respects it
          // instead of pulling the first card to the raw scrollport edge.
          paddingLeft: GUTTER,
          paddingRight: 'var(--page-gutter)',
          scrollPaddingLeft: GUTTER,
        }}
      >
        {posts.map((post) => (
          <div key={post.slug} className="w-[300px] shrink-0 snap-start sm:w-[326px]">
            <PostCard post={post} stagger={false} />
          </div>
        ))}
      </div>
    </section>
  )
}

function ReelButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border-[0.5px] border-border text-muted-foreground transition-[color,background-color,border-color,transform] duration-150 ease-out hover:border-foreground/20 hover:text-foreground active:scale-95"
    >
      {children}
    </button>
  )
}
