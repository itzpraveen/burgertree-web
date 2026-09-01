'use client'

/*
 * react-hooks/immutability and react-hooks/refs are disabled for this file.
 *
 * Both rules exist to stop React components mutating things during render.
 * Nothing here happens during render: `useFrame` registers a callback on the
 * renderer's animation loop, and the refs it writes to are three.js scene
 * nodes, not DOM state. Driving a scene graph imperatively from that loop is
 * the whole point of react-three-fiber — but the rules can't see through a
 * third-party hook to know it, so they fire on every frame-loop write.
 */
/* eslint-disable react-hooks/immutability, react-hooks/refs */

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer } from '@react-three/drei'
import {
  bunCrown,
  bunHeel,
  cheeseSlice,
  lettuce,
  onionRing,
  patty,
  round,
  sauce,
  sesamePlacements,
  sesameSeed,
} from '@/lib/burger-geometry'
import { clamp, damp, pointer, scroll } from '@/lib/scroll-store'

/* ---------------------------------------------------------------- *
 * The stack
 *
 * `y` is where a layer sits in the finished burger. The exploded
 * positions are derived from the index so the fan is always even, and
 * the label is what the kitchen actually calls the thing.
 * ---------------------------------------------------------------- */

type Layer = {
  id: string
  label: string
  note: string
  y: number
}

export const LAYERS: Layer[] = [
  { id: 'heel', label: 'Bun, heel', note: 'Baked here this morning', y: -0.74 },
  { id: 'sauce', label: 'House mayo', note: 'Mixed in house', y: -0.64 },
  { id: 'lettuce', label: 'Lettuce', note: 'Cut to order', y: -0.56 },
  { id: 'tomato', label: 'Tomato', note: 'Never from a tin', y: -0.45 },
  { id: 'patty', label: 'The patty', note: 'Grilled after you ordered', y: -0.24 },
  { id: 'cheese', label: 'Cheese', note: 'Melted on, not laid on', y: -0.05 },
  { id: 'onion', label: 'Onion', note: 'Raw, for the bite', y: -0.015 },
  { id: 'crown', label: 'Bun, crown', note: 'Sesame, by hand', y: 0.07 },
]

const EXPLODE_GAP = 0.58
const explodedY = (i: number) => (i - (LAYERS.length - 1) / 2) * EXPLODE_GAP

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

/* ---------------------------------------------------------------- *
 * Materials
 *
 * Colours are the food's, not the brand's — a marigold burger would be
 * a graphic, not a burger. The brand colour arrives as light instead:
 * the rim on every layer is the menu's marigold, thrown by a lightformer.
 * ---------------------------------------------------------------- */

function useMaterials() {
  return useMemo(
    () => ({
      // The bun and the patty carry their colour per-vertex, baked in at
      // geometry time, so the material only has to supply the surface.
      bun: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.76,
        metalness: 0,
        clearcoat: 0.18,
        clearcoatRoughness: 0.7,
      }),
      crumb: new THREE.MeshStandardMaterial({ color: '#c9a878', roughness: 0.95 }),
      seed: new THREE.MeshStandardMaterial({ color: '#e7d7b4', roughness: 0.55 }),
      patty: new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.72,
        metalness: 0.04,
      }),
      cheese: new THREE.MeshPhysicalMaterial({
        color: '#d08a1c',
        roughness: 0.48,
        clearcoat: 0.25,
        clearcoatRoughness: 0.6,
        side: THREE.DoubleSide,
      }),
      lettuce: new THREE.MeshStandardMaterial({
        color: '#437f31',
        roughness: 0.58,
        side: THREE.DoubleSide,
      }),
      tomato: new THREE.MeshStandardMaterial({ color: '#9e2c1b', roughness: 0.44 }),
      onion: new THREE.MeshStandardMaterial({ color: '#cdbcc9', roughness: 0.5 }),
      sauce: new THREE.MeshPhysicalMaterial({
        color: '#e6d2a4',
        roughness: 0.3,
        clearcoat: 0.6,
        side: THREE.DoubleSide,
      }),
    }),
    [],
  )
}

function useGeometry() {
  return useMemo(
    () => ({
      crown: bunCrown(),
      heel: bunHeel(),
      seed: sesameSeed(),
      seeds: sesamePlacements(54),
      patty: patty(),
      cheese: cheeseSlice(),
      lettuce: lettuce(),
      tomato: round(0.46, 0.1),
      onion: onionRing(0.54),
      sauce: sauce(),
      /** Caps the open bottom of the crown so the sandwich never shows a hole. */
      crumb: new THREE.CircleGeometry(0.955, 64).rotateX(Math.PI / 2),
    }),
    [],
  )
}

/* ---------------------------------------------------------------- *
 * Labels
 *
 * These live outside the rotating group. Pin them inside it and they
 * orbit the burger, which is both unreadable and slightly seasick — the
 * label has to hold still while the thing it names turns.
 * ---------------------------------------------------------------- */

function LayerLabel({ layer, index }: { layer: Layer; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useFrame(() => {
    const el = ref.current
    if (!el) return
    // Stagger so they arrive bottom-up, the order a burger is built in.
    const t = clamp((scroll.burgerOpen - 0.14 - index * 0.05) / 0.22)
    el.style.opacity = String(t)
    el.style.transform = `translateX(${(1 - t) * -18}px)`
  })

  return (
    <Html
      center={false}
      zIndexRange={[10, 0]}
      style={{ pointerEvents: 'none' }}
      transform={false}
    >
      <div ref={ref} className="hidden -translate-y-1/2 opacity-0 lg:block">
        <div className="flex items-start gap-3 whitespace-nowrap">
          {/* A leader back towards the layer this names. */}
          <span className="mt-2.5 block h-px w-9 shrink-0 bg-[var(--line-strong)]" aria-hidden />
          <span className="ticket-sm mt-2 text-marigold">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="block">
            <span className="display-sm block text-cream">{layer.label}</span>
            <span className="ticket-sm mt-1.5 block text-ash">{layer.note}</span>
          </span>
        </div>
      </div>
    </Html>
  )
}

/* ---------------------------------------------------------------- *
 * The burger
 * ---------------------------------------------------------------- */

export function Burger({ withLabels = true }: { withLabels?: boolean }) {
  const group = useRef<THREE.Group>(null)
  // One stable ref object per layer, created once. Handing `ref` a plain
  // object rather than a fresh closure each render keeps the ref out of the
  // render path entirely.
  const layers = useMemo(
    () => LAYERS.map(() => ({ current: null as THREE.Group | null })),
    [],
  )
  const anchors = useMemo(
    () => LAYERS.map(() => ({ current: null as THREE.Group | null })),
    [],
  )
  const seedRef = useRef<THREE.InstancedMesh>(null)
  const g = useGeometry()
  const m = useMaterials()
  const { camera } = useThree()

  const intro = useRef(0)
  const spin = useRef(0)
  const tiltX = useRef(0)
  const tiltY = useRef(0)

  // Sesame seeds: one instanced draw call for all of them. This has to be a
  // layout effect — inside useMemo the ref is still null.
  useLayoutEffect(() => {
    const mesh = seedRef.current
    if (!mesh) return
    const mat = new THREE.Matrix4()
    const s = new THREE.Vector3()
    g.seeds.forEach((seed, i) => {
      s.setScalar(seed.scale)
      mat.compose(seed.pos, seed.quat, s)
      mesh.setMatrixAt(i, mat)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [g.seeds])

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30)
    intro.current = Math.min(1, intro.current + d / 1.5)

    const open = scroll.burgerOpen
    // Idle rotation never stops; it just slows right down once the stack
    // is open, because that's when you're actually reading the labels.
    spin.current += d * (0.2 - open * 0.15)

    tiltY.current = damp(tiltY.current, pointer.tx * 0.3, 3, d)
    tiltX.current = damp(tiltX.current, -pointer.ty * 0.14, 3, d)

    const lift = 0.16 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03 + (1 - open) * 0.36

    if (group.current) {
      group.current.rotation.y = spin.current + tiltY.current
      group.current.rotation.x = tiltX.current + open * 0.08
      group.current.position.y = lift
    }

    LAYERS.forEach((layer, i) => {
      const node = layers[i].current
      const target = THREE.MathUtils.lerp(layer.y, explodedY(i), open)

      if (node) {
        // Each layer lands a beat after the one below it.
        const settle = easeOutExpo(clamp((intro.current - i * 0.055) / 0.55))
        const from = layer.y + 3.4 + i * 0.5
        node.position.y = THREE.MathUtils.lerp(from, target, settle)
        node.scale.setScalar(0.86 + settle * 0.14)
        node.rotation.y = (1 - settle) * 1.1
      }

      // The label anchor follows the same height but never the rotation, and
      // sits further out as the camera pulls back so it holds a constant
      // distance from the burger on screen.
      const anchor = anchors[i].current
      if (anchor) {
        anchor.position.set(camera.position.z * 0.155, target + lift, 0)
      }
    })

    // Ease the camera back so the opened stack still fits the frame. On a
    // phone held upright the burger is nearly as wide as the screen, so narrow
    // viewports get pushed back further again.
    const aspect = state.size.width / Math.max(1, state.size.height)
    const fit = THREE.MathUtils.clamp(0.62 / aspect, 1, 1.5)
    camera.position.z = damp(
      camera.position.z,
      THREE.MathUtils.lerp(9.3, 12.6, open) * fit,
      4,
      d,
    )
    // Rise as it opens. Seen dead-on, the rounds and rings read as lines;
    // a few degrees of elevation is what turns the stack into a diagram.
    camera.position.y = damp(camera.position.y, 0.36 + open * 3.4, 4, d)
    camera.lookAt(0, 0.16, 0)
  })

  return (
    <>
      <group ref={group}>
        {/* 0 — bun heel */}
        <group ref={layers[0]}>
          <mesh geometry={g.heel} material={m.bun} castShadow receiveShadow />
          <mesh geometry={g.crumb} material={m.crumb} position={[0, 0.03, 0]} />
        </group>

        {/* 1 — sauce */}
        <group ref={layers[1]}>
          <mesh geometry={g.sauce} material={m.sauce} />
        </group>

        {/* 2 — lettuce */}
        <group ref={layers[2]}>
          <mesh geometry={g.lettuce} material={m.lettuce} castShadow />
        </group>

        {/* 3 — tomato rounds */}
        <group ref={layers[3]}>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2 + 0.4
            return (
              <mesh
                key={i}
                geometry={g.tomato}
                material={m.tomato}
                position={[Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5]}
                castShadow
              />
            )
          })}
        </group>

        {/* 4 — the patty */}
        <group ref={layers[4]}>
          <mesh geometry={g.patty} material={m.patty} castShadow receiveShadow />
        </group>

        {/* 5 — cheese */}
        <group ref={layers[5]}>
          <mesh geometry={g.cheese} material={m.cheese} castShadow />
        </group>

        {/* 6 — onion rings */}
        <group ref={layers[6]}>
          {[
            [0, 0, 0, 1],
            [0.2, 0.02, -0.14, 0.78],
            [-0.24, -0.01, 0.12, 0.62],
          ].map(([x, y, z, s], i) => (
            <mesh
              key={i}
              geometry={g.onion}
              material={m.onion}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, y, z]}
              scale={s}
              castShadow
            />
          ))}
        </group>

        {/* 7 — bun crown */}
        <group ref={layers[7]}>
          <mesh geometry={g.crown} material={m.bun} castShadow receiveShadow />
          <mesh geometry={g.crumb} material={m.crumb} position={[0, 0.005, 0]} />
          <instancedMesh ref={seedRef} args={[g.seed, m.seed, g.seeds.length]} castShadow />
        </group>
      </group>

      {/* Label anchors — same heights, no rotation. */}
      {withLabels &&
        LAYERS.map((layer, i) => (
          <group key={layer.id} ref={anchors[i]}>
            <LayerLabel layer={layer} index={i} />
          </group>
        ))}

      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.5}
        scale={10}
        blur={2.8}
        far={4}
        resolution={512}
        color="#000000"
      />
    </>
  )
}

/**
 * No HDRI download — the environment is four emissive quads. Costs a 128px
 * cubemap render at mount and nothing after that, and it keeps the whole
 * page self-hosted.
 */
export function Lights() {
  return (
    <>
      <ambientLight intensity={0.34} color="#ffe9c4" />
      <directionalLight
        position={[3.2, 6, 4]}
        intensity={2.1}
        color="#fff2d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
      >
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.1, 24]} />
      </directionalLight>
      {/* The brand colour, used as a rim rather than as paint. */}
      <pointLight position={[-4.6, 1.6, -3.6]} intensity={22} color="#f5b119" distance={18} />
      <pointLight position={[4.4, -1.4, 2.8]} intensity={9} color="#d2521b" distance={15} />

      <Environment resolution={128}>
        <Lightformer intensity={1.6} position={[0, 4.5, 2]} scale={[7, 7, 1]} color="#fff1d6" />
        <Lightformer intensity={2.6} position={[-5, 1, -4]} scale={[5, 5, 1]} color="#f5b119" />
        <Lightformer intensity={1} position={[5, 0, 3]} scale={[4, 4, 1]} color="#d2521b" />
        <Lightformer
          intensity={0.6}
          position={[0, -4, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 8, 1]}
          color="#232019"
        />
      </Environment>
    </>
  )
}
