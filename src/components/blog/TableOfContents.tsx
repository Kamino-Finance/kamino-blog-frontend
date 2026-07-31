import { useMemo } from 'react'
import clsx from 'clsx'
import type { Block } from '../../content/types'
import { useScrollSpy } from '../../lib/scroll'

/**
 * Table of contents with scroll-spy. Built from the article's heading blocks
 * (level-3 headings indent under level-2). The active section tracks scroll and
 * an accent marker slides to it. Clicking scrolls to the heading; the heading's
 * own `scroll-mt` keeps it clear of the fixed nav.
 */
export function TableOfContents({ body }: { body: Block[] }) {
  const headings = useMemo(
    () => body.filter((b): b is Extract<Block, { _type: 'heading' }> => b._type === 'heading'),
    [body],
  )
  const ids = useMemo(() => headings.map((h) => h.id), [headings])
  const active = useScrollSpy(ids)

  if (headings.length < 2) return null

  return (
    <nav aria-label="On this page">
      <div className="mb-[14px] text-[12px] font-medium text-muted-foreground">On this page</div>
      <ul className="flex flex-col gap-[2px] border-l border-border">
        {headings.map((h) => {
          const isActive = active === h.id
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={clsx(
                  '-ml-px block border-l-2 py-[6px] text-[13px] leading-[1.4] transition-[color,border-color] duration-150',
                  h.level === 3 ? 'pl-[24px]' : 'pl-[14px]',
                  isActive
                    ? 'border-secondary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
