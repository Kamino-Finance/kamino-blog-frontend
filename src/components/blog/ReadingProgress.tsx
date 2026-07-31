import { useScroll, useSpring, motion } from 'framer-motion'
import type { RefObject } from 'react'

/**
 * Reading-progress bar — a hairline that fills as the reader moves through the
 * article. Driven by framer's `useScroll` over the article element and smoothed
 * with a spring so it glides rather than jitters. Sits just under the fixed nav.
 * Honours reduced motion via the root MotionConfig (the spring collapses).
 */
export function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-30 h-[2px] origin-left bg-secondary"
      style={{ scaleX }}
    />
  )
}
