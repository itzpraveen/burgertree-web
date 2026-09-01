import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site'

/* Metadata route handlers are dynamic by default; a static export has
   nowhere to run them, so they are pinned to build time. */
export const dynamic = 'force-static'

/** Six pages. Priorities reflect what people actually arrive looking for. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['', 1, 'monthly'],
    ['/menu', 0.9, 'monthly'],
    ['/stores', 0.8, 'yearly'],
    ['/contact', 0.7, 'yearly'],
    ['/story', 0.6, 'yearly'],
    ['/privacy', 0.2, 'yearly'],
  ]
  return pages.map(([path, priority, changeFrequency]) => ({
    // trailingSlash is on, so the sitemap advertises the URL that is served.
    url: `${SITE_URL}${path}/`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
