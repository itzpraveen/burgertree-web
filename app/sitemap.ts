import type { MetadataRoute } from 'next'
import { BRAND } from '@/data/site'

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
    url: `${BRAND.site}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
