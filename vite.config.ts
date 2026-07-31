import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Kamino Blog — standalone Vite config.
 *
 * This app is intentionally self-contained: it has its own `public/` (fonts,
 * favicon) and does NOT reuse the monorepo's shared `publicDir`, so the whole
 * `apps/blog` directory can be lifted out and deployed on its own.
 *
 * `base` controls the path the app is served from. Locally it runs at the
 * origin root for a clean dev experience; in production the blog lives at
 * `kamino.com/blog`, so set `BLOG_BASE=/blog/` at build time (and the matching
 * `<BrowserRouter basename>` — see `src/main.tsx`). See README.md → Deploying.
 */
export default defineConfig({
  base: process.env.BLOG_BASE ?? '/',
  plugins: [react()],
  server: { port: 5250 },
  preview: { port: 5250 },
})
