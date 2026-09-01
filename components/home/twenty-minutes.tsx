'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from '@/components/ui/reveal'
import { BRAND, WAIT } from '@/data/site'
import { usePrefersReducedMotion } from '@/lib/use-media'

/**
 * The disclaimer, given the room it deserves.
 *
 * Every other restaurant site buries this line in the FAQ. It is printed in
 * capitals on page two of Burger Tree's own menu, so here it is the argument
 * the whole page is making, and the clock beside it counts the wait out in
 * full rather than rounding it away.
 */
const TOTAL = BRAND.prepMinutes * 60

function Clock() {
  const still = usePrefersReducedMotion()
  // With motion suppressed the clock simply reads the finished time.
  const [sec, setSec] = useState(0)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el || still) return

    let raf = 0
    let start = 0
    const run = (now: number) => {
      start ||= now
      // Twenty minutes, played back over two and a half seconds.
      const t = Math.min(1, (now - start) / 2500)
      setSec(Math.round(t * TOTAL))
      if (t < 1) raf = requestAnimationFrame(run)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        raf = requestAnimationFrame(run)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [still])

  const shown = still ? TOTAL : sec
  const mm = String(Math.floor(shown / 60)).padStart(2, '0')
  const ss = String(shown % 60).padStart(2, '0')

  return (
    <div ref={box} className="flex flex-col items-start gap-4">
      <p className="ticket-sm text-ash">Time on the ticket</p>
      <p className="num display-xl text-marigold tabular-nums" aria-live="off">
        {mm}:{ss}
      </p>
      <p className="ticket-sm max-w-52 leading-relaxed text-ash">{WAIT.peakNote}</p>
    </div>
  )
}

export function TwentyMinutes() {
  return (
    <section className="relative overflow-hidden bg-olive py-28 lg:py-40">
      <div
        aria-hidden
        className="hatch pointer-events-none absolute inset-0 opacity-40"
      />
      <div className="shell relative grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-24">
        <div>
          <Reveal>
            <p className="ticket text-marigold">Please note</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-lg mt-8 text-cream">
              We are not a quick service restaurant
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <blockquote className="body-lg mt-9 max-w-xl border-l-2 border-marigold pl-6 text-cream-dim">
              “{BRAND.disclaimer}”
              <footer className="ticket-sm mt-4 text-ash">
                Printed on every menu we hand out
              </footer>
            </blockquote>
          </Reveal>
          <Reveal delay={240}>
            <p className="body-base mt-9 max-w-xl text-cream-dim">
              {BRAND.prepNote} It is not a queue and it is not understaffing —
              it is a patty that goes on the grill after your order reaches the
              kitchen, and a bun that came out of our own oven this morning.
            </p>
            <a
              href="#order"
              className="ticket mt-9 inline-flex items-center gap-3 rounded-full bg-marigold px-7 py-4 text-char transition-colors hover:bg-marigold-hi"
            >
              Skip the wait — order ahead
              <span aria-hidden>↑</span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:justify-self-end">
          <Clock />
        </Reveal>
      </div>
    </section>
  )
}
