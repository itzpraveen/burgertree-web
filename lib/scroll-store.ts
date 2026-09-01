'use client'

/**
 * A tiny external store for scroll state.
 *
 * The WebGL layer needs scroll position every frame. Routing that through
 * React state would re-render the tree 60 times a second, so instead Lenis
 * writes into this mutable object and anything that needs it reads the object
 * directly inside its own rAF / useFrame loop. React only subscribes when it
 * genuinely needs to re-render (e.g. the header's scrolled state).
 */

export type ScrollState = {
  /** Pixels from the top. */
  y: number
  /** 0–1 through the whole document. */
  progress: number
  /** Pixels per frame, signed. Smoothed. */
  velocity: number
  /** Normalised |velocity|, roughly 0–1, for shader uniforms. */
  speed: number
  /** Total scrollable height in px. */
  limit: number
  direction: 1 | -1 | 0
  /**
   * 0–1 through the hero's "take it apart" beat. Owned by the hero section,
   * read by the WebGL layer. It lives here rather than in React state for the
   * same reason `y` does: it changes every frame and nothing should re-render.
   */
  burgerOpen: number
}

export const scroll: ScrollState = {
  y: 0,
  progress: 0,
  velocity: 0,
  speed: 0,
  limit: 1,
  direction: 0,
  burgerOpen: 0,
}

type Listener = (s: ScrollState) => void
const listeners = new Set<Listener>()

export function onScroll(fn: Listener) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function publishScroll(next: Partial<ScrollState>) {
  Object.assign(scroll, next)
  for (const fn of listeners) fn(scroll)
}

/** Pointer position in normalised device coords, updated outside React. */
export const pointer = { x: 0, y: 0, tx: 0, ty: 0, down: false }

export function trackPointer() {
  if (typeof window === 'undefined') return () => {}
  const move = (e: PointerEvent) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  const down = () => (pointer.down = true)
  const up = () => (pointer.down = false)
  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointerdown', down, { passive: true })
  window.addEventListener('pointerup', up, { passive: true })
  return () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerdown', down)
    window.removeEventListener('pointerup', up)
  }
}

export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Maps v from [a,b] to [0,1], clamped. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a))
