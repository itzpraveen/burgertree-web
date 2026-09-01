import { Reveal } from '@/components/ui/reveal'
import { SectionHead } from '@/components/ui/section-head'
import { BRAND } from '@/data/site'

/**
 * F · M · S — the three letters the printed menu sets in a row on page two.
 * They are kept as letters here rather than turned into icons, because on the
 * menu they read like a maker's mark and that is worth preserving.
 */
export function Pillars() {
  return (
    <section id="how" className="shell py-28 lg:py-40">
      <SectionHead
        index={1}
        kicker="How it is made"
        title="Three things we will not outsource"
        lede="Most burger places buy the bun, buy the sauce and reheat the patty. These are the three parts Burger Tree makes itself, and between them they account for the whole wait."
      />

      <ol className="mt-20 grid gap-px overflow-hidden rounded-lg bg-[var(--line)] md:grid-cols-3">
        {BRAND.pillars.map((p, i) => (
          <Reveal as="li" key={p.initial} delay={i * 110} className="bg-char">
            <div className="flex h-full flex-col gap-6 p-9 lg:p-11">
              <span
                className="display-xl leading-none text-marigold"
                style={{ fontSize: 'clamp(4rem, 7vw, 7rem)' }}
                aria-hidden
              >
                {p.initial}
              </span>
              <div className="rule pt-6">
                <h3 className="display-sm text-cream">{p.title}</h3>
                <p className="ticket-sm mt-2.5 text-marigold">{p.note}</p>
              </div>
              <p className="body-base text-cream-dim">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
