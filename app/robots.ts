import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site'

/* Metadata route handlers are dynamic by default; a static export has
   nowhere to run them, so they are pinned to build time. */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
