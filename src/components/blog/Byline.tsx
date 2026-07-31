import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { getAuthor } from '../../content/source'
import { formatDate, isoDateTime } from '../../lib/date'
import { ClockIcon } from '../../design/icons'

/**
 * Author byline — name(s) + date, and an optional reading time. No avatars
 * anywhere on the site (per brand direction). Two variants:
 *   - `card`    — compact single line for post blocks/cards.
 *   - `article` — the post header / featured hero (names then a meta line).
 */
export function Byline({
  authors,
  publishedAt,
  readingMinutes,
  variant = 'card',
  linkAuthors = true,
  className,
}: {
  authors: string[]
  publishedAt: string
  readingMinutes?: number
  variant?: 'card' | 'article'
  linkAuthors?: boolean
  className?: string
}) {
  const resolved = authors.map((slug) => getAuthor(slug)).filter((a): a is NonNullable<typeof a> => Boolean(a))
  if (resolved.length === 0) return null

  const nameEls = resolved.map((a, i) => (
    <span key={a.slug}>
      {linkAuthors ? (
        <Link to={`/authors/${a.slug}`} className="transition-hover-colors hover:text-foreground">
          {a.name}
        </Link>
      ) : (
        a.name
      )}
      {i < resolved.length - 1 && (
        <span className="text-muted-foreground">{i === resolved.length - 2 ? ' & ' : ', '}</span>
      )}
    </span>
  ))

  if (variant === 'article') {
    return (
      <div className={clsx('flex flex-col gap-[4px]', className)}>
        <div className="text-[15px] font-medium text-foreground">{nameEls}</div>
        <div className="flex items-center gap-[8px] text-[13px] text-muted-foreground">
          <time dateTime={isoDateTime(publishedAt)}>{formatDate(publishedAt)}</time>
          {readingMinutes != null && (
            <>
              <Dot />
              <span className="inline-flex items-center gap-[4px]">
                <ClockIcon size={13} /> {readingMinutes} min read
              </span>
            </>
          )}
        </div>
      </div>
    )
  }

  const names = resolved.map((a) => a.name)
  return (
    <div className={clsx('flex items-center gap-[8px] text-[13px] text-muted-foreground', className)}>
      <span className="font-medium text-foreground">
        {names.length > 1 ? `${names[0]} +${names.length - 1}` : names[0]}
      </span>
      <Dot />
      <time dateTime={isoDateTime(publishedAt)}>{formatDate(publishedAt)}</time>
      {readingMinutes != null && (
        <>
          <Dot />
          <span>{readingMinutes} min</span>
        </>
      )}
    </div>
  )
}

function Dot() {
  return <span className="h-[3px] w-[3px] rounded-full bg-border" aria-hidden />
}
