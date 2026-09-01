import manifest from '@/data/images.json'
import { BASE_PATH } from '@/lib/base-path'

export type FoodImage = {
  key: string
  slug: string
  width: number
  height: number
  aspect: number
  widths: number[]
  lqip: string
}

const BY_SLUG = new Map((manifest as FoodImage[]).map((i) => [i.slug, i]))

export const food = (slug: string) => BY_SLUG.get(slug)

/**
 * `scripts/build-assets.mjs` writes AVIF and WebP at every width the source
 * could support, plus one JPEG at 1280 as the last resort. We build the
 * srcsets by hand rather than going through next/image because the work is
 * already done at build time — running it through the optimiser again would
 * cost a serverless invocation per variant to produce the same bytes.
 */
export function srcSet(img: FoodImage, ext: 'avif' | 'webp') {
  return img.widths.map((w) => `${BASE_PATH}/food/${img.slug}-${w}.${ext} ${w}w`).join(', ')
}

export const fallbackSrc = (img: FoodImage) => `${BASE_PATH}/food/${img.slug}.jpg`
