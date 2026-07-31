import { useParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Heading } from '../components/ui/atoms'
import { PostList } from '../components/blog/PostList'
import { NotFound } from './NotFound'
import { Seo } from '../components/Seo'
import { getAuthor, getPostsByAuthor } from '../content/source'

export function Author() {
  const { slug } = useParams<{ slug: string }>()
  const author = slug ? getAuthor(slug) : undefined
  if (!author) return <NotFound />

  const posts = getPostsByAuthor(author.slug)

  return (
    <>
      <Seo title={author.name} description={author.bio ?? `Posts by ${author.name} on the Kamino blog.`} />
      <Container size="wide">
        <header className="flex max-w-[680px] flex-col gap-[18px] pb-[40px] pt-[52px] sm:pt-[64px]">
          <div>
            <Heading as="h1" scale="section">
              {author.name}
            </Heading>
            <p className="mt-[6px] text-[14px] font-medium text-secondary">{author.role}</p>
          </div>
          {author.bio && <p className="text-[16px] leading-[1.6] text-muted-foreground">{author.bio}</p>}
          <p className="text-[13.5px] text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </header>

        <div className="border-t border-border pt-[44px]">
          <PostList posts={posts} />
        </div>
        <div className="h-[88px]" />
      </Container>
    </>
  )
}
