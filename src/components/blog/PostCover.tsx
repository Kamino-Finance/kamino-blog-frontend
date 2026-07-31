import clsx from 'clsx'
import { CoverArt } from '../illustrations/CoverArt'
import type { ResolvedPost, Post } from '../../content/types'

const FOCUS_CLASS = {
  center: 'object-center',
  left: 'object-left',
  right: 'object-right',
  top: 'object-top',
} as const

/**
 * Renders a post's cover: the real illustration (`coverImageUrl`, supplied by
 * the design team via the CMS) when present, otherwise the branded generative
 * placeholder. One component so every surface — cards, hero, detail — resolves
 * covers identically. The Kamino banner assets are 16:9; containers should match
 * that aspect to avoid cropping the baked-in wordmarks.
 */
export function PostCover({
  post,
  priority = false,
  className,
}: {
  post: ResolvedPost | Post
  priority?: boolean
  className?: string
}) {
  if (post.coverImageUrl) {
    return (
      <img
        src={post.coverImageUrl}
        alt=""
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className={clsx('h-full w-full object-cover', FOCUS_CLASS[post.coverFocus ?? 'center'], className)}
      />
    )
  }
  return <CoverArt family={post.category} variant={post.cover.variant} className={className} />
}
