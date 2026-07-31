import { useParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Eyebrow, Heading } from '../components/ui/atoms'
import { PostList } from '../components/blog/PostList'
import { NotFound } from './NotFound'
import { Seo } from '../components/Seo'
import { CATEGORIES, getCategory } from '../content/categories'
import { getPostsByCategory } from '../content/source'
import type { CategorySlug } from '../content/types'

const VALID = new Set(CATEGORIES.map((c) => c.slug))

export function Category() {
  const { slug } = useParams<{ slug: string }>()
  if (!slug || !VALID.has(slug as CategorySlug)) return <NotFound />

  const category = getCategory(slug as CategorySlug)
  const posts = getPostsByCategory(slug as CategorySlug)

  return (
    <>
      <Seo title={category.name} description={category.description} />
      <Container size="wide">
        <header className="max-w-[680px] pb-[40px] pt-[52px] sm:pt-[64px]">
          <Eyebrow style={{ color: category.accentVar }}>Category</Eyebrow>
          <Heading as="h1" scale="hero" className="mt-[14px]">
            {category.name}
          </Heading>
          <p className="mt-[16px] text-[16px] leading-[1.6] text-muted-foreground sm:text-[17px]">
            {category.description}
          </p>
          <p className="mt-[10px] text-[13.5px] text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </header>

        <div className="pt-[16px]">
          <PostList posts={posts} />
        </div>

        <div className="h-[88px]" />
      </Container>
    </>
  )
}
