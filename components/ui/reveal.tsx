'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { clsx } from '@/lib/cx'

/**
 * One IntersectionObserver per instance is wasteful at this page's scale, so
 * every Reveal shares a single module-level observer. Elements unobserve
 * themselves once they've played — this animation is a first impression, not
 * a state that has to be maintained.
 */
let observer: IntersectionObserver | null = null

function watch(el: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') {
    el.classList.add('reveal-in')
    return () => {}
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('reveal-in')
        observer!.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  )
  observer.observe(el)
  return () => observer?.unobserve(el)
}

export function Reveal({
  children,
  as = 'div',
  delay = 0,
  className,
}: {
  children: ReactNode
  as?: keyof React.JSX.IntrinsicElements
  /** Milliseconds. Use to cascade siblings. */
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Every tag we pass here takes the same ref/className/style props; the cast
  // just stops TS from having to prove that across the whole intrinsic union.
  const Tag = as as 'div'

  useEffect(() => {
    if (!ref.current) return
    // Server-rendered and no-JS content stays readable. Only stage elements
    // that have not reached the viewport; never hide something being read.
    if (
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      ref.current.getBoundingClientRect().top > window.innerHeight * 0.92
    ) ref.current.classList.add('reveal-pending')
    return watch(ref.current)
  }, [])

  return (
    <Tag
      ref={ref}
      className={clsx('reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
