import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Layout } from './components/Layout'
import { Index } from './pages/Index'
import { Archive } from './pages/Archive'
import { Post } from './pages/Post'
import { Category } from './pages/Category'
import { Author } from './pages/Author'
import { NotFound } from './pages/NotFound'

// Base path the app is mounted under. Locally '/'; production builds set
// `BLOG_BASE=/blog/` (see vite.config.ts), from which the router basename
// derives automatically.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

// A data router (createBrowserRouter) — required for View Transitions
// (`<Link viewTransition>` + `useViewTransitionState`) that power the
// shared-element cover→hero morph. The more specific `/category` and
// `/authors` routes are ranked ahead of the catch-all `/:slug` post route.
const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: '/', element: <Index /> },
        { path: '/posts', element: <Archive /> },
        { path: '/category/:slug', element: <Category /> },
        { path: '/authors/:slug', element: <Author /> },
        { path: '/:slug', element: <Post /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </StrictMode>,
)
