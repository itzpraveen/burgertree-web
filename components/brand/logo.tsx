import Image from 'next/image'
import { asset } from '@/lib/base-path'
import { clsx } from '@/lib/cx'

/**
 * The wordmark is the client's own artwork, lifted at 1000×855 from the
 * print master rather than re-set in a lookalike typeface — the grid rules
 * and the burger/heart glyphs would not survive a substitution.
 *
 * The three rows are addressable for the reveal animation: each row is the
 * same image clipped to its band, so nothing has to be sliced into files.
 */

const ROWS = [
  { name: 'BURG', top: 0, bottom: 61.3 },
  { name: 'ER', top: 38.7, bottom: 33.4 },
  { name: 'TREE', top: 66.6, bottom: 0 },
] as const

export function Logo({
  className,
  width = 168,
  priority = false,
  animated = false,
  /** Black artwork, for when the mark sits on the brand colour. */
  dark = false,
}: {
  className?: string
  width?: number
  priority?: boolean
  animated?: boolean
  dark?: boolean
}) {
  const height = Math.round((width * 855) / 1000)

  if (!animated) {
    return (
      <Image
        src={dark ? asset('/brand/logo-dark.png') : asset('/brand/logo-white.png')}
        alt="Burger Tree — burgers n' beyond"
        width={width}
        height={height}
        priority={priority}
        className={clsx('h-auto select-none', className)}
      />
    )
  }

  return (
    <div
      className={clsx('relative select-none', className)}
      style={{ width, height }}
      role="img"
      aria-label="Burger Tree — burgers n' beyond"
    >
      {ROWS.map((row, i) => (
        <span
          key={row.name}
          className="logo-row absolute inset-0 block"
          style={
            {
              clipPath: `inset(${row.top}% 0 ${row.bottom}% 0)`,
              '--row-delay': `${i * 110}ms`,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset('/brand/logo-white.png')}
            alt=""
            width={width}
            height={height}
            className="block h-full w-full object-contain"
          />
        </span>
      ))}
    </div>
  )
}

/** The circular "GET THE BEST BURGER EVER" rubber stamp from the menu back cover. */
export function Stamp({
  className,
  size = 96,
  spin = true,
}: {
  className?: string
  size?: number
  spin?: boolean
}) {
  return (
    <Image
      src={asset('/brand/stamp-white.png')}
      alt="Get the best burger ever"
      width={size}
      height={Math.round((size * 351) / 333)}
      className={clsx('h-auto select-none', spin && 'motion-safe:animate-[spin_28s_linear_infinite]', className)}
    />
  )
}

export function BurgerGlyph({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <Image
      src={asset('/brand/icon-burger.png')}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={clsx('h-auto select-none', className)}
    />
  )
}

export function HeartGlyph({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <Image
      src={asset('/brand/icon-heart.png')}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={clsx('h-auto select-none', className)}
    />
  )
}
