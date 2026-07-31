import { useSearch } from '../SearchProvider'
import { SearchIcon } from '../../design/icons'

/**
 * Search bar for the filter row — an input-styled trigger that opens the
 * command-palette overlay (also reachable via ⌘K). Full-width on mobile,
 * fixed width beside the category tabs on larger screens.
 */
export function SearchBar() {
  const { open } = useSearch()
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search posts"
      className="group inline-flex h-[40px] w-full items-center gap-[9px] rounded-full border-[0.5px] border-border bg-background px-[14px] text-left text-muted-foreground transition-[border-color,color] duration-150 hover:border-foreground/20 hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus-ring sm:w-[248px]"
    >
      <SearchIcon size={17} className="shrink-0" />
      <span className="flex-1 truncate text-[14px]">Search posts</span>
      <kbd className="hidden shrink-0 rounded-[5px] border-[0.5px] border-border bg-canvas px-[6px] py-[1px] font-mono text-[11px] leading-[16px] text-muted-foreground sm:inline-block">
        ⌘K
      </kbd>
    </button>
  )
}
