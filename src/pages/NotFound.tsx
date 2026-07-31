import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Heading } from '../components/ui/atoms'
import { Seo } from '../components/Seo'
import { KaminoMark } from '../design/BrandMarks'
import { ArrowRightIcon } from '../design/icons'
import { CATEGORIES } from '../content/categories'

export function NotFound() {
  return (
    <>
      <Seo title="Not found" description="The page you were looking for isn’t here." />
      <Container className="flex min-h-[64vh] flex-col items-center justify-center gap-[22px] py-[80px] text-center">
        <KaminoMark size={40} className="text-secondary" />
        <Heading as="h1" scale="section">
          We couldn’t find that page
        </Heading>
        <p className="max-w-[440px] text-[15px] leading-[1.55] text-muted-foreground">
          The post may have moved, or the link might be off by a character. Head back to the blog to find your way.
        </p>

        <Link
          to="/"
          className="inline-flex h-[46px] items-center justify-center gap-[7px] rounded-full bg-foreground px-[22px] text-[14.5px] font-medium text-background transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-[0.5px] hover:shadow-lift active:translate-y-0"
        >
          Back to all posts
          <ArrowRightIcon size={16} />
        </Link>

        <div className="mt-[8px] flex flex-wrap items-center justify-center gap-x-[20px] gap-y-[8px]">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="text-[13.5px] font-medium text-muted-foreground transition-hover-colors hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Container>
    </>
  )
}
