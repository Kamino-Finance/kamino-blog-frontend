import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Standalone ESLint config for the Kamino Blog.
 *
 * The blog carries the design-system's guardrails inline (rather than
 * importing `@kamino/design-system/eslint-rules`) so the app stays
 * self-contained and portable. The two rules that matter here:
 *   - No arbitrary hex/rgb colour values — use a design-system token.
 *   - No inline <svg> outside the sanctioned art/icon files.
 * These mirror the design-system fragments byte-for-byte; keep them in sync.
 */

const NO_INLINE_SVG = {
  selector: 'JSXOpeningElement[name.name="svg"]',
  message:
    'Do not inline <svg> in app code. Import a glyph from `~/design/icons`, or — for bespoke brand/illustration art — add the file to SVG_ALLOWED below with a reason.',
}

const NO_GENERIC_ICONS = {
  selector:
    "ImportDeclaration[source.value=/^(lucide-react|@heroicons|react-icons|@radix-ui\\/react-icons)/]",
  message:
    'Do not import from generic icon libraries. Use the vendored glyphs in `~/design/icons`.',
}

const NO_ARBITRARY_COLOR_TW = {
  selector:
    "Literal[value=/(?:text|bg|border|from|via|to|fill|stroke|ring|outline|shadow|caret|accent|decoration|divide|placeholder)-\\[(?:#[0-9a-fA-F]{3,8}|rgb)/]",
  message:
    'Do not use arbitrary hex/rgb in Tailwind classes (e.g. `text-[#737373]`). Use a design-system token (e.g. `text-muted-foreground`).',
}

const NO_ARBITRARY_COLOR_INLINE = {
  selector:
    "Property[key.name=/^(color|background|backgroundColor|borderColor|fill|stroke|outlineColor|caretColor)$/] > Literal[value=/^(#[0-9a-fA-F]{3,8}|rgba?\\()/]",
  message:
    'Do not inline hex/rgb in `style={{}}`. Use a CSS var (e.g. `var(--base-foreground)`) or a Tailwind token class.',
}

const ALL_RULES = [NO_INLINE_SVG, NO_GENERIC_ICONS, NO_ARBITRARY_COLOR_TW, NO_ARBITRARY_COLOR_INLINE]
const RULES_WITHOUT_INLINE_SVG = [NO_GENERIC_ICONS, NO_ARBITRARY_COLOR_TW, NO_ARBITRARY_COLOR_INLINE]

// Files that legitimately draw raw SVG primitives. Token rules still apply
// (no arbitrary hex — brand marks and illustrations must use CSS vars too).
//   - `design/icons.tsx`      — the vendored glyph source of truth.
//   - `design/BrandMarks.tsx` — Kamino mark + third-party social glyphs.
//   - `components/illustrations/**` — the branded cover-art / inline art system.
const SVG_ALLOWED = [
  '**/design/icons.tsx',
  '**/design/BrandMarks.tsx',
  '**/components/illustrations/**',
]

export default defineConfig([
  // `sanity/` and `scripts/` are handoff/tooling code with their own runtimes
  // (Sanity Studio, Node) — not part of the app bundle, so they're excluded
  // from the app's lint pass.
  globalIgnores(['dist', 'tailwind/**', 'sanity/**', 'scripts/**', 'studio/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-restricted-syntax': ['error', ...ALL_RULES],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: SVG_ALLOWED,
    rules: {
      'no-restricted-syntax': ['error', ...RULES_WITHOUT_INLINE_SVG],
    },
  },
])
