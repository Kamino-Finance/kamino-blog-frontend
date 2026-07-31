import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { KaminoWordmark } from '../../design/BrandMarks'
import { MenuIcon, CloseIcon, ArrowUpRightIcon } from '../../design/icons'
import { CATEGORIES } from '../../content/categories'
import { KAMINO_APP } from '../../lib/links'
import { useScrolled } from '../../lib/scroll'
import { ENTER_EASE } from '../../design/motion'

/**
 * Blog top nav — deliberately minimal: brand → home and the app CTA. Category
 * browsing lives in the index filter bar and search is the index search bar /
 * ⌘K, so neither clutters the header. The bar is sticky and condenses on scroll
 * (an opaque background + hairline edge fade in). Mobile keeps a drawer for
 * category navigation.
 */
export function BlogTopNav() {
  const scrolled = useScrolled(24)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className="absolute inset-0 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out"
        style={{
          background: scrolled
            ? 'color-mix(in srgb, var(--base-background) 94%, transparent)'
            : 'color-mix(in srgb, var(--base-background) 72%, transparent)',
          backdropFilter: 'saturate(170%) blur(22px)',
          WebkitBackdropFilter: 'saturate(170%) blur(22px)',
          borderBottom: scrolled
            ? '0.5px solid color-mix(in srgb, var(--base-foreground) 12%, transparent)'
            : '0.5px solid transparent',
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-[1280px] items-center justify-between px-[20px] sm:px-[28px] lg:px-[48px]">
        <div
          className="flex items-center transition-[height] duration-300 ease-out"
          style={{ height: scrolled ? 60 : 72 }}
        >
          <Link to="/" className="flex items-baseline gap-[8px]" aria-label="Kamino Blog — home">
            <KaminoWordmark height={19} className="translate-y-[3px] text-foreground" />
            <span className="text-[15px] font-normal text-muted-foreground">Blog</span>
          </Link>
        </div>

        <div className="flex items-center gap-[6px]">
          <a
            href={KAMINO_APP}
            target="_blank"
            rel="noreferrer"
            className="hidden h-[38px] items-center gap-[6px] rounded-full bg-foreground px-[16px] text-[14px] font-medium text-background transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-[0.5px] hover:shadow-lift active:translate-y-0 sm:inline-flex"
          >
            Launch app
            <ArrowUpRightIcon size={15} />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full text-foreground transition-hover-colors hover:bg-canvas sm:hidden"
          >
            <MenuIcon size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </header>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 sm:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <motion.div
        className="absolute inset-x-0 top-0 bg-background p-[20px] shadow-lift"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.24, ease: ENTER_EASE }}
      >
        <div className="mb-[16px] flex items-center justify-between">
          <span className="flex items-baseline gap-[8px]">
            <KaminoWordmark height={19} className="translate-y-[3px] text-foreground" />
            <span className="text-[15px] font-normal text-muted-foreground">Blog</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full text-foreground transition-hover-colors hover:bg-canvas"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <nav className="flex flex-col">
          <Link to="/posts" onClick={onClose} className="rounded-[10px] px-[12px] py-[12px] text-[16px] font-medium text-foreground transition-hover-colors hover:bg-canvas">
            All posts
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              onClick={onClose}
              className="rounded-[10px] px-[12px] py-[12px] text-[16px] font-medium text-foreground transition-hover-colors hover:bg-canvas"
            >
              {c.name}
            </Link>
          ))}
          <a
            href={KAMINO_APP}
            target="_blank"
            rel="noreferrer"
            className="mt-[12px] inline-flex h-[46px] items-center justify-center gap-[6px] rounded-full bg-foreground text-[15px] font-medium text-background"
          >
            Launch app
            <ArrowUpRightIcon size={16} />
          </a>
        </nav>
      </motion.div>
    </motion.div>
  )
}
