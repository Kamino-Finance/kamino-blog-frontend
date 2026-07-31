# Vendored design-system styles

These files are **byte-identical copies** of the Kamino design system, vendored
here so the blog is a self-contained, portable app with no cross-package
imports. Do not hand-edit them — re-sync from source instead.

| File                     | Source (in the Kamino monorepo)                                  |
| ------------------------ | ---------------------------------------------------------------- |
| `tokens.generated.css`   | `packages/design-system/styles/tokens.generated.css`             |
| `tokens.extensions.css`  | `packages/design-system/styles/tokens.extensions.css`            |
| `fonts.css`              | `packages/design-system/styles/fonts.css`                        |
| `../../../public/fonts/` | repo-root `/public/fonts/` (Aeonik / Aeonik Fono woff2)          |

`tokens.generated.css` is generated from Figma (`jnR7xN4VISLvVKxSXFrNSU`). To
re-sync after a design-system update, copy the four sources above over these
copies. The Tailwind preset that maps these variables to utility classes is
vendored separately under `../../tailwind/`.
