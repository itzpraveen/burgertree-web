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

## The brand and experience

The homepage uses Burger Tree's exact `#FAA227` orange, original stacked logo,
burger and heart marks, and menu photography. The hero features a background
edit of the brand's Smokey Chick photo; [image provenance and prompts](docs/hero-image.md)
document that treatment. Its direction comes from
the [brand's own story](https://www.burgertree.in/about): a family café and
bakery in Calicut in 1998, buns and patties made in the kitchen, and gathering
over a good meal. Orange, warm paper, and charcoal carry that story throughout.

The page leads with the brand and food, then explains the kitchen's three
pillars and bakery roots. The 20–25 minute preparation time remains visible in
the hero and ordering section. City selection is shared between featured
prices, the full menu, and the order-ahead kitchen directory. Featured dishes
link directly to their entries in the menu.

Motion includes a staged headline and product entrance, scroll-linked photography,
a pausable brand ticker, section reveals, a sliding city selector, and mobile
navigation and link transitions. Reduced-motion preferences are respected;
touch devices use native scrolling. Content remains visible without JavaScript,
and the mobile navigation uses a native modal dialog for focus and Escape.

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
  webgl/             retained procedural burger experiment (not mounted)
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

## The retained WebGL experiment

The current homepage leads with authentic food photography. The earlier
procedural burger modules remain available for a future dedicated experience,
but are not imported or downloaded by the homepage.

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
