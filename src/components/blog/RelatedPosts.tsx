import { Container } from '../ui/Container'
import { Heading } from '../ui/atoms'
import { PostGrid } from './PostGrid'
import { getRelatedPosts } from '../../content/source'
import type { ResolvedPost } from '../../content/types'

/**
 * "Keep reading" — related posts by shared category/tags. Sits on the canvas
 * band that closes the article, above the footer.
 */
export function RelatedPosts({ post }: { post: ResolvedPost }) {
  const related = getRelatedPosts(post, 3)
  if (related.length === 0) return null

  return (
    <section className="mt-[80px] border-t-[0.5px] border-border bg-canvas/50 py-[64px]">
      <Container size="wide">
        <Heading as="h2" scale="feature" className="mb-[28px]">
          Keep reading
        </Heading>
        <PostGrid posts={related} />
      </Container>
    </section>
  )
}
