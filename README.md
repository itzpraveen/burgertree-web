# Burger Tree

Marketing site for [Burger Tree](https://www.burgertree.in) — four burger kitchens
across Palakkad (Kerala) and Coimbatore (Tamil Nadu), a unit of Aspire Holdings.

Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, react-three-fiber.
Every route is statically prerendered; there is no server-side runtime.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Deployment

The site is a static export (`output: 'export'`), published to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`:

    https://itzpraveen.github.io/burgertree-web/

Pages serves the repo from a sub-path, so two values are baked in at build time
by the workflow:

| Variable | Value | Reaches |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | `/burgertree-web` | `basePath`, and `lib/base-path.ts` for every asset URL written by hand |
| `NEXT_PUBLIC_SITE_URL` | the Pages URL | canonicals, JSON-LD, `sitemap.xml`, `robots.txt` |

Both are empty/default locally, so `npm run dev` still runs at the root. Moving
to burgertree.in means dropping `NEXT_PUBLIC_BASE_PATH`, pointing
`NEXT_PUBLIC_SITE_URL` at the domain, and adding a `CNAME` — no code changes.

Note that `next/image` does **not** apply `basePath` to `src`, and neither does
a hand-built `srcset`; both go through `asset()` in `lib/base-path.ts`.

## The idea

Burger Tree's own menu says, in capitals, that it is **not** a quick service
restaurant, and that every order takes 20–25 minutes because nothing is started
until you ask for it. The site is built around that sentence rather than around
it: the home page opens on a burger that assembles itself and then, as you
scroll, comes apart into its eight labelled layers.

## Where the content comes from

Nothing on this site is invented. `data/site.ts` and `data/menu.ts` carry a
comment on every field pointing at its source, which is one of:

| Source | Used for |
| --- | --- |
| `Burger Tree menu design_palakkad.pdf` | the `pkd` price column, brand copy |
| `Burger Tree menu design_aug15v2.pdf` | the `cbe` price column (Race Course & RS Puram) |
| `Menu CBE.pdf` | the food photography |
| burgertree.in | addresses, phone numbers, emails |

The two menus price the same dishes differently — up to ₹50 apart — and
Coimbatore prints a coffee list that Palakkad does not. So every item carries
both prices, `null` means "not on that city's menu", and the UI hides those
items rather than guessing a number. All prices exclude GST, as the menus say.

## Layout

```
app/                 routes; all static
  layout.tsx         fonts, metadata, Organization + Restaurant JSON-LD
  menu/              the browser (city, diet filter, search) + Menu JSON-LD
components/
  webgl/             the react-three-fiber burger
  home/ menu/ ui/    page sections and primitives
  chrome/            header, footer, Lenis smooth scroll
data/
  site.ts            brand facts, four outlets
  menu.ts            169 items, both price columns
  images.json        photo manifest written by scripts/build-assets.mjs
lib/
  burger-geometry.ts procedural burger, built from primitives + value noise
  scroll-store.ts    scroll state outside React, read per frame by the canvas
```

## The burger

`lib/burger-geometry.ts` builds all eight layers out of three.js primitives and
then displaces every vertex with value noise, so there is no model to download
and nothing looks machined. Colour is baked per-vertex (crust, crumb, sear).
The environment is four `Lightformer` quads rather than an HDRI, so the page
fetches nothing from a CDN at runtime.

It degrades in three steps: no WebGL2, a software rasteriser, or
`prefers-reduced-motion` gets the hero photograph instead; a GPU that starts
dropping frames loses the effect composer, then resolution, via
`PerformanceMonitor` and `AdaptiveDpr`.

## Photography

The 365 files in `public/food` are AVIF/WebP/JPEG derivatives at four widths,
plus an inline LQIP per image, generated from the picture menu:

```bash
# extract the page images, then
SRC=/path/to/extracted npm exec -- node scripts/build-assets.mjs
```

They are served through a plain `<picture>` rather than `next/image` — the
optimisation already happened at build time, so re-running it per request would
buy nothing.
