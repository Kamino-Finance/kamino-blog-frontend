import { useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CloseIcon } from '../../design/icons'
import { ENTER_EASE } from '../../design/motion'

/**
 * Image lightbox — a dimmed, blurred backdrop with the enlarged media centred.
 * Closes on Escape, backdrop click, or the close button; locks body scroll.
 * Mounted/unmounted by an `<AnimatePresence>` in the caller.
 */
export function Lightbox({ onClose, caption, children }: { onClose: () => void; caption?: ReactNode; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-[24px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-[4px]" onClick={onClose} aria-hidden />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute right-[20px] top-[20px] z-[1] inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-background/90 text-foreground shadow-lift transition-transform duration-150 hover:scale-105"
      >
        <CloseIcon size={20} />
      </button>
      <motion.figure
        className="relative z-[1] w-full max-w-[1000px]"
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.26, ease: ENTER_EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-[16px] shadow-lift">{children}</div>
        {caption && <figcaption className="mt-[12px] text-center text-[13.5px] text-background/80">{caption}</figcaption>}
      </motion.figure>
    </motion.div>
  )
}
