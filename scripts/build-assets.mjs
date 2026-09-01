import sharp from 'sharp'
import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'


// Where the extracted page images live. Point SRC at them and re-run;
// see the README for how they were pulled out of the menu PDF.
const SRC = process.env.SRC || path.resolve('.assets/source')
const OUT = path.resolve('public/food')
const MAP = process.env.MAP || path.resolve('data/photo-map.json')

const WIDTHS = [480, 800, 1280, 1920]

async function main() {
  await mkdir(OUT, { recursive: true })
  let map = {}
  try { map = JSON.parse(await readFile(MAP, 'utf8')) } catch { console.warn('no photo-map.json — using file keys') }

  const files = (await readdir(SRC)).filter(f => f.endsWith('.png'))
  const manifest = []

  for (const f of files) {
    const key = f.replace(/\.png$/, '')
    const entry = map[key] || {}
    const slug = entry.slug || key
    const src = path.join(SRC, f)
    const img = sharp(src)
    const meta = await img.metadata()

    // trim pure-white studio backgrounds to transparency when flagged
    const base = entry.cutout
      ? sharp(await img.clone().ensureAlpha().toBuffer())
      : img

    const outs = {}
    for (const w of WIDTHS) {
      if (w > meta.width * 1.05) continue
      const r = base.clone().resize({ width: w, withoutEnlargement: true })
      await r.clone().avif({ quality: 60, effort: 3 }).toFile(path.join(OUT, `${slug}-${w}.avif`))
      await r.clone().webp({ quality: 80, effort: 4 }).toFile(path.join(OUT, `${slug}-${w}.webp`))
      outs[w] = true
    }
    // jpeg fallback at 1280
    await base.clone().resize({ width: 1280, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, `${slug}.jpg`))

    // tiny LQIP as inline base64
    const lqip = await base.clone().resize({ width: 20 }).blur(1).webp({ quality: 30 }).toBuffer()

    manifest.push({
      key, slug,
      width: meta.width, height: meta.height,
      aspect: +(meta.width / meta.height).toFixed(4),
      widths: Object.keys(outs).map(Number),
      lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
      ...entry,
    })
    process.stdout.write(`· ${slug} ${meta.width}x${meta.height}\n`)
  }

  await mkdir(path.resolve('data'), { recursive: true })
  await writeFile(path.resolve('data/images.json'), JSON.stringify(manifest, null, 1))
  console.log(`\n${manifest.length} images → public/food, manifest → data/images.json`)
}
main()
