import Link from 'next/link'
import { Reveal } from '@/components/ui/reveal'
import { FoodImage } from '@/components/ui/food-image'
import { BRAND } from '@/data/site'

/**
 * The origin, told with a number rather than a photograph. There is no
 * archive of the Calicut bakery to show, and a stock picture of a vintage
 * oven would be a lie, so the year does the work.
 */
export function Origin() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--line)] bg-char-2">
      <div className="shell grid gap-16 py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-24 lg:py-40">
        <div>
          <Reveal>
            <p className="ticket text-marigold">The short version</p>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="display-xl mt-8 text-cream"
              style={{ fontSize: 'clamp(5rem, 16vw, 15rem)' }}
            >
              <span className="sr-only">Founded in </span>
              {BRAND.foundedYear}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="body-lg mt-8 max-w-lg text-cream-dim">
              Burger Tree started in {BRAND.foundedPlace} as a bakery. That is
              the whole explanation for everything odd about this place — why
              the buns are ours, why nothing is frozen, and why a burger takes
              as long as bread does.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <Link
              href="/story"
              className="ticket mt-10 inline-flex items-center gap-3 text-cream transition-colors hover:text-marigold"
            >
              Read the long version
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <figure className="relative">
            <FoodImage
              slug="p05_022"
              alt="A flame grilled beef burger on the pass at Burger Tree"
              ratio="4 / 5"
              sizes="(max-width: 1024px) 92vw, 44vw"
              className="rounded-lg"
            />
            <figcaption className="ticket-sm mt-4 text-ash">
              {BRAND.promise}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
