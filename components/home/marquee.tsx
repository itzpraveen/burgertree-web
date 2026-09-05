'use client'

import { useEffect, useRef, useState } from 'react'
import { BurgerGlyph, HeartGlyph } from '@/components/brand/logo'

export function PromiseMarquee() {
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      element.style.setProperty('--marquee-state', entry.isIntersecting ? 'running' : 'paused')
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="promise-strip" data-paused={paused}>
      <div className="promise-window">
        <div className="promise-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="promise-copy" aria-hidden={copy === 1}>
              {['Freshly made', 'Never frozen', 'Always with love'].map((word, i) => (
                <span key={word} className="promise-word">
                  {word}{i === 2 ? <HeartGlyph size={24} /> : <BurgerGlyph size={24} />}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="promise-toggle" aria-label={paused ? 'Play brand ticker' : 'Pause brand ticker'} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
        <span aria-hidden>{paused ? '▷' : 'Ⅱ'}</span>
      </button>
    </div>
  )
}
