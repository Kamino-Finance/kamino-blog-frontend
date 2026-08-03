/**
 * Outbound links to the rest of the Kamino surface area.
 *
 * The blog is a standalone deployment, so these point at other origins. Kept in
 * one place so the FE team can repoint them at handoff (env or edit here).
 */
export const KAMINO_SITE = 'https://kamino.com'
// The app and marketing site share one origin now (app.kamino.finance redirects here).
export const KAMINO_APP = KAMINO_SITE
export const KAMINO_DOCS = `${KAMINO_SITE}/docs`
export const CONTACT_EMAIL = 'mailto:institutional@kamino-foundation.com'

export const SOCIAL = {
  x: 'https://x.com/kaminofinance',
  discord: 'https://discord.gg/kamino',
  telegram: 'https://t.me/kamino',
  linkedin: 'https://www.linkedin.com/company/kamino-finance',
  github: 'https://github.com/Kamino-Finance',
} as const
