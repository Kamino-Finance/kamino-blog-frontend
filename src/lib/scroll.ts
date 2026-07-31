import { useEffect, useRef, useState } from 'react'

/**
 * Returns true once the window has scrolled past `threshold` px. rAF-throttled
 * and only flips React state on a boundary crossing, so it never re-renders on
 * every scroll frame — used by the condensing top nav.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let raf = 0
    let last = false
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const next = window.scrollY > threshold
        if (next !== last) {
          last = next
          setScrolled(next)
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [threshold])
  return scrolled
}

/**
 * Scroll-spy for a table of contents. Given ordered heading ids, returns the id
 * of the section the reader is currently in. An IntersectionObserver with a
 * top-biased rootMargin marks a heading active once it reaches the upper third
 * of the viewport; the last heading to cross wins, so short trailing sections
 * still highlight.
 */
export function useScrollSpy(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)
  const visible = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (ids.length === 0) return
    visible.current = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (entry.isIntersecting) visible.current.add(id)
          else visible.current.delete(id)
        }
        // Choose the first (topmost) heading currently in the active band.
        const firstVisible = ids.find((id) => visible.current.has(id))
        if (firstVisible) setActive(firstVisible)
      },
      { rootMargin: '-88px 0px -66% 0px', threshold: 0 },
    )
    const nodes = ids.map((id) => document.getElementById(id)).filter((n): n is HTMLElement => Boolean(n))
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [ids])

  return active
}
