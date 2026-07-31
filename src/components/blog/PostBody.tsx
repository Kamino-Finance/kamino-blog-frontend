import { motion } from 'framer-motion'
import clsx from 'clsx'
import { InlineText } from './InlineText'
import { CodeBlock } from './blocks/CodeBlock'
import { ArticleImage, Gallery } from './blocks/ArticleImage'
import { InfoIcon, AlertIcon, PlayIcon, QuoteGlyph, HashIcon, ArrowUpRightIcon } from '../../design/icons'
import { SocialGlyph } from '../../design/BrandMarks'
import { ENTER_EASE } from '../../design/motion'
import type { ArtFamily, Block, CalloutBlock, EmbedBlock, QuoteBlock, StatBlock, TableBlock } from '../../content/types'

/**
 * Article body renderer. Maps the CMS-shaped block array to typeset prose. The
 * measure, rhythm, and every block treatment live here — this is where a lot of
 * the reading-experience polish sits. `family` is the post category, used as
 * the palette for placeholder illustrations.
 */
export function PostBody({ body, family }: { body: Block[]; family: ArtFamily }) {
  return (
    <div className="[&>*:first-child]:mt-0">
      {body.map((block, i) => (
        <BlockView key={i} block={block} family={family} />
      ))}
    </div>
  )
}

function BlockView({ block, family }: { block: Block; family: ArtFamily }) {
  switch (block._type) {
    case 'paragraph':
      return block.variant === 'lead' ? (
        <p className="mt-[24px] text-[20px] leading-[1.6] text-foreground sm:text-[21px]">
          <InlineText text={block.text} />
        </p>
      ) : (
        <p className="mt-[22px] text-[18px] leading-[1.72] text-foreground/85">
          <InlineText text={block.text} />
        </p>
      )

    case 'heading': {
      const Tag = block.level === 2 ? 'h2' : 'h3'
      return (
        <Tag
          id={block.id}
          className={clsx(
            'group scroll-mt-[92px] text-foreground',
            block.level === 2 ? 'mt-[48px] text-[27px] leading-[1.2]' : 'mt-[36px] text-[21px] leading-[1.25]',
          )}
          style={{ fontFamily: "'Aeonik', sans-serif", fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          <a href={`#${block.id}`} className="relative">
            <span className="absolute -left-[26px] top-1/2 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <HashIcon size={18} />
            </span>
            {block.text}
          </a>
        </Tag>
      )
    }

    case 'image':
      return (
        <div className="mt-[32px]">
          <ArticleImage block={block} family={family} />
        </div>
      )

    case 'gallery':
      return (
        <div className="mt-[32px]">
          <Gallery block={block} family={family} />
        </div>
      )

    case 'quote':
      return <Quote block={block} />

    case 'callout':
      return <Callout block={block} />

    case 'code':
      return (
        <div className="mt-[28px]">
          <CodeBlock block={block} />
        </div>
      )

    case 'list':
      return block.style === 'bullet' ? (
        <ul className="mt-[20px] flex flex-col gap-[12px]">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-[13px] text-[18px] leading-[1.65] text-foreground/85">
              <span className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: 'color-mix(in srgb, var(--base-secondary) 70%, transparent)' }} aria-hidden />
              <span><InlineText text={item} /></span>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="mt-[20px] flex flex-col gap-[12px]">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-[14px] text-[18px] leading-[1.65] text-foreground/85">
              <span className="mt-[1px] w-[22px] shrink-0 font-mono text-[15px] font-medium text-secondary tabular-nums">{i + 1}.</span>
              <span><InlineText text={item} /></span>
            </li>
          ))}
        </ol>
      )

    case 'table':
      return <Table block={block} />

    case 'stat':
      return <Stat block={block} />

    case 'embed':
      return <Embed block={block} family={family} />

    case 'divider':
      return (
        <div className="mt-[40px] flex items-center justify-center gap-[10px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[4px] w-[4px] rounded-full bg-border" />
          ))}
        </div>
      )
  }
}

function Quote({ block }: { block: QuoteBlock }) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.55, ease: ENTER_EASE }}
      className="mt-[36px] border-l-2 border-secondary/40 pl-[24px]"
    >
      <QuoteGlyph size={30} className="mb-[10px] text-secondary/50" />
      <p className="text-[22px] leading-[1.4] text-foreground sm:text-[24px]" style={{ letterSpacing: '-0.015em' }}>
        {block.text}
      </p>
      {block.attribution && (
        <footer className="mt-[16px] text-[14px] text-muted-foreground">
          <span className="font-medium text-foreground">{block.attribution}</span>
          {block.source && <span> · {block.source}</span>}
        </footer>
      )}
    </motion.blockquote>
  )
}

const CALLOUT_TONE = {
  info: { accent: 'var(--base-secondary)', Icon: InfoIcon },
  success: { accent: 'var(--base-success)', Icon: InfoIcon },
  warning: { accent: 'var(--base-warning)', Icon: AlertIcon },
} as const

function Callout({ block }: { block: CalloutBlock }) {
  const { accent, Icon } = CALLOUT_TONE[block.tone]
  return (
    <aside
      className="mt-[28px] flex gap-[14px] rounded-[14px] border-[0.5px] p-[18px]"
      style={{
        background: `color-mix(in srgb, ${accent} 7%, var(--base-background))`,
        borderColor: `color-mix(in srgb, ${accent} 22%, transparent)`,
      }}
    >
      <span
        className="mt-[1px] inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full"
        style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent }}
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        {block.title && <div className="mb-[3px] text-[15px] font-semibold text-foreground">{block.title}</div>}
        <div className="text-[15px] leading-[1.6] text-foreground/80">
          <InlineText text={block.text} />
        </div>
      </div>
    </aside>
  )
}

function Table({ block }: { block: TableBlock }) {
  return (
    <div className="mt-[28px] overflow-x-auto rounded-[14px] border-[0.5px] border-border">
      <table className="w-full border-collapse text-[14.5px]">
        <thead>
          <tr className="bg-canvas">
            {block.head.map((h, i) => (
              <th key={i} className="px-[18px] py-[12px] text-left align-bottom font-medium text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, r) => (
            <tr key={r} className="border-t border-border">
              {row.map((cell, c) => (
                <td key={c} className={clsx('px-[18px] py-[12px] align-top leading-[1.5]', c === 0 ? 'font-medium text-foreground' : 'text-foreground/75')}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Stat({ block }: { block: StatBlock }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.5, ease: ENTER_EASE }}
      className="mt-[32px] grid grid-cols-3 overflow-hidden rounded-[16px] border-[0.5px] border-border bg-canvas/50"
    >
      {block.items.map((item, i) => (
        <div key={i} className={clsx('px-[14px] py-[18px] sm:px-[24px] sm:py-[22px]', i > 0 && 'border-l border-border')}>
          <div className="font-mono text-[21px] leading-none tracking-[-0.02em] text-foreground tabular-nums sm:text-[28px]">{item.value}</div>
          <div className="mt-[6px] text-[12px] leading-[1.35] text-muted-foreground sm:mt-[8px] sm:text-[13.5px]">{item.label}</div>
        </div>
      ))}
    </motion.div>
  )
}

function Embed({ block, family }: { block: EmbedBlock; family: ArtFamily }) {
  if (block.kind === 'tweet') {
    return (
      <a
        href={block.url}
        target="_blank"
        rel="noreferrer"
        className="mt-[28px] flex items-center gap-[14px] rounded-[14px] border-[0.5px] border-border bg-background p-[18px] transition-[transform,box-shadow] duration-150 hover:-translate-y-[1px] hover:shadow-lift"
      >
        <span className="inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <SocialGlyph name="x" size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium text-foreground">{block.title ?? 'View post on X'}</span>
          <span className="block text-[13px] text-muted-foreground">View on X</span>
        </span>
        <ArrowUpRightIcon size={18} className="shrink-0 text-muted-foreground" />
      </a>
    )
  }
  return (
    <a
      href={block.url}
      target="_blank"
      rel="noreferrer"
      className="group relative mt-[28px] block aspect-[16/9] overflow-hidden rounded-[16px] border-[0.5px] border-border"
    >
      <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]">
        {block.posterUrl ? (
          <img src={block.posterUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <CoverArtPoster family={block.art?.family ?? family} variant={block.art?.variant ?? 0} />
        )}
      </div>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex h-[64px] w-[64px] items-center justify-center rounded-full bg-background/90 text-foreground shadow-lift transition-transform duration-200 group-hover:scale-105">
          <PlayIcon size={24} />
        </span>
      </span>
      {block.title && (
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-[18px] text-[14px] font-medium text-background">
          {block.title}
        </span>
      )}
    </a>
  )
}

// Re-export CoverArt under a local name so Embed can render a poster without a
// second import path.
import { CoverArt as CoverArtPoster } from '../illustrations/CoverArt'
