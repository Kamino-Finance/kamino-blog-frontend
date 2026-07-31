import { useId } from 'react'
import clsx from 'clsx'
import type { ArtFamily } from '../../content/types'
import { KaminoMark } from '../../design/BrandMarks'

/**
 * Branded cover art — the placeholder illustration system.
 *
 * The design team's real illustrations drop into these slots later (via a CMS
 * image URL). Until then, every post gets a distinct-but-coherent generated
 * composition: a category-tinted gradient field, one of four geometric motifs
 * selected deterministically by `variant`, a fine grid, and a soft light sheen.
 * All colour comes from design-system accent tokens, so it always reads as
 * Kamino.
 *
 * Raw SVG lives here by design (see eslint SVG_ALLOWED). Compositions are
 * hand-tuned rather than random so each reads as considered art.
 */

const FAMILY_ACCENT: Record<ArtFamily, string> = {
  announcements: 'var(--base-secondary)',
  'partner-stories': 'var(--base-success)',
  'deep-dives': 'var(--base-warning)',
  neutral: 'var(--base-secondary)',
}

type Props = {
  family: ArtFamily
  variant: number
  className?: string
  density?: 'default' | 'hero'
  animated?: boolean
}

export function CoverArt({ family, variant, className, density = 'default', animated = false }: Props) {
  const uid = useId().replace(/:/g, '')
  const accent = FAMILY_ACCENT[family] ?? FAMILY_ACCENT.neutral
  const composition = ((variant % 4) + 4) % 4

  return (
    <div className={clsx('relative h-full w-full overflow-hidden', className)} aria-hidden>
      {/* Base field — a rich accent-to-canvas diagonal so the art reads coloured,
          not grey. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(138deg, color-mix(in srgb, ${accent} 30%, var(--base-background)) 0%, color-mix(in srgb, ${accent} 9%, var(--base-background)) 46%, var(--base-background) 100%)`,
        }}
      />

      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`stroke-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: accent, stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: accent, stopOpacity: 0.25 }} />
          </linearGradient>
          <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: accent, stopOpacity: 0.7 }} />
            <stop offset="55%" style={{ stopColor: accent, stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: accent, stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Fine grid — seats behind every composition, ties the set together. */}
        <Grid accent={accent} />

        <g className={clsx(animated && 'blog-drift')} style={{ transformOrigin: 'center' }}>
          {composition === 0 && <Concentric uid={uid} density={density} />}
          {composition === 1 && <Orbs uid={uid} accent={accent} />}
          {composition === 2 && <MarkField uid={uid} accent={accent} />}
          {composition === 3 && <Flow uid={uid} accent={accent} density={density} />}
        </g>
      </svg>

      {/* Soft top sheen — a glossy highlight so the field has depth. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 30% -10%, color-mix(in srgb, var(--base-background) 70%, transparent) 0%, transparent 60%)',
        }}
      />
      {/* Vignette to seat the art in the card. */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 80px 0 color-mix(in srgb, var(--base-foreground) 7%, transparent)' }}
      />
    </div>
  )
}

/** Composition 0 — concentric arcs radiating from the lower-left, echoing the
 *  curve of the Kamino mark. */
function Concentric({ uid, density }: { uid: string; density: 'default' | 'hero' }) {
  const rings = density === 'hero' ? 9 : 7
  return (
    <g>
      <circle cx="120" cy="540" r="260" fill={`url(#glow-${uid})`} />
      {Array.from({ length: rings }).map((_, i) => (
        <circle
          key={i}
          cx="120"
          cy="540"
          r={90 + i * 74}
          fill="none"
          stroke={`url(#stroke-${uid})`}
          strokeWidth={i === 1 ? 3 : 1.25}
          opacity={0.9 - i * 0.08}
        />
      ))}
    </g>
  )
}

/** Composition 1 — overlapping luminous orbs. */
function Orbs({ uid, accent }: { uid: string; accent: string }) {
  const orbs = [
    { cx: 580, cy: 170, r: 190 },
    { cx: 300, cy: 380, r: 150 },
    { cx: 660, cy: 430, r: 110 },
  ]
  return (
    <g>
      {orbs.map((o, i) => (
        <circle key={i} cx={o.cx} cy={o.cy} r={o.r} fill={`url(#glow-${uid})`} opacity={0.85 - i * 0.16} />
      ))}
      {orbs.map((o, i) => (
        <circle key={`ring-${i}`} cx={o.cx} cy={o.cy} r={o.r} fill="none" stroke={`url(#stroke-${uid})`} strokeWidth="1.25" opacity="0.6" />
      ))}
      <circle cx="580" cy="170" r="5" fill={accent} />
    </g>
  )
}

/** Composition 2 — an oversized Kamino mark ghosted into the field. */
function MarkField({ uid, accent }: { uid: string; accent: string }) {
  return (
    <g>
      <circle cx="500" cy="300" r="300" fill={`url(#glow-${uid})`} opacity="0.7" />
      <g transform="translate(430 150) scale(12)" opacity="0.72" style={{ color: accent }}>
        <KaminoMark size={20} />
      </g>
      <circle cx="628" cy="150" r="7" fill={accent} />
      <circle cx="180" cy="470" r="4.5" fill={accent} opacity="0.8" />
    </g>
  )
}

/** Composition 3 — diagonal capital-flow lines with pulse nodes. */
function Flow({ uid, accent, density }: { uid: string; accent: string; density: 'default' | 'hero' }) {
  const lines = density === 'hero' ? 7 : 6
  return (
    <g>
      <circle cx="650" cy="130" r="210" fill={`url(#glow-${uid})`} />
      {Array.from({ length: lines }).map((_, i) => {
        const y = 80 + i * 84
        return (
          <path
            key={i}
            d={`M -40 ${y} C 240 ${y - 66}, 520 ${y + 90}, 860 ${y - 24}`}
            fill="none"
            stroke={`url(#stroke-${uid})`}
            strokeWidth={i % 2 === 0 ? 2 : 1.1}
            opacity={0.72 - i * 0.05}
          />
        )
      })}
      {[
        { cx: 210, cy: 150 },
        { cx: 470, cy: 320 },
        { cx: 650, cy: 232 },
      ].map((n, i) => (
        <circle key={i} cx={n.cx} cy={n.cy} r="5.5" fill={accent} />
      ))}
    </g>
  )
}

/** Shared fine dot grid, low opacity, seats behind every composition. */
function Grid({ accent }: { accent: string }) {
  const dots = []
  for (let x = 40; x < 800; x += 48) {
    for (let y = 40; y < 600; y += 48) {
      dots.push(<circle key={`${x}-${y}`} cx={x} cy={y} r="1.15" fill={accent} />)
    }
  }
  return <g opacity="0.08">{dots}</g>
}
