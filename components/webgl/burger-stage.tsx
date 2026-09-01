'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Preload } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Burger, Lights } from './burger-scene'

/**
 * The canvas, its own lighting rig, and a performance escape hatch.
 *
 * On a phone that starts dropping frames `PerformanceMonitor` turns off the
 * effect composer first and lets `AdaptiveDpr` walk the resolution down after
 * that — losing the bloom is a much smaller loss than losing 60fps, and the
 * burger is still the burger.
 */
export default function BurgerStage({ withLabels = true }: { withLabels?: boolean }) {
  const [effects, setEffects] = useState(true)

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }}
      camera={{ fov: 30, position: [0, 0.35, 7.4], near: 0.1, far: 60 }}
      // The page owns scrolling; the canvas must never eat a wheel event.
      style={{ pointerEvents: 'none' }}
      eventPrefix="client"
    >
      <PerformanceMonitor
        onDecline={() => setEffects(false)}
        flipflops={2}
        onFallback={() => setEffects(false)}
      />
      <AdaptiveDpr pixelated={false} />

      <Suspense fallback={null}>
        <Lights />
        <Burger withLabels={withLabels} />
        <Preload all />
      </Suspense>

      {effects && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.88}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          <Vignette offset={0.3} darkness={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
