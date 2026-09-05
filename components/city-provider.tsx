'use client'

import { useCallback, useRef, useSyncExternalStore } from 'react'
import { CITIES, type City } from '@/data/site'
import { clsx } from '@/lib/cx'

/**
 * Which printed menu you are reading.
 *
 * Burger Tree prints two price columns — Palakkad and Coimbatore — and the gap
 * between them runs to fifty rupees on some items. Showing one number and
 * hoping is not an option, so the whole site reads from one choice, remembered
 * between visits.
 *
 * It is a module-level store rather than a context because there is exactly one
 * of it, it outlives any component, and `useSyncExternalStore` lets the server
 * and the first client paint agree on Palakkad (the older pair of outlets)
 * before the stored preference is applied — no provider, no hydration mismatch,
 * no flash of the wrong prices.
 */

const KEY = 'bt.city'
const DEFAULT: City = 'Palakkad'

let current: City | null = null
const listeners = new Set<() => void>()

function snapshot(): City {
  if (current) return current
  try {
    const saved = localStorage.getItem(KEY)
    current = saved && (CITIES as readonly string[]).includes(saved) ? (saved as City) : DEFAULT
  } catch {
    // Private mode or blocked storage. Palakkad it is.
    current = DEFAULT
  }
  return current
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  // Picking a city in one tab should update the others.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    current = null
    onChange()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function useCity() {
  const city = useSyncExternalStore(subscribe, snapshot, () => DEFAULT)

  const setCity = useCallback((next: City) => {
    current = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* the choice still holds for this session */
    }
    for (const fn of listeners) fn()
  }, [])

  return { city, setCity }
}

/** The segmented control. Used in the menu toolbar and on the home page. */
export function CitySwitch({ className }: { className?: string }) {
  const { city, setCity } = useCity()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  return (
    <div
      className={clsx(
        'city-switch relative isolate inline-grid grid-cols-2 rounded-full border border-[var(--line-strong)] p-1',
        className,
      )}
      role="radiogroup"
      aria-label="Choose your city"
      onKeyDown={(event) => {
        if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : city === CITIES[0] ? 1 : 0
        setCity(CITIES[next])
        buttons.current[next]?.focus()
      }}
    >
      <span aria-hidden className="city-switch-indicator" style={{ transform: `translateX(${city === CITIES[0] ? 0 : 100}%)` }} />
      {CITIES.map((c, i) => (
        <button
          ref={(element) => { buttons.current[i] = element }}
          key={c}
          type="button"
          role="radio"
          aria-checked={city === c}
          tabIndex={city === c ? 0 : -1}
          onClick={() => setCity(c)}
          className={clsx(
            'ticket relative min-h-11 rounded-full px-5 py-2.5 transition-colors',
            city === c ? 'text-char' : 'text-cream-dim hover:text-cream',
          )}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
