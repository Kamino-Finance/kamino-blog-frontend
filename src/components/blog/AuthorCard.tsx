import { Link } from 'react-router-dom'
import { getAuthor } from '../../content/source'
import { ArrowRightIcon } from '../../design/icons'

/**
 * End-of-post author card(s) — avatar, name, role, and bio, linking to the
 * author's collected posts. Renders one row per author.
 */
export function AuthorCard({ authors }: { authors: string[] }) {
  const resolved = authors.map((slug) => getAuthor(slug)).filter((a): a is NonNullable<typeof a> => Boolean(a))
  if (resolved.length === 0) return null

  return (
    <div className="mt-[48px] flex flex-col gap-[16px] rounded-[16px] border-[0.5px] border-border bg-canvas/50 p-[24px]">
      {resolved.map((author) => (
        <div key={author.slug} className="flex items-start gap-[16px]">
          <div className="min-w-0">
            <div className="flex items-baseline gap-[8px]">
              <Link to={`/authors/${author.slug}`} className="text-[15px] font-medium text-foreground transition-hover-colors hover:text-secondary">
                {author.name}
              </Link>
              <span className="text-[13px] text-muted-foreground">{author.role}</span>
            </div>
            {author.bio && <p className="mt-[6px] text-[14px] leading-[1.55] text-muted-foreground">{author.bio}</p>}
            <Link
              to={`/authors/${author.slug}`}
              className="group mt-[10px] inline-flex items-center gap-[6px] text-[13px] font-medium text-secondary transition-hover-colors hover:text-secondary-hover"
            >
              More from {author.name.split(' ')[0]}
              <ArrowRightIcon size={14} className="transition-transform duration-200 ease-out group-hover:translate-x-[3px]" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
