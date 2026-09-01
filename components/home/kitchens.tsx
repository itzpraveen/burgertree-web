import Link from 'next/link'
import { Reveal } from '@/components/ui/reveal'
import { SectionHead } from '@/components/ui/section-head'
import { STORES } from '@/data/site'

/**
 * Four addresses, set like a directory rather than a card deck. Every line is
 * an action — the phone number dials, the address opens Maps — because that is
 * the only thing anyone ever wants from this section.
 */
export function Kitchens() {
  return (
    <section id="where" className="shell py-28 lg:py-40">
      <SectionHead
        index={3}
        kicker="Where we are"
        title="Four kitchens, two states"
        lede="Two in Palakkad, two in Coimbatore. Each one bakes its own buns and each one takes just as long."
      />

      <ul className="mt-20 grid gap-px overflow-hidden rounded-lg bg-[var(--line)] md:grid-cols-2">
        {STORES.map((s, i) => (
          <Reveal as="li" key={s.id} delay={(i % 2) * 100} className="bg-char">
            <div className="flex h-full flex-col gap-7 p-9 lg:p-12">
              <div className="flex items-baseline justify-between gap-4">
                <span className="ticket-sm text-marigold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="ticket-sm text-ash">
                  {s.city}, {s.state}
                </span>
              </div>

              <h3 className="display-md text-cream">{s.name}</h3>

              <address className="not-italic">
                {s.address.map((line) => (
                  <p key={line} className="body-base text-cream-dim">
                    {line}
                  </p>
                ))}
                <p className="num mt-1 text-sm text-ash">
                  {s.city} {s.pincode}
                </p>
              </address>

              <div className="rule mt-auto flex flex-wrap items-center gap-x-8 gap-y-3 pt-6">
                <a
                  href={`tel:${s.phoneHref}`}
                  className="num text-lg text-marigold transition-opacity hover:opacity-70"
                >
                  {s.phone}
                </a>
                <a
                  href={s.maps}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ticket-sm text-cream-dim transition-colors hover:text-cream"
                >
                  Directions ↗
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={120}>
        <Link
          href="/stores"
          className="ticket mt-14 inline-flex items-center gap-3 text-cream-dim transition-colors hover:text-marigold"
        >
          Opening hours and contacts
          <span aria-hidden>→</span>
        </Link>
      </Reveal>
    </section>
  )
}
