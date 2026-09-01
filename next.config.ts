import type { NextConfig } from 'next'

/**
 * GitHub Pages serves this repo at /burgertree-web, so the whole site is built
 * under that prefix. Empty locally, so `next dev` still runs at the root; the
 * deploy workflow sets it. Anything that assembles an asset URL by hand — the
 * <picture> srcsets in lib/images.ts — has to apply it too, because Next only
 * rewrites the paths it owns (next/link, next/image, its own chunks).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  /* Pages is a static host with no Node runtime, so every route is written out
     as a file. All thirteen were already prerendered, so nothing is lost. */
  output: 'export',
  basePath,
  /* One directory per route (out/menu/index.html) rather than out/menu.html,
     so serving never depends on the host guessing an extension. */
  trailingSlash: true,
  images: {
    /* The optimiser needs a server. It was never doing any work here anyway:
       the food photography is resized at build time by scripts/build-assets.mjs
       and served through a plain <picture>, and next/image is used only for the
       logo PNGs, which are already small. */
    unoptimized: true,
  },
  turbopack: {
    // Without this Turbopack walks up past the repo and finds an unrelated
    // pnpm-lock.yaml in the home directory, then warns about ignoring it.
    root: __dirname,
  },
}

export default nextConfig
