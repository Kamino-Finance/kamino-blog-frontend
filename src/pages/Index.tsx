import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Heading } from '../components/ui/atoms'
import { CategoryFilter, type FilterValue } from '../components/blog/CategoryFilter'
import { SearchBar } from '../components/blog/SearchBar'
import { FeaturedHero } from '../components/blog/FeaturedHero'
import { PostList } from '../components/blog/PostList'
import { HighlightsReel } from '../components/blog/HighlightsReel'
import { NewsletterCta } from '../components/blog/NewsletterCta'
import { Seo } from '../components/Seo'
import { getAllPosts, getFeaturedPost, getHighlights } from '../content/source'
import { ArrowRightIcon } from '../design/icons'

// Blocks shown in the list before "View all posts" leads to the archive.
const HOME_LIST = 8

export function Index() {
  const all = getAllPosts()
  const featured = getFeaturedPost()
  const [filter, setFilter] = useState<FilterValue>('all')
  const isAll = filter === 'all'

  const pool = useMemo(
    () => (isAll ? all : all.filter((p) => p.category === filter)).filter((p) => p.slug !== featured.slug),
    [all, filter, isAll, featured.slug],
  )

  const listVisible = pool.slice(0, HOME_LIST)
  const hasMore = pool.length > listVisible.length
  const showReel = isAll && listVisible.length > 3
  const firstBatch = showReel ? listVisible.slice(0, 3) : listVisible
  const secondBatch = showReel ? listVisible.slice(3) : []

  return (
    <>
      <Seo description="Product launches, partner stories, and deep dives from the team building onchain finance at Kamino." />

      <Container>
        <div className="pt-[52px] sm:pt-[64px]">
          <FeaturedHero post={featured} />
        </div>

        <header className="pb-[24px] pt-[72px]">
          <Heading as="h1" scale="section">
            The latest
          </Heading>
        </header>

        <div className="flex flex-col gap-[14px] py-[6px] sm:flex-row sm:items-center sm:justify-between">
          <CategoryFilter value={filter} onChange={setFilter} />
          <SearchBar />
        </div>

        <div className="pt-[56px]">
          {listVisible.length > 0 ? (
            <PostList key={filter} posts={firstBatch} />
          ) : (
            <div className="rounded-[16px] border-[0.5px] border-border bg-canvas/60 py-[56px] text-center">
              <p className="text-[15px] font-medium text-foreground">Nothing here yet</p>
              <p className="mt-[4px] text-[14px] text-muted-foreground">New posts in this category are on the way.</p>
            </div>
          )}
        </div>
      </Container>

      {showReel && (
        <div className="pt-[96px]">
          <HighlightsReel posts={getHighlights()} />
        </div>
      )}

      <Container>
        {secondBatch.length > 0 && (
          <div className="pt-[96px]">
            <PostList key={filter} posts={secondBatch} />
          </div>
        )}

        {hasMore && (
          <div className="mt-[72px] flex justify-center">
            <Link
              to="/posts"
              className="inline-flex h-[48px] items-center justify-center gap-[8px] rounded-full border-[0.5px] border-border bg-background px-[24px] text-[14.5px] font-medium text-foreground transition-[transform,background-color,box-shadow] duration-150 ease-out hover:-translate-y-[0.5px] hover:bg-canvas hover:shadow-xs active:translate-y-0"
            >
              View all posts
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        )}

        <div className="pt-[88px]">
          <NewsletterCta />
        </div>
      </Container>
    </>
  )
}
