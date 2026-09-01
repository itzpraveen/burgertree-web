import type { Metadata } from 'next'
import { PageHead } from '@/components/ui/page-head'
import { Reveal } from '@/components/ui/reveal'
import { BRAND, CONTACT, STORES } from '@/data/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Call any Burger Tree outlet directly to order, or write to us. Phone numbers for Tharekkad, Olavakkode, R.S. Puram and Race Course.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageHead
        kicker="Talk to a kitchen"
        title="Orders go straight to the outlet"
        lede="There is no ordering system between you and the grill. Call the outlet you want to eat at, tell them what you would like, and it starts being made."
      />

      <div className="shell pb-28">
        {/* The one thing most people are here for. */}
        <Reveal>
          <div className="rule grid gap-px overflow-hidden bg-[var(--line)] pt-0 sm:grid-cols-2 lg:grid-cols-4">
            {STORES.map((s) => (
              <a
                key={s.id}
                href={`tel:${s.phoneHref}`}
                className="group flex flex-col gap-4 bg-char p-8 transition-colors hover:bg-char-2"
              >
                <span className="ticket-sm text-ash">{s.city}</span>
                <span className="display-sm text-cream">{s.name}</span>
                <span className="num mt-auto text-lg text-marigold transition-opacity group-hover:opacity-70">
                  {s.phone}
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <div className="mt-20 grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <section>
              <h2 className="ticket text-marigold">General enquiries</h2>
              <ul className="mt-8 flex flex-col gap-7">
                <li>
                  <p className="ticket-sm text-ash">Main line</p>
                  <a
                    href={`tel:${CONTACT.mainPhoneHref}`}
                    className="display-sm mt-2 block text-cream transition-colors hover:text-marigold"
                  >
                    {CONTACT.mainPhone}
                  </a>
                </li>
                <li>
                  <p className="ticket-sm text-ash">WhatsApp</p>
                  <a
                    href={CONTACT.whatsappHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="display-sm mt-2 block text-cream transition-colors hover:text-marigold"
                  >
                    Message us ↗
                  </a>
                </li>
                <li>
                  <p className="ticket-sm text-ash">Email</p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="body-lg mt-2 block break-all text-cream transition-colors hover:text-marigold"
                  >
                    {CONTACT.email}
                  </a>
                </li>
              </ul>
            </section>
          </Reveal>

          <Reveal delay={100}>
            <section>
              <h2 className="ticket text-marigold">Before you call</h2>
              <ul className="mt-8 flex flex-col gap-6">
                <li className="rule pt-5">
                  <p className="display-sm text-cream">Allow 20–25 minutes</p>
                  <p className="body-base mt-3 text-cream-dim">
                    {BRAND.prepNote} Ring ahead and the kitchen can spend that
                    time before you arrive rather than after.
                  </p>
                </li>
                <li className="rule pt-5">
                  <p className="display-sm text-cream">Prices differ by city</p>
                  <p className="body-base mt-3 text-cream-dim">
                    Palakkad and Coimbatore print separate price columns. The
                    menu on this site shows whichever you pick, excluding GST.
                  </p>
                </li>
                <li className="rule pt-5">
                  <p className="display-sm text-cream">Orders are final</p>
                  <p className="body-base mt-3 text-cream-dim">
                    Once the kitchen has confirmed an order it cannot be changed
                    or cancelled — it is already being cooked.
                  </p>
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </div>
    </>
  )
}
