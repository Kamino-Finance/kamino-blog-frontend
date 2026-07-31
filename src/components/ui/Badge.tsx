import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { getCategory } from '../../content/categories'
import type { CategorySlug } from '../../content/types'

/**
 * Category indicator — the category name in the Kamino accent, no dot. `label`
 * (default) is the plain text form used on cards/blocks; `pill` is the tinted
 * badge used on the post-detail header.
 */
export function CategoryBadge({
  category,
  variant = 'pill',
  className,
  interactive = true,
}: {
  category: CategorySlug
  variant?: 'pill' | 'label'
  className?: string
  interactive?: boolean
}) {
  const { name, accentVar } = getCategory(category)

  if (variant === 'label') {
    const content = (
      <span className={clsx('text-[12.5px] font-medium', className)} style={{ color: accentVar }}>
        {name}
      </span>
    )
    return interactive ? (
      <Link to={`/category/${category}`} className="transition-opacity duration-150 hover:opacity-75">
        {content}
      </Link>
    ) : (
      content
    )
  }

  const content = (
    <span
      className={clsx('inline-flex items-center rounded-full px-[11px] py-[5px] text-[12.5px] font-medium', className)}
      style={{
        background: `color-mix(in srgb, ${accentVar} 12%, transparent)`,
        color: accentVar,
      }}
    >
      {name}
    </span>
  )
  return interactive ? (
    <Link to={`/category/${category}`} className="transition-transform duration-150 ease-out hover:-translate-y-[0.5px]">
      {content}
    </Link>
  ) : (
    content
  )
}

/** Light, non-interactive topic chip used on the article surface. */
export function TagChip({ tag, className }: { tag: string; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border-[0.5px] border-border bg-canvas px-[10px] py-[4px] text-[12px] font-medium text-muted-foreground',
        className,
      )}
    >
      {tag}
    </span>
  )
}
