# Vendored Tailwind preset

`preset.cjs` and `tokens.cjs` are **byte-identical copies** of the Kamino
design-system Tailwind preset, vendored so the blog has no `@kamino/*` build
dependency.

| File          | Source                                            |
| ------------- | ------------------------------------------------- |
| `preset.cjs`  | `packages/design-system/tailwind/preset.cjs`      |
| `tokens.cjs`  | `packages/design-system/tailwind/tokens.cjs`      |

`tokens.cjs` is generated from Figma; do not hand-edit. To re-sync, copy both
files over these copies. Consumed by `../tailwind.config.js`.
