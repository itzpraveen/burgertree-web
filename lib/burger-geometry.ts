import * as THREE from 'three'

/**
 * The burger is built out of primitives and then roughed up, rather than
 * loaded as a model. Two reasons: nobody has to ship a 12 MB glTF over an
 * Indian mobile connection, and a perfectly smooth CG burger looks like a
 * render — the whole point of this place is that the food is handmade and
 * a bit irregular. So every layer gets displaced by value noise at build
 * time. Geometry is static once built; nothing runs per frame.
 */

/* ---------------------------------------------------------------- *
 * Value noise — small, deterministic, good enough for lumps.
 * ---------------------------------------------------------------- */

function hash(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123
  return n - Math.floor(n)
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** 3-D value noise in roughly [-1, 1]. */
export function noise3(x: number, y: number, z: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = smooth(x - ix)
  const fy = smooth(y - iy)
  const fz = smooth(z - iz)

  const c = (dx: number, dy: number, dz: number) => hash(ix + dx, iy + dy, iz + dz)

  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), fx)
  const x10 = lerp(c(0, 1, 0), c(1, 1, 0), fx)
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), fx)
  const x11 = lerp(c(0, 1, 1), c(1, 1, 1), fx)

  return (lerp(lerp(x00, x10, fy), lerp(x01, x11, fy), fz) - 0.5) * 2
}

/** Two octaves is plenty at this scale. */
const fbm = (x: number, y: number, z: number) =>
  noise3(x, y, z) * 0.68 + noise3(x * 2.3, y * 2.3, z * 2.3) * 0.32

/**
 * Push every vertex along its own normal by `amount * fbm(position * freq)`.
 * `mask` lets a caller protect part of the mesh — the flat cut face of a bun
 * has to stay flat or the sandwich stops stacking.
 */
function roughen(
  geo: THREE.BufferGeometry,
  amount: number,
  freq: number,
  mask?: (x: number, y: number, z: number) => number,
) {
  const pos = geo.attributes.position as THREE.BufferAttribute
  const nor = geo.attributes.normal as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const n = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    n.fromBufferAttribute(nor, i)
    const k = mask ? mask(v.x, v.y, v.z) : 1
    if (k === 0) continue
    const d = fbm(v.x * freq, v.y * freq, v.z * freq) * amount * k
    pos.setXYZ(i, v.x + n.x * d, v.y + n.y * d, v.z + n.z * d)
  }

  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

/* ---------------------------------------------------------------- *
 * Layers
 * ---------------------------------------------------------------- */

/**
 * Paint per-vertex colour into a geometry.
 *
 * A bun is not one colour: the crown is baked dark on top and pale where it
 * was cut, and no amount of lighting fakes that convincingly. Vertex colours
 * are free at render time and they are what stops the mesh reading as plastic.
 */
function tint(
  geo: THREE.BufferGeometry,
  fn: (x: number, y: number, z: number) => [number, number, number],
) {
  const pos = geo.attributes.position as THREE.BufferAttribute
  const col = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const [r, g, b] = fn(pos.getX(i), pos.getY(i), pos.getZ(i))
    col[i * 3] = r
    col[i * 3 + 1] = g
    col[i * 3 + 2] = b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return geo
}

const mix = (a: number[], b: number[], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

/**
 * Colour attributes are read in the renderer's linear working space, but every
 * colour anyone actually picks is sRGB. Going through THREE.Color does the
 * conversion — writing the sRGB numbers straight into the buffer is what makes
 * hand-authored vertex colours come out washed out and chalky.
 */
const _c = new THREE.Color()
const linear = (hex: string): [number, number, number] => {
  _c.set(hex)
  return [_c.r, _c.g, _c.b]
}

/** Pale, floury crumb → baked crust. */
const CRUMB = linear('#e9d0a6')
const CRUST = linear('#a25c22')

/** The domed top half, seeded. `thetaLength` curls it slightly under so the
 *  open edge never shows from a normal camera angle. */
export function bunCrown() {
  const g = new THREE.SphereGeometry(1, 128, 56, 0, Math.PI * 2, 0, Math.PI * 0.54)
  g.scale(1, 0.66, 1)
  // Protect the rim so the crown still sits flush on whatever is under it.
  roughen(g, 0.05, 1.9, (_x, y) => THREE.MathUtils.smoothstep(y, 0.0, 0.18))
  // A second, much finer pass is what reads as "bread" rather than "balloon".
  roughen(g, 0.011, 9.5, (_x, y) => THREE.MathUtils.smoothstep(y, -0.02, 0.14))
  return tint(g, (x, y, z) => {
    // Darkest across the top of the dome, paling towards the cut edge, with
    // enough noise that the gradient never looks like a gradient.
    const bake = THREE.MathUtils.smoothstep(y, 0.02, 0.5)
    const grain = fbm(x * 3.4, y * 3.4, z * 3.4) * 0.12
    return mix(CRUMB, CRUST, THREE.MathUtils.clamp(bake * 0.92 + grain, 0, 1))
  })
}

/** The flat-topped bottom half. */
export function bunHeel() {
  const g = new THREE.SphereGeometry(1, 128, 48, 0, Math.PI * 2, Math.PI * 0.46, Math.PI * 0.54)
  g.scale(1, 0.44, 1)
  roughen(g, 0.038, 2.2, (_x, y) => THREE.MathUtils.smoothstep(-y, 0.02, 0.2))
  roughen(g, 0.009, 10, (_x, y) => THREE.MathUtils.smoothstep(-y, 0.0, 0.16))
  return tint(g, (x, y, z) => {
    const bake = THREE.MathUtils.smoothstep(-y, 0.04, 0.34)
    const grain = fbm(x * 3.6, y * 3.6, z * 3.6) * 0.1
    return mix(CRUMB, CRUST, THREE.MathUtils.clamp(bake * 0.8 + grain, 0, 1))
  })
}

/** Sesame seeds as one instanced buffer, scattered over the crown's dome. */
export function sesamePlacements(count = 46) {
  const out: { pos: THREE.Vector3; quat: THREE.Quaternion; scale: number }[] = []
  const up = new THREE.Vector3(0, 1, 0)
  // Fibonacci hemisphere — even coverage without visible rows.
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count
    // Bias away from the very top and the very rim; that's where seeds sit.
    const phi = Math.acos(1 - t * 0.82) * 0.94
    const theta = golden * i
    const r = 1.005
    const x = Math.sin(phi) * Math.cos(theta) * r
    const z = Math.sin(phi) * Math.sin(theta) * r
    const y = Math.cos(phi) * 0.66 * r

    const pos = new THREE.Vector3(x, y, z)
    const normal = new THREE.Vector3(x, y / (0.66 * 0.66), z).normalize()
    const quat = new THREE.Quaternion().setFromUnitVectors(up, normal)
    // Random spin about the normal so they aren't all aligned.
    quat.multiply(new THREE.Quaternion().setFromAxisAngle(up, hash(i, 1, 2) * Math.PI * 2))
    out.push({ pos, quat, scale: 0.85 + hash(i, 3, 4) * 0.4 })
  }
  return out
}

export function sesameSeed() {
  const g = new THREE.SphereGeometry(0.036, 10, 8)
  g.scale(1, 0.5, 1.7)
  return g
}

/** Ground beef doesn't have a clean edge — the sides get the most noise. */
export function patty(radius = 0.94, height = 0.3) {
  const g = new THREE.CylinderGeometry(radius, radius * 0.97, height, 96, 8, false)
  roughen(g, 0.055, 3.0, (_x, y) =>
    // Full roughness at the rim, calmer across the faces.
    0.35 + 0.65 * (1 - Math.abs(y) / (height * 0.5)),
  )
  // The char is not uniform. The rim and the high spots catch the grill.
  const meat = linear('#6b4026')
  const char = linear('#241108')
  const sear = linear('#7d482a')
  return tint(g, (x, y, z) => {
    const r = Math.hypot(x, z) / radius
    const edge = THREE.MathUtils.smoothstep(r, 0.9, 1.04)
    const n = fbm(x * 5, y * 5, z * 5) * 0.5 + 0.5
    return mix(mix(meat, sear, n), char, edge * 0.55)
  })
}

/** A square slice that melts over the edge of the patty. */
export function cheeseSlice(size = 1.64) {
  const g = new THREE.PlaneGeometry(size, size, 30, 30)
  g.rotateX(-Math.PI / 2)
  const pos = g.attributes.position as THREE.BufferAttribute
  const half = size / 2
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    // Chebyshev distance keeps the droop square-cornered, like a real slice.
    const d = Math.max(Math.abs(x), Math.abs(z)) / half
    const droop = -Math.pow(THREE.MathUtils.smoothstep(d, 0.55, 1), 1.7) * 0.26
    const sag = fbm(x * 1.6, 0, z * 1.6) * 0.022
    pos.setY(i, droop + sag)
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
  return g
}

/** A frilled leaf skirt — a disc whose rim ruffles and lifts. */
export function lettuce(radius = 1.16) {
  const g = new THREE.CircleGeometry(radius, 160, 0, Math.PI * 2)
  g.rotateX(-Math.PI / 2)
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const r = Math.hypot(x, z)
    const a = Math.atan2(z, x)
    const rim = THREE.MathUtils.smoothstep(r / radius, 0.5, 1)
    const frill = Math.sin(a * 11) * 0.5 + Math.sin(a * 23 + 1.3) * 0.28
    pos.setY(i, rim * (0.13 * frill + 0.05) + fbm(x * 3, 0, z * 3) * 0.03 * rim)
    // Ruffle the outline too, so the silhouette isn't a circle.
    const push = 1 + rim * 0.07 * Math.sin(a * 17 + 0.4)
    pos.setX(i, x * push)
    pos.setZ(i, z * push)
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
  return g
}

/** Tomato / onion rounds. */
export function round(radius: number, height: number) {
  const g = new THREE.CylinderGeometry(radius, radius * 0.985, height, 56, 1)
  return roughen(g, 0.012, 6, () => 1)
}

export function onionRing(radius = 0.56) {
  return new THREE.TorusGeometry(radius, 0.058, 14, 80)
}

/** A blobby puddle of sauce — a disc with a wandering edge. */
export function sauce(radius = 0.92) {
  const g = new THREE.CircleGeometry(radius, 96)
  g.rotateX(-Math.PI / 2)
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const r = Math.hypot(x, z)
    const a = Math.atan2(z, x)
    const wobble = 1 + 0.12 * Math.sin(a * 5 + 0.7) + 0.06 * Math.sin(a * 9 + 2.1)
    const k = r / radius
    pos.setX(i, x * wobble)
    pos.setZ(i, z * wobble)
    pos.setY(i, (1 - k * k) * 0.05)
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
  return g
}
