import { motion } from 'framer-motion'
import clsx from 'clsx'
import { CATEGORIES } from '../../content/categories'
import type { CategorySlug } from '../../content/types'
import { LAYOUT_TRANSITION } from '../../design/motion'

export type FilterValue = CategorySlug | 'all'

/**
 * Category filter — a pill row where a single filled highlight slides between
 * options via a shared `layoutId`, rather than each pill toggling its own
 * background. Purely presentational; the index owns the selected value.
 */
export function CategoryFilter({ value, onChange }: { value: FilterValue; onChange: (v: FilterValue) => void }) {
  const items: { key: FilterValue; label: string }[] = [
    { key: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ key: c.slug as FilterValue, label: c.name })),
  ]

  return (
    <div
      className="-mx-[20px] flex items-center gap-[6px] overflow-x-auto px-[20px] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Filter posts by category"
    >
      {items.map((it) => {
        const active = value === it.key
        return (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.key)}
            className="relative shrink-0 rounded-full px-[15px] py-[8px] text-[14px] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:shadow-focus-ring"
          >
            {active && (
              <motion.span
                layoutId="filter-active"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={LAYOUT_TRANSITION}
              />
            )}
            <span className={clsx('relative z-[1]', active ? 'text-background' : 'text-muted-foreground hover:text-foreground')}>
              {it.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
