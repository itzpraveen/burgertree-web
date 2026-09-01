'use client'

import { useEffect, useRef } from 'react'
import { BurgerGlyph } from '@/components/brand/logo'
import { scroll } from '@/lib/scroll-store'

/**
 * The promise, running. It drifts on its own and is shoved along by however
 * hard you are scrolling — the strip is the only thing on the page that
 * reacts to scroll *speed* rather than scroll *position*, which is what makes
 * it feel like a physical object rather than a CSS animation.
 */
export function PromiseMarquee() {
  const inner = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = inner.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let x = 0
    let raf = 0
    let last = performance.now()
    // One copy's width; we wrap on it so the loop is seamless.
    const span = () => el.scrollWidth / 2 || 1

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      x -= (34 + Math.abs(scroll.velocity) * 5) * dt
      const w = span()
      if (x <= -w) x += w
      el.style.transform = `translate3d(${x}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const words = ['Freshly made', 'Never frozen', 'Always with love']

  return (
    <div className="relative overflow-hidden border-b border-char/20 bg-marigold py-6">
      <div ref={inner} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {words.map((w) => (
              <span key={w} className="flex shrink-0 items-center">
                <span className="display-md whitespace-nowrap px-8 text-char">{w}</span>
                <BurgerGlyph size={24} className="shrink-0 brightness-0 opacity-75" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
