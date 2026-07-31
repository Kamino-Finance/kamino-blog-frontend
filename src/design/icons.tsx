import { type SVGProps } from 'react'

/**
 * Curated glyph set for the blog.
 *
 * The Kamino design system ships 1,592 icons; the blog needs ~20, so rather
 * than vendor the whole generated file we hand-author the small subset here in
 * one consistent style — 24×24 grid, 1.5px stroke, round caps/joins, colour via
 * `currentColor`. This mirrors the landing site's practice of authoring its
 * bespoke marks locally (`InlineArrow`, social glyphs) and keeps the app
 * portable. This is the only sanctioned place for stroke-glyph SVG (see
 * `eslint.config.js` → SVG_ALLOWED).
 */

export type IconProps = {
  size?: number
  className?: string
  strokeWidth?: number
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'ref'>

function Icon({ size = 20, strokeWidth = 1.5, className = '', children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...rest}
    >
      {children}
    </svg>
  )
}

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>
)
export const ChevronUpIcon = (p: IconProps) => (
  <Icon {...p}><path d="M6 15l6-6 6 6" /></Icon>
)
export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>
)
export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p}><path d="M15 6l-6 6 6 6" /></Icon>
)
export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 12h15m0 0l-6-6m6 6l-6 6" /></Icon>
)
export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}><path d="M20 12H5m0 0l6-6m-6 6l6 6" /></Icon>
)
export const ArrowUpRightIcon = (p: IconProps) => (
  <Icon {...p}><path d="M7 17L17 7M17 7H8m9 0v9" /></Icon>
)
export const ArrowDownIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 4v15m0 0l6-6m-6 6l-6-6" /></Icon>
)
export const SearchIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>
)
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>
)
export const CopyIcon = (p: IconProps) => (
  <Icon {...p}><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></Icon>
)
export const LinkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 13a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.5 1.5" />
    <path d="M14 11a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5" />
  </Icon>
)
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 12.5l5 5 11-11" /></Icon>
)
export const ClockIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></Icon>
)
export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" /><path d="M4 10h16M8 3.5v4M16 3.5v4" />
  </Icon>
)
export const HashIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9 4L7 20M17 4l-2 16M5 9h15M4 15h15" /></Icon>
)
export const ShareIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 15V4m0 0L8 8m4-4l4 4" /><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
  </Icon>
)
export const RssIcon = (p: IconProps) => (
  <Icon {...p}><path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8" /><circle cx="6" cy="18" r="1.4" fill="currentColor" stroke="none" /></Icon>
)
export const ListIcon = (p: IconProps) => (
  <Icon {...p}><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></Icon>
)
export const MenuIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
)
export const MailIcon = (p: IconProps) => (
  <Icon {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M4 7.5l8 5.5 8-5.5" /></Icon>
)
export const ZoomIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5M11 8.5v5M8.5 11h5" /></Icon>
)
export const InfoIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="7.75" r="0.6" fill="currentColor" stroke="none" /></Icon>
)
export const AlertIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 4.5L21 19.5H3L12 4.5z" /><path d="M12 10v4" /><circle cx="12" cy="16.75" r="0.6" fill="currentColor" stroke="none" /></Icon>
)
export const PlayIcon = (p: IconProps) => (
  <Icon {...p}><path d="M8 5.5l11 6.5-11 6.5v-13z" fill="currentColor" /></Icon>
)
export const QuoteGlyph = (p: IconProps) => (
  <Icon {...p} strokeWidth={0}>
    <path
      d="M9.5 6C6.5 7.2 4.5 10 4.5 13.4V18h6v-6H7.6c0-2 1.2-3.4 3-4.2L9.5 6zm9 0c-3 1.2-5 4-5 7.4V18h6v-6h-2.9c0-2 1.2-3.4 3-4.2L18.5 6z"
      fill="currentColor"
    />
  </Icon>
)
