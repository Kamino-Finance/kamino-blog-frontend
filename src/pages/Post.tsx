import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heading } from '../components/ui/atoms'
import { CategoryBadge, TagChip } from '../components/ui/Badge'
import { Byline } from '../components/blog/Byline'
import { PostCover } from '../components/blog/PostCover'
import { PostBody } from '../components/blog/PostBody'
import { TableOfContents } from '../components/blog/TableOfContents'
import { ReadingProgress } from '../components/blog/ReadingProgress'
import { ShareBar } from '../components/blog/ShareBar'
import { RelatedPosts } from '../components/blog/RelatedPosts'
import { AuthorCard } from '../components/blog/AuthorCard'
import { NotFound } from './NotFound'
import { Seo } from '../components/Seo'
import { getPost } from '../content/source'
import { ChevronLeftIcon } from '../design/icons'

/**
 * Post detail. One consistent column system: header, full-width cover, and body
 * all share the frame's left edge (no staircasing). The body sits at a ~680px
 * reading measure with the table-of-contents in the right gutter on xl.
 */
export function Post() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined
  const articleRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  // Go back to where the reader came from; fall back to home if they landed
  // here directly (no in-app history).
  const goBack = () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate('/')
  }

  if (!post) return <NotFound />

  return (
    <>
      <Seo title={post.title} description={post.seo?.description ?? post.excerpt} type="article" image={post.coverImageUrl} />
      <ReadingProgress target={articleRef} />

      <article ref={articleRef} className="mx-auto w-full max-w-[1080px] px-[20px] sm:px-[28px] lg:px-[48px]">
        {/* Header — left-aligned to the frame */}
        <header className="max-w-[720px] pt-[36px]">
          <button
            type="button"
            onClick={goBack}
            className="group inline-flex items-center gap-[5px] text-[13.5px] font-medium text-muted-foreground transition-hover-colors hover:text-foreground"
          >
            <ChevronLeftIcon size={16} className="transition-transform duration-200 ease-out group-hover:-translate-x-[2px]" />
            Back
          </button>

          <div className="mt-[22px]">
            <CategoryBadge category={post.category} />
          </div>
          <Heading as="h1" scale="hero" className="mt-[18px]">
            {post.title}
          </Heading>
          <p className="mt-[18px] text-[19px] leading-[1.55] text-muted-foreground">{post.excerpt}</p>

          <div className="mt-[26px] flex flex-wrap items-center justify-between gap-[16px] border-t border-border pt-[22px]">
            <Byline authors={post.authors} publishedAt={post.publishedAt} readingMinutes={post.readingMinutes} variant="article" />
            <ShareBar title={post.title} className="hidden sm:flex" />
          </div>
        </header>

        {/* Cover — full frame width; shared-element morph target */}
        <div
          className="mt-[32px] aspect-[16/9] overflow-hidden rounded-[20px] border-[0.5px] border-border"
          style={{ viewTransitionName: `cover-${post.slug}` }}
        >
          <PostCover post={post} priority />
        </div>

        {/* Body + table of contents */}
        <div className="mt-[44px] flex gap-[64px]">
          <div className="min-w-0 max-w-[680px] flex-1">
            <PostBody body={post.body} family={post.category} />

            <div className="mt-[44px] flex flex-wrap items-center justify-between gap-[16px] border-t border-border pt-[24px]">
              <div className="flex flex-wrap gap-[8px]">
                {post.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
              <ShareBar title={post.title} />
            </div>

            <AuthorCard authors={post.authors} />
          </div>

          <aside className="hidden w-[200px] shrink-0 xl:block">
            <div className="sticky top-[100px]">
              <TableOfContents body={post.body} />
            </div>
          </aside>
        </div>
      </article>

      <RelatedPosts post={post} />
    </>
  )
}
