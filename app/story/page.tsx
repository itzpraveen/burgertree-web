import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHead } from '@/components/ui/page-head'
import { Reveal } from '@/components/ui/reveal'
import { SectionHead } from '@/components/ui/section-head'
import { FoodImage } from '@/components/ui/food-image'
import { Stamp } from '@/components/brand/logo'
import { BRAND, CONTACT, STORES } from '@/data/site'
import { allItems } from '@/data/menu'

export const metadata: Metadata = {
  title: 'Story',
  description:
    "Burger Tree began as a bakery in Calicut in 1998. That is why the buns are ours, why nothing is frozen, and why every order is cooked from scratch after you place it.",
  alternates: { canonical: '/story' },
}

/** Only things the menus and the company's own material actually say. */
const FACTS = [
  { k: 'Founded', v: String(BRAND.foundedYear) },
  { k: 'Where', v: BRAND.foundedPlace },
  { k: 'Parent', v: BRAND.parent },
  { k: 'Kitchens', v: `${STORES.length} across two states` },
  { k: 'On the menu', v: `${allItems.length} items` },
  { k: 'Time per order', v: '20–25 minutes' },
]

export default function StoryPage() {
  return (
    <>
      <PageHead
        kicker={`${BRAND.tagline} · since ${BRAND.foundedYear}`}
        title="A bakery that got into burgers"
        lede="Almost everything strange about the way we work comes from one fact: we started out baking bread, and we never stopped."
      />

      <section className="shell pb-24">
        <Reveal>
          <FoodImage
            slug="p01_000"
            alt="A Burger Tree signature burger"
            ratio="16 / 9"
            sizes="100vw"
            priority
            className="rounded-lg"
          />
        </Reveal>

        <dl className="rule mt-14 grid gap-px overflow-hidden bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {FACTS.map((f, i) => (
            <Reveal key={f.k} delay={i * 60} className="bg-char">
              <div className="p-7">
                <dt className="ticket-sm text-ash">{f.k}</dt>
                <dd className="num mt-3 text-xl text-cream">{f.v}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="border-y border-[var(--line)] bg-olive-deep py-24 lg:py-32">
        <div className="shell max-w-4xl">
          <Reveal>
            <p className="ticket text-marigold">Page two of our menu</p>
          </Reveal>
          <Reveal delay={80}>
            <blockquote className="mt-9">
              {/* Set in the body face, not the display one: this is eleven
                  lines of copy, and eleven lines of Archivo Black in caps is a
                  poster, not a paragraph. */}
              <p className="text-[clamp(1.15rem,2vw,1.6rem)] leading-[1.6] text-cream">
                “{BRAND.story}”
              </p>
              <footer className="ticket-sm mt-8 text-ash">
                Printed exactly like this, on every menu we hand out
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="shell py-24 lg:py-36">
        <SectionHead
          index={1}
          kicker="The three refusals"
          title="What we will not buy in"
          lede="Every burger chain has to decide which parts of the sandwich it is actually going to make. These are the three we kept."
        />

        <div className="mt-20 flex flex-col gap-20">
          {BRAND.pillars.map((p, i) => (
            <Reveal key={p.initial}>
              <article className="rule grid gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
                <div className="flex items-start gap-6">
                  <span
                    className="display-xl leading-[0.8] text-marigold"
                    style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)' }}
                    aria-hidden
                  >
                    {p.initial}
                  </span>
                  <div className="pt-1">
                    <h3 className="display-sm text-cream">{p.title}</h3>
                    <p className="ticket-sm mt-2.5 text-marigold">{p.note}</p>
                  </div>
                </div>
                <div>
                  <p className="body-lg text-cream-dim">{p.body}</p>
                  {i === 1 && (
                    <p className="body-base mt-6 text-ash">
                      {BRAND.prepNote}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-olive py-24 lg:py-32">
        <div aria-hidden className="hatch pointer-events-none absolute inset-0 opacity-40" />
        <div className="shell relative flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="ticket text-marigold">Still true</p>
            <p className="display-md mt-6 text-cream">
              “{BRAND.disclaimer}”
            </p>
            <p className="body-base mt-8 text-cream-dim">
              {BRAND.promise}. Four kitchens, {STORES.length} phone numbers, and
              no shortcuts we are willing to take.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="ticket rounded-full bg-marigold px-7 py-4 text-char transition-colors hover:bg-marigold-hi"
              >
                See the menu
              </Link>
              <a
                href={`tel:${CONTACT.mainPhoneHref}`}
                className="ticket rounded-full border border-[var(--line-strong)] px-7 py-4 text-cream transition-colors hover:border-marigold hover:text-marigold"
              >
                {CONTACT.mainPhone}
              </a>
            </div>
          </div>
          <Stamp size={150} className="shrink-0 opacity-80" />
        </div>
      </section>
    </>
  )
}
