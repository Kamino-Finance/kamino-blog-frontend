import { createRequire } from 'module'
const require = createRequire(import.meta.url)
// Vendored, self-contained copy of the Kamino design-system Tailwind preset.
// Byte-identical to `packages/design-system/tailwind/preset.cjs` — see
// `tailwind/README.md` for provenance and how to re-sync.
const preset = require('./tailwind/preset.cjs')

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
}
