'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * A media query as a React value.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: the query has
 * an answer the moment the client renders, so there is no reason to render
 * once with a guess and then immediately set state to correct it. The server
 * snapshot is always `false`, which is the safe answer for both of the
 * queries this site asks — assume motion is fine, assume no WebGL — so the
 * markup Next prerenders matches what the client first paints.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')

/* ------------------------------------------------------------------ *
 * WebGL capability
 *
 * Probing costs a context creation, so it is done once and cached for the
 * life of the tab. Exposed through the same external-store mechanism so the
 * server and the first client paint agree on `false`.
 * ------------------------------------------------------------------ */

let webglAnswer: boolean | null = null

function probeWebGL() {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') ?? c.getContext('webgl')
    if (!gl) return false
    // Software rasterisers hand back a context and then run at four frames a
    // second. Not worth it — the photograph is better.
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
    return !/swiftshader|llvmpipe|software/i.test(name)
  } catch {
    return false
  }
}

const noopSubscribe = () => () => {}

export function useHasWebGL() {
  return useSyncExternalStore(
    noopSubscribe,
    () => (webglAnswer ??= probeWebGL()),
    () => false,
  )
}
