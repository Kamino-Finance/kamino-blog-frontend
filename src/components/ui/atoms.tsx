import { type ReactNode, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ArrowRightIcon } from '../../design/icons'

/**
 * Shared typographic + CTA atoms, so every blog surface reads as one design.
 *
 * Type is set in Aeonik with a fluid `clamp()` scale mirroring the Kamino
 * landing site. Per the house style, eyebrows are NOT uppercased — they render
 * a tracked, accent-tinted label in the case it's written in.
 */

export function Eyebrow({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span
      className={clsx('inline-block text-[13px] font-medium tracking-[0.02em] text-secondary', className)}
      style={style}
    >
      {children}
    </span>
  )
}

type HeadingScale = 'display' | 'hero' | 'section' | 'feature' | 'card'

const HEADING_SIZES: Record<HeadingScale, CSSProperties> = {
  display: { fontSize: 'clamp(44px, 6.5vw, 76px)', lineHeight: 1.0, letterSpacing: '-0.035em', fontWeight: 500 },
  hero: { fontSize: 'clamp(34px, 4.6vw, 56px)', lineHeight: 1.04, letterSpacing: '-0.03em', fontWeight: 500 },
  section: { fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.08, letterSpacing: '-0.025em', fontWeight: 500 },
  feature: { fontSize: 'clamp(22px, 2.2vw, 30px)', lineHeight: 1.12, letterSpacing: '-0.02em', fontWeight: 500 },
  card: { fontSize: 20, lineHeight: 1.2, letterSpacing: '-0.018em', fontWeight: 500 },
}

export function Heading({
  as: Tag = 'h2',
  scale = 'section',
  children,
  className,
  style,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div'
  scale?: HeadingScale
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <Tag
      className={clsx('text-foreground text-balance', className)}
      style={{ fontFamily: "'Aeonik', sans-serif", ...HEADING_SIZES[scale], ...style }}
    >
      {children}
    </Tag>
  )
}

/**
 * Text link with a trailing arrow that nudges right on hover. `to` renders a
 * router `<Link>`; `href` renders an anchor (external / mailto).
 */
export function ArrowLink({
  to,
  href,
  children,
  className,
  tone = 'secondary',
}: {
  to?: string
  href?: string
  children: ReactNode
  className?: string
  tone?: 'secondary' | 'foreground'
}) {
  const toneClass = tone === 'secondary' ? 'text-secondary hover:text-secondary-hover' : 'text-foreground'
  const inner = (
    <span className={clsx('group inline-flex items-center gap-[6px] text-[14px] font-medium transition-hover-colors', toneClass, className)}>
      {children}
      <ArrowRightIcon size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-[3px]" />
    </span>
  )
  if (to) return <Link to={to}>{inner}</Link>
  return (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noreferrer' : undefined}>
      {inner}
    </a>
  )
}
