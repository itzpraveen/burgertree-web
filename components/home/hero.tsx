'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { FoodImage } from '@/components/ui/food-image'
import { BRAND, WAIT } from '@/data/site'
import { clamp, onScroll, range, scroll } from '@/lib/scroll-store'
import { useHasWebGL, usePrefersReducedMotion } from '@/lib/use-media'

/**
 * The canvas is never part of the first paint. The headline, the promise and
 * both calls to action are real server-rendered text; the burger arrives
 * afterwards and enhances a page that already works without it.
 */
const BurgerStage = dynamic(() => import('@/components/webgl/burger-stage'), {
  ssr: false,
})

export function Hero() {
  const track = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const intro = useRef<HTMLDivElement>(null)
  const manifest = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLParagraphElement>(null)
  // WebGL2, a real GPU, and a visitor who hasn't asked us to sit still.
  const hasWebGL = useHasWebGL()
  const still = usePrefersReducedMotion()
  const canvas = hasWebGL && !still

  useEffect(() => {
    const el = track.current
    if (!el) return

    const apply = () => {
      const total = Math.max(1, el.offsetHeight - window.innerHeight)
      const p = clamp(-el.getBoundingClientRect().top / total)

      // The burger comes apart across the middle of the track, leaving a beat
      // at each end: one to read the headline, one to read the layer list.
      scroll.burgerOpen = range(p, 0.1, 0.74)
      const open = scroll.burgerOpen

      // The headline comes apart exactly the way the sandwich does — the top
      // half lifts, the bottom half drops. One idea, stated twice.
      if (top.current) {
        top.current.style.transform = `translate3d(0, ${-open * 62}vh, 0)`
      }
      if (bottom.current) {
        bottom.current.style.transform = `translate3d(0, ${open * 62}vh, 0)`
      }
      if (intro.current) {
        intro.current.style.opacity = String(1 - range(open, 0, 0.34))
      }
      if (hint.current) {
        hint.current.style.opacity = String(1 - range(p, 0, 0.06))
      }
      // The manifest takes over once the stack is properly open.
      if (manifest.current) {
        const t = range(open, 0.3, 0.62)
        manifest.current.style.opacity = String(t)
        manifest.current.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0)`
      }
    }

    apply()
    const off = onScroll(apply)
    window.addEventListener('resize', apply)
    return () => {
      off()
      window.removeEventListener('resize', apply)
    }
  }, [])

  return (
    <section ref={track} className="relative h-[300svh]" aria-label="Introduction">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* The one warm spot on an otherwise cold page. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--color-olive) 55%, transparent) 0%, color-mix(in oklab, var(--color-olive-deep) 30%, transparent) 38%, transparent 68%)',
          }}
        />

        {/* The burger, or the photograph of one. */}
        <div className="absolute inset-0">
          {canvas ? (
            <BurgerStage />
          ) : (
            // Without the canvas the photograph has to do the hero's job, so
            // it gets feathered into the ground rather than sitting on it as a
            // rectangle — the WebGL burger has no edges either.
            <div className="flex h-full items-center justify-center">
              <FoodImage
                slug="p01_000"
                alt="A Burger Tree signature burger, built to order"
                priority
                sizes="(max-width: 768px) 92vw, 52vh"
                className="h-[70vh] w-auto max-w-[92vw] [mask-image:radial-gradient(ellipse_at_center,#000_38%,transparent_74%)]"
                ratio="3 / 4"
              />
            </div>
          )}
        </div>

        {/* Type */}
        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between py-[max(1.5rem,4svh)] pt-[calc(var(--nav-h)+2svh)]">
          <div ref={top} className="shell will-change-transform">
            <div ref={intro} className="flex flex-col items-center gap-5 text-center">
              <p className="ticket text-marigold">
                Since {BRAND.foundedYear} · Palakkad &amp; Coimbatore
              </p>
              <h1 className="display-xl text-cream">
                Slow<span className="sr-only"> on purpose</span>
              </h1>
            </div>
          </div>

          <div ref={bottom} className="shell will-change-transform">
            <div className="flex flex-col items-center gap-8 text-center">
              {/* The second half of the h1, split so the two words can travel
                  apart. Hidden from the outline; the h1 carries both. The
                  brand colour lands on the half that carries the argument. */}
              {/* Set smaller than SLOW: ten characters at the full display
                  size run edge to edge and bury the burger behind them. */}
              <p
                className="display-xl text-marigold"
                style={{ fontSize: 'clamp(2.4rem, 7.6vw, 7.5rem)' }}
                aria-hidden
              >
                On purpose
              </p>
              <p className="body-lg max-w-lg text-balance text-cream-dim">
                Nothing is cooked before you order it — not the patty, not the
                sauce, not the bun. That is why it takes {WAIT.label}. It is
                also why it tastes like this.
              </p>
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#order"
                  className="ticket rounded-full bg-marigold px-7 py-4 text-char transition-colors hover:bg-marigold-hi"
                >
                  Order ahead
                </a>
                <Link
                  href="/menu"
                  className="ticket rounded-full border border-[var(--line-strong)] px-7 py-4 text-cream transition-colors hover:border-marigold hover:text-marigold"
                >
                  See the menu
                </Link>
              </div>
              <p ref={hint} aria-hidden className="ticket-sm text-ash">
                {canvas ? 'Scroll to take it apart' : BRAND.promise}
              </p>
            </div>
          </div>
        </div>

        {/* The manifest — fades in as the stack opens. On narrow screens the
            per-layer labels are hidden, so this carries the idea alone. */}
        <div
          ref={manifest}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 opacity-0 will-change-transform"
        >
          <div className="shell pb-[max(1.5rem,5svh)]">
            <p className="ticket-sm text-ash">Eight layers</p>
            <p className="display-sm mt-3 max-w-md text-balance text-cream">
              Every one of them made in our kitchen, after you ordered it.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
