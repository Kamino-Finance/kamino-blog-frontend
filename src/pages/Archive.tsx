import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Container } from '../components/ui/Container'
import { Heading } from '../components/ui/atoms'
import { PostList } from '../components/blog/PostList'
import { Seo } from '../components/Seo'
import { getAllPosts } from '../content/source'
import { ChevronLeftIcon, ChevronRightIcon } from '../design/icons'

const PER_PAGE = 6

export function Archive() {
  const all = getAllPosts()
  const [page, setPage] = useState(1)
  const topRef = useRef<HTMLDivElement>(null)

  const pageCount = Math.max(1, Math.ceil(all.length / PER_PAGE))
  const start = (page - 1) * PER_PAGE
  const visible = all.slice(start, start + PER_PAGE)

  function goTo(next: number) {
    setPage(next)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Seo title="All posts" description="Every post from the Kamino blog — announcements, partner stories, and deep dives." />
      <Container>
        <div ref={topRef} className="scroll-mt-[92px]" />
        <header className="max-w-[680px] pb-[28px] pt-[52px] sm:pt-[64px]">
          <Heading as="h1" scale="section">
            All posts
          </Heading>
          <p className="mt-[16px] text-[15px] text-muted-foreground">
            {all.length} {all.length === 1 ? 'post' : 'posts'} and counting.
          </p>
        </header>

        <div className="pt-[16px]">
          <PostList key={page} posts={visible} />
        </div>

        {pageCount > 1 && (
          <nav className="mt-[72px] flex items-center justify-center gap-[8px]" aria-label="Pagination">
            <PageArrow label="Previous page" disabled={page === 1} onClick={() => goTo(page - 1)}>
              <ChevronLeftIcon size={18} />
            </PageArrow>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goTo(n)}
                aria-current={n === page ? 'page' : undefined}
                className={clsx(
                  'inline-flex h-[38px] min-w-[38px] items-center justify-center rounded-full px-[12px] text-[14px] font-medium transition-colors duration-150',
                  n === page ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-canvas hover:text-foreground',
                )}
              >
                {n}
              </button>
            ))}
            <PageArrow label="Next page" disabled={page === pageCount} onClick={() => goTo(page + 1)}>
              <ChevronRightIcon size={18} />
            </PageArrow>
          </nav>
        )}

        <div className="h-[88px]" />
      </Container>
    </>
  )
}

function PageArrow({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border-[0.5px] border-border text-muted-foreground transition-[color,background-color,border-color] duration-150 hover:border-foreground/20 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}
