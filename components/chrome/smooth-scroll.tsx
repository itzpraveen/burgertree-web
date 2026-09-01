'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { publishScroll, trackPointer } from '@/lib/scroll-store'

/**
 * Lenis drives the page. It also becomes the single source of scroll truth
 * for the WebGL layer, so the canvas and the DOM never disagree about where
 * the page is — which is what causes the classic "text slides off its own
 * background image" bug on smooth-scrolled 3D sites.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stopPointer = trackPointer()

    const publishNative = () => {
      const limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      publishScroll({
        y: window.scrollY,
        limit,
        progress: window.scrollY / limit,
        velocity: 0,
        speed: 0,
        direction: 0,
      })
    }

    if (reduced) {
      // No inertia, but the store still needs feeding so the canvas tracks.
      publishNative()
      window.addEventListener('scroll', publishNative, { passive: true })
      window.addEventListener('resize', publishNative)
      return () => {
        window.removeEventListener('scroll', publishNative)
        window.removeEventListener('resize', publishNative)
        stopPointer()
      }
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
      // Let the browser handle overscroll/pull-to-refresh natively.
      overscroll: true,
    })

    lenis.on(
      'scroll',
      ({
        scroll: y,
        limit,
        velocity,
        progress,
        direction,
      }: {
        scroll: number
        limit: number
        velocity: number
        progress: number
        direction: 1 | -1 | 0
      }) => {
        publishScroll({
          y,
          limit: Math.max(1, limit),
          progress,
          velocity,
          speed: Math.min(1, Math.abs(velocity) / 45),
          direction,
        })
      },
    )

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // In-page anchors go through Lenis so they inherit the same easing.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -80 })
      // Keep keyboard focus with the visual jump.
      el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
      stopPointer()
    }
  }, [])

  return null
}
