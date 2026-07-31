import { Outlet } from 'react-router-dom'
import { BlogTopNav } from './chrome/BlogTopNav'
import { BlogFooter } from './chrome/BlogFooter'
import { ScrollToTop } from './ScrollToTop'
import { SearchProvider } from './SearchProvider'

/**
 * App shell: fixed top nav, routed content, footer. Search (the command-palette
 * overlay + ⌘K) is provided by `SearchProvider` so the index's search bar can
 * open it. The `<main>` clears the fixed header with top padding.
 */
export function Layout() {
  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollToTop />
        <BlogTopNav />
        <main className="flex-1 pt-[72px]">
          <Outlet />
        </main>
        <BlogFooter />
      </div>
    </SearchProvider>
  )
}
