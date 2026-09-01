import { fallbackSrc, food, srcSet } from '@/lib/images'
import { clsx } from '@/lib/cx'

/**
 * A photograph from the client's shoot.
 *
 * The LQIP sits underneath as a background-image, so the frame is never
 * empty and never the wrong colour while the real file arrives — these are
 * dark photographs on a dark page and a white flash would be ugly.
 */
export function FoodImage({
  slug,
  alt,
  sizes = '100vw',
  className,
  imgClassName,
  priority = false,
  ratio,
}: {
  slug: string
  alt: string
  sizes?: string
  className?: string
  imgClassName?: string
  priority?: boolean
  /** Override the source aspect — used where the layout wants a crop. */
  ratio?: string
}) {
  const img = food(slug)
  if (!img) return null

  return (
    <div
      className={clsx('relative overflow-hidden bg-char-2', className)}
      style={{
        aspectRatio: ratio ?? `${img.width} / ${img.height}`,
        backgroundImage: `url(${img.lqip})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(img, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(img, 'webp')} sizes={sizes} />
        <img
          src={fallbackSrc(img)}
          alt={alt}
          width={img.width}
          height={img.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          className={clsx('absolute inset-0 h-full w-full object-cover', imgClassName)}
        />
      </picture>
    </div>
  )
}
