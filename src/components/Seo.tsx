/**
 * Per-page document metadata.
 *
 * Uses React 19's native support for hoisting `<title>`/`<meta>` rendered
 * anywhere in the tree into `<head>` (and de-duping `<title>`), so no helmet
 * dependency is needed. Every route renders one `<Seo>`.
 */
const SITE_NAME = 'Kamino Blog'

export function Seo({
  title,
  description,
  image,
  type = 'website',
  canonical,
}: {
  title?: string
  description: string
  image?: string
  type?: 'website' | 'article'
  canonical?: string
}) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — onchain finance, in the open`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </>
  )
}
