import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

/**
 * Kamino Blog — Sanity Studio (marketing's editing UI).
 *
 * Deployed at kamino-blog.sanity.studio via `npm run deploy`. Content authored
 * here lives in the `production` dataset; the blog reads it at build time via
 * `sanity/adapter.ts`.
 */
export default defineConfig({
  name: 'default',
  title: 'Kamino Blog',
  projectId: '2kksiz70',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
