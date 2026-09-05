import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHead } from '@/components/ui/page-head'
import { Reveal } from '@/components/ui/reveal'
import { BRAND, CITIES, CONTACT, storesByCity } from '@/data/site'
import { route } from '@/lib/base-path'

export const metadata: Metadata = {
  title: 'Stores',
  description:
    'Burger Tree outlets: Tharekkad and Olavakkode in Palakkad, R.S. Puram and Race Course in Coimbatore. Addresses, phone numbers and directions.',
  alternates: { canonical: route('/stores') },
}

export default function StoresPage() {
  return (
    <>
      <PageHead
        kicker="Four kitchens"
        title="Where to find us"
        lede="Two in Palakkad, two in Coimbatore. Pull up a chair or call ahead for your favourites. Food is prepared to order; your kitchen can confirm the current wait and pickup time."
      />

      <div className="shell pb-28">
        {CITIES.map((city) => {
          const stores = storesByCity(city)
          return (
            <section key={city} className="rule py-14 lg:py-20">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="display-md text-cream">{city}</h2>
                <p className="ticket-sm text-ash">
                  {stores.length} kitchens · Made fresh to order
                </p>
              </div>

              <ul className="mt-12 grid gap-x-16 gap-y-14 lg:grid-cols-2">
                {stores.map((s, i) => (
                  <Reveal as="li" key={s.id} delay={i * 90}>
                    <article id={s.id} className="[scroll-margin-top:calc(var(--nav-h)+2rem)]">
                      <h3 className="display-sm text-marigold">{s.name}</h3>

                      <address className="mt-5 not-italic">
                        {s.address.map((line) => (
                          <p key={line} className="body-base text-cream">
                            {line}
                          </p>
                        ))}
                        <p className="body-base text-cream">
                          {s.city}, {s.state}{' '}
                          <span className="num text-cream-dim">{s.pincode}</span>
                        </p>
                      </address>

                      <dl className="rule mt-7 grid gap-4 pt-6 sm:grid-cols-2">
                        <div>
                          <dt className="ticket-sm text-ash">Phone</dt>
                          <dd className="mt-2">
                            <a
                              href={`tel:${s.phoneHref}`}
                              className="num text-lg text-cream transition-colors hover:text-marigold"
                            >
                              {s.phone}
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt className="ticket-sm text-ash">Email</dt>
                          <dd className="mt-2">
                            <a
                              href={`mailto:${s.email}`}
                              className="body-base break-all text-cream transition-colors hover:text-marigold"
                            >
                              {s.email}
                            </a>
                          </dd>
                        </div>
                      </dl>

                      <a
                        href={s.maps}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="ticket mt-7 inline-flex items-center gap-3 rounded-full border border-[var(--line-strong)] px-6 py-3.5 text-cream transition-colors hover:border-marigold hover:text-marigold"
                      >
                        Open in Maps
                        <span aria-hidden>↗</span>
                      </a>
                    </article>
                  </Reveal>
                ))}
              </ul>
            </section>
          )
        })}

        <section className="rule flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="ticket-sm text-ash">Anything else</p>
            <p className="display-sm mt-3 break-all text-cream">
              {CONTACT.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="ticket rounded-full border border-[var(--line-strong)] px-6 py-3.5 text-cream transition-colors hover:border-marigold hover:text-marigold"
            >
              Contact
            </Link>
            <Link
              href="/menu"
              className="ticket rounded-full bg-marigold px-6 py-3.5 text-char transition-colors hover:bg-marigold-hi"
            >
              Menu
            </Link>
          </div>
        </section>

        <p className="ticket-sm text-ash">
          {BRAND.legalName} — a unit of {BRAND.parent}
        </p>
      </div>
    </>
  )
}
