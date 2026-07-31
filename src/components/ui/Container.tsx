import { type ReactNode } from 'react'
import clsx from 'clsx'

/**
 * Centered content band with responsive gutters. One place for the blog's
 * horizontal rhythm so every surface lines up.
 *
 *   - `default` (1120px) — index grid, category pages.
 *   - `wide`    (1280px) — full-bleed hero rows and breakout media.
 *   - `prose`   (720px)  — article body measure, tuned for reading comfort.
 */
type Size = 'default' | 'wide' | 'prose'

const MAX: Record<Size, string> = {
  default: 'max-w-[1120px]',
  wide: 'max-w-[1280px]',
  prose: 'max-w-[720px]',
}

export function Container({
  children,
  size = 'default',
  className,
}: {
  children: ReactNode
  size?: Size
  className?: string
}) {
  return (
    <div className={clsx('mx-auto w-full px-[20px] sm:px-[28px] lg:px-[48px]', MAX[size], className)}>
      {children}
    </div>
  )
}
