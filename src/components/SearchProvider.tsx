import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SearchOverlay } from './blog/SearchOverlay'

/**
 * Search is owned here so any surface can open the command-palette overlay —
 * the filter-row search bar on the index, and the global ⌘K / Ctrl-K shortcut.
 * The overlay itself lives in `SearchOverlay`.
 */
const SearchContext = createContext<{ open: () => void }>({ open: () => {} })

// eslint-disable-next-line react-refresh/only-export-components
export function useSearch() {
  return useContext(SearchContext)
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openSearch = useCallback(() => setOpen(true), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <SearchContext.Provider value={{ open: openSearch }}>
      {children}
      <AnimatePresence>{open && <SearchOverlay onClose={() => setOpen(false)} />}</AnimatePresence>
    </SearchContext.Provider>
  )
}
