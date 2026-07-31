import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { searchPosts, getAllPosts } from '../../content/source'
import { PostRow } from './PostCard'
import { SearchIcon, CloseIcon } from '../../design/icons'
import { ENTER_EASE } from '../../design/motion'

/**
 * Search overlay — a centred command-palette. Renders live results as you type,
 * shows recent posts as a resting state, traps focus in the input, closes on
 * Escape or backdrop click, and locks body scroll while open. Mounted/unmounted
 * by an `<AnimatePresence>` in the layout.
 */
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => (query.trim() ? searchPosts(query) : getAllPosts().slice(0, 4)), [query])
  const isSearching = query.trim().length > 0

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div
        className="absolute inset-0 bg-foreground/25 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search the blog"
        className="absolute inset-x-0 top-[10vh] mx-auto w-[min(640px,calc(100%-32px))] overflow-hidden rounded-[18px] border-[0.5px] border-border bg-background shadow-lift"
        initial={{ y: -12, opacity: 0, scale: 0.985 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -12, opacity: 0, scale: 0.985 }}
        transition={{ duration: 0.24, ease: ENTER_EASE }}
      >
        <div className="flex items-center gap-[12px] border-b border-border px-[18px]">
          <SearchIcon size={20} className="shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, topics, authors…"
            className="h-[58px] w-full bg-transparent text-[16px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-muted-foreground transition-hover-colors hover:bg-canvas hover:text-foreground"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="max-h-[min(60vh,480px)] overflow-y-auto p-[10px]">
          {!isSearching && (
            <div className="px-[10px] pb-[8px] pt-[6px] text-[12px] font-medium text-muted-foreground">Recent posts</div>
          )}
          {results.length > 0 ? (
            <div className="flex flex-col gap-[2px]">
              {results.map((post) => (
                <PostRow key={post.slug} post={post} onNavigate={onClose} />
              ))}
            </div>
          ) : (
            <div className="px-[10px] py-[40px] text-center">
              <p className="text-[15px] font-medium text-foreground">No results for “{query.trim()}”</p>
              <p className="mt-[4px] text-[13.5px] text-muted-foreground">Try a product name, a topic, or an author.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
