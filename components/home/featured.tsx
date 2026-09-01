'use client'

import Link from 'next/link'
import { CitySwitch, useCity } from '@/components/city-provider'
import { FoodImage } from '@/components/ui/food-image'
import { Reveal } from '@/components/ui/reveal'
import { SectionHead } from '@/components/ui/section-head'
import { DietMark, HeatMark } from '@/components/menu/marks'
import { FEATURED, byId, itemCount, priceFor, priceRange } from '@/data/menu'

/**
 * Six dishes, staggered so the eye walks down the page instead of scanning a
 * grid. Each one is a real menu item with its real price for the city you
 * picked — a decorative "our favourites" rail that doesn't tell you what
 * anything costs would be worse than no rail at all.
 */
export function Featured() {
  const { city } = useCity()
  const range = priceRange(city)
  const count = itemCount(city)

  // A card with no photograph breaks the stagger, so only photographed dishes lead.
  const dishes = FEATURED.map((id) => byId(id)).filter(
    (d): d is NonNullable<typeof d> => d?.photo !== undefined,
  )

  return (
    <section id="eat" className="shell py-28 lg:py-40">
      <SectionHead
        index={2}
        kicker="What you came for"
        title="Worth the wait"
        lede={`Chicken, beef, paneer and mushroom; burgers, subwiches, burritos, bowls, clubs, loaded fries, shakes, mojitos and faloodas. Prices below are the ${city} column.`}
      />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <CitySwitch />
        <p className="ticket-sm text-ash">
          {count} items · ₹{range.min}–₹{range.max} · ex GST
        </p>
      </div>

      <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((d, i) => {
          const price = priceFor(d, city)
          return (
            <Reveal
              as="li"
              key={d.id}
              delay={(i % 3) * 110}
              // A half-card drop on the middle column turns three tidy rows
              // into one continuous stagger.
              className={i % 3 === 1 ? 'lg:mt-20' : i % 3 === 2 ? 'lg:mt-10' : undefined}
            >
              <article className="group flex h-full flex-col">
                <div className="overflow-hidden rounded-lg">
                  {d.photo && (
                    <FoodImage
                      slug={d.photo}
                      alt={d.name}
                      ratio="4 / 5"
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      imgClassName="transition-transform duration-[1.1s] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.05]"
                    />
                  )}
                </div>
                <div className="rule mt-6 flex items-baseline justify-between gap-4 pt-5">
                  <h3 className="display-sm flex items-center gap-2.5 text-cream">
                    <DietMark diet={d.diet} />
                    {d.name}
                    <HeatMark heat={d.heat} />
                  </h3>
                  {price !== null && (
                    <span className="num shrink-0 text-lg text-marigold">₹{price}</span>
                  )}
                </div>
                {d.desc && <p className="body-base mt-3 text-cream-dim">{d.desc}</p>}
              </article>
            </Reveal>
          )
        })}
      </ul>

      <Reveal delay={120}>
        <Link
          href="/menu"
          className="ticket mt-16 inline-flex items-center gap-3 rounded-full border border-[var(--line-strong)] px-7 py-4 text-cream transition-colors hover:border-marigold hover:text-marigold"
        >
          The whole menu
          <span aria-hidden>→</span>
        </Link>
      </Reveal>
    </section>
  )
}
