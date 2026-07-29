import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  noIndex?: boolean
}

const SITE_NAME = 'Free Templates'
const DEFAULT_DESCRIPTION =
  'Download 1,000+ free and premium website templates built with Next.js, Gatsby.js, Nuxt.js, and more. Jumpstart your next project with production-ready starter templates.'
const DEFAULT_OG_IMAGE = '/og-image.png'

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex" />}
    </Helmet>
  )
}
