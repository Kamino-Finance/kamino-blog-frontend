/**
 * Motion tiers — the shared Kamino motion contract, vendored for the blog.
 *
 * Mirrors `apps/app/src/lib/motion.ts` so blog transitions resolve on the same
 * curves and durations as the rest of the product. Three tiers:
 *
 *   - Layout  (200ms, non-overshooting)  — reflow: grid filter, width changes.
 *   - Enter   (spring-y)                 — one-shot mount reveals.
 *   - Hover   (150ms, decel)             — colour/shadow/transform feedback.
 *
 * framer-motion honours `prefers-reduced-motion` globally via the root
 * `<MotionConfig reducedMotion="user">`; the CSS kill-switch in
 * `blog.animations.css` catches ambient CSS animation.
 */

/** Layout-transition duration — snappy without feeling abrupt. */
export const LAYOUT_DURATION = 0.2

/** Non-overshooting layout curve — keeps grid reflow / width changes monotonic. */
export const LAYOUT_EASE = [0.32, 0, 0.32, 1] as const

/** Mount-fade easing — slightly spring-y, for one-shot entrance animations. */
export const ENTER_EASE = [0.32, 0.72, 0, 1] as const

/** Hover-tier duration — brisk feedback for colour/shadow/transform. */
export const HOVER_DURATION = 0.15

/** Hover-tier easing — standard deceleration curve. */
export const HOVER_EASE = [0, 0, 0.2, 1] as const

/** Layout transition object — pass to framer-motion `transition`. */
export const LAYOUT_TRANSITION = { duration: LAYOUT_DURATION, ease: LAYOUT_EASE } as const

/** Enter transition object — one-shot reveals. */
export const ENTER_TRANSITION = { duration: 0.5, ease: ENTER_EASE } as const

/** Hover-state transition object. */
export const HOVER_TRANSITION = { duration: HOVER_DURATION, ease: HOVER_EASE } as const

/* ─── CSS-string variants — for transitions driven through real CSS. ─────── */
export const LAYOUT_CSS_EASE = 'cubic-bezier(0.32,0,0.32,1)'
export const HOVER_CSS_EASE = 'cubic-bezier(0, 0, 0.2, 1)'
export const ENTER_CSS_EASE = 'cubic-bezier(0.32,0.72,0,1)'

/**
 * Staggered-reveal variants for lists/grids. Parent orchestrates a small
 * per-child delay; each child rises 12px into place. Used by the index grid,
 * related posts, and any stacked reveal.
 */
export const STAGGER_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
} as const

export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ENTER_EASE } },
} as const
