import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { CoverArt } from '../../illustrations/CoverArt'
import { Lightbox } from '../Lightbox'
import { InlineText } from '../InlineText'
import { ZoomIcon } from '../../../design/icons'
import { ENTER_EASE } from '../../../design/motion'
import type { ArtFamily, ImageBlock, GalleryBlock } from '../../../content/types'

/** Renders either a real CMS image or a branded placeholder illustration. */
function Media({ src, art, alt, family, className }: { src?: string; art?: { variant: number; family?: ArtFamily }; alt: string; family: ArtFamily; className?: string }) {
  if (src) return <img src={src} alt={alt} className={clsx('h-full w-full object-cover', className)} draggable={false} />
  return <CoverArt family={art?.family ?? family} variant={art?.variant ?? 0} className={className} />
}

// Media stays within the reading measure (no side breakout) so it never
// collides with the table-of-contents rail or clips at the column edge. The
// width key is retained for CMS fidelity but currently renders full-measure.
const WIDTH_CLASS: Record<ImageBlock['width'], string> = {
  inline: '',
  wide: '',
  full: '',
}

const REVEAL = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -12% 0px' },
  transition: { duration: 0.6, ease: ENTER_EASE },
}

/**
 * In-article image. Breaks out of the prose measure at `wide`/`full`, reveals
 * on scroll, and opens a lightbox on click. `family` is the post's category,
 * used as the palette for placeholder art.
 */
export function ArticleImage({ block, family }: { block: ImageBlock; family: ArtFamily }) {
  const [open, setOpen] = useState(false)
  const aspect = block.width === 'inline' ? 'aspect-[16/10]' : 'aspect-[16/9]'

  return (
    <>
      <motion.figure {...REVEAL} className={clsx('group', WIDTH_CLASS[block.width])}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx('relative block w-full cursor-zoom-in overflow-hidden rounded-[16px] border-[0.5px] border-border', aspect)}
          aria-label={block.alt ? `Expand image: ${block.alt}` : 'Expand image'}
        >
          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]">
            <Media src={block.src} art={block.art} alt={block.alt} family={family} />
          </div>
          <span className="absolute right-[12px] top-[12px] inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-background/85 text-foreground opacity-0 shadow-xs backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            <ZoomIcon size={17} />
          </span>
        </button>
        {block.caption && (
          <figcaption className="mt-[12px] text-[13.5px] leading-[1.5] text-muted-foreground">
            <InlineText text={block.caption} />
          </figcaption>
        )}
      </motion.figure>

      <AnimatePresence>
        {open && (
          <Lightbox onClose={() => setOpen(false)} caption={block.caption ? <InlineText text={block.caption} /> : undefined}>
            <div className="aspect-[16/9] w-full bg-background">
              <Media src={block.src} art={block.art} alt={block.alt} family={family} />
            </div>
          </Lightbox>
        )}
      </AnimatePresence>
    </>
  )
}

/** Two/three-up gallery. Shares the reveal + lightbox behaviour. */
export function Gallery({ block, family }: { block: GalleryBlock; family: ArtFamily }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const cols = block.items.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'

  return (
    <>
      <motion.div {...REVEAL} className={clsx('grid grid-cols-1 gap-[14px]', cols)}>
        {block.items.map((item, i) => (
          <figure key={i} className="group">
            <button
              type="button"
              onClick={() => setOpenIdx(i)}
              className="relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-[14px] border-[0.5px] border-border"
              aria-label={item.alt ? `Expand image: ${item.alt}` : 'Expand image'}
            >
              <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                <Media src={item.src} art={item.art} alt={item.alt} family={family} />
              </div>
            </button>
            {item.caption && (
              <figcaption className="mt-[8px] text-[12.5px] leading-[1.45] text-muted-foreground">
                <InlineText text={item.caption} />
              </figcaption>
            )}
          </figure>
        ))}
      </motion.div>

      <AnimatePresence>
        {openIdx !== null && (
          <Lightbox
            onClose={() => setOpenIdx(null)}
            caption={block.items[openIdx].caption ? <InlineText text={block.items[openIdx].caption as string} /> : undefined}
          >
            <div className="aspect-[16/10] w-full bg-background">
              <Media src={block.items[openIdx].src} art={block.items[openIdx].art} alt={block.items[openIdx].alt} family={family} />
            </div>
          </Lightbox>
        )}
      </AnimatePresence>
    </>
  )
}
