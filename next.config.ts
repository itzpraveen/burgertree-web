import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    // Without this Turbopack walks up past the repo and finds an unrelated
    // pnpm-lock.yaml in the home directory, then warns about ignoring it.
    root: __dirname,
  },
}

export default nextConfig
