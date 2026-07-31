// Shared Tailwind preset — the token-driven theme extension used by every
// Kamino surface (app + landing). The token table itself is auto-generated
// from Figma variables and lives in `./tokens.cjs`. NEVER hand-edit hex /
// raw-px / custom-radii / shadow here — the Figma source is canonical.
//
// Each consuming workspace's `tailwind.config.js` lists this file in
// `presets: [...]` and supplies its own `content: [...]` globs.

const tokens = require('./tokens.cjs')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        ...tokens.colors,
        // Project extensions — see `packages/design-system/styles/tokens.extensions.css`.
        // These are TODO-sync-with-Figma; mirror the same shape so they look
        // and feel native alongside the generated tokens.
        'canvas-hover': 'var(--base-canvas-hover)',
        'card-hover': 'var(--base-card-hover)',
        skeleton: 'var(--base-skeleton)',
        'warning-subtle': 'var(--base-warning-subtle)',
        'success-subtle': 'var(--base-success-subtle)',
        'success-foreground': 'var(--base-success-foreground)',
        'warning-foreground': 'var(--base-warning-foreground)',
        destructive: 'var(--base-destructive)',
        'destructive-foreground': 'var(--base-destructive-foreground)',
        'muted-foreground-alpha-10': 'var(--base-muted-foreground-alpha-10)',
        'secondary-hover': 'var(--base-secondary-hover)',
      },
      spacing: tokens.spacing,
      width: tokens.width,
      height: tokens.height,
      maxWidth: tokens.maxWidth,
      borderRadius: tokens.borderRadius,
      borderWidth: tokens.borderWidth,
      fontFamily: tokens.fontFamily,
      fontSize: tokens.fontSize,
      fontWeight: tokens.fontWeight,
      boxShadow: {
        ...tokens.boxShadow,
        // Figma TODO — see `packages/design-system/styles/tokens.extensions.css`.
        lift: 'var(--shadow-lift)',
        'focus-ring': 'var(--shadow-focus-ring)',
        'focus-ring-inset': 'var(--shadow-focus-ring-inset)',
      },
      opacity: tokens.opacity,
    },
  },
  plugins: [
    // Motion-tier utilities — bundle property + duration + easing into a
    // single class so call sites stop reinventing the recipe. Tier
    // constants mirror those in `apps/app/src/lib/motion.ts`; keep the
    // two in sync (a regression here would silently desync from the
    // framer-motion side).
    plugin(({ addUtilities }) => {
      // Hover-tier color transition — replaces the 58-site repeat of
      // `transition-colors duration-150 ease-out` (and the 38 sites of
      // `transition-colors duration-150` that were implicitly ease-out
      // adjacent). Bundled here so a future re-tune lands in one place.
      addUtilities({
        '.transition-hover-colors': {
          'transition-property':
            'color, background-color, border-color, text-decoration-color, fill, stroke',
          'transition-duration': '150ms',
          'transition-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
        },
      })
    }),
  ],
}
