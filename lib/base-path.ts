/**
 * The sub-path this build is served from — `/burgertree-web` on GitHub Pages,
 * empty everywhere else. It has to be set at build time because Next inlines
 * it into the bundle (see `basePath` in next.config.ts, which reads the same
 * variable).
 *
 * Next applies it to next/link hrefs and to its own chunks, but not to a `src`
 * we write ourselves — including next/image's, which is documented to need the
 * prefix by hand. So every literal asset path in the app goes through here.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** `/brand/logo.png` → `/burgertree-web/brand/logo.png`. */
export const asset = (path: string) => `${BASE_PATH}${path}`
