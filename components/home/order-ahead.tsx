import { Reveal } from '@/components/ui/reveal'
import { CONTACT, STORES, WAIT } from '@/data/site'

/**
 * The most useful block on the site.
 *
 * Burger Tree's only consistent complaint is the wait, and the specific
 * failure is people arriving with no idea it was coming. The kitchen cannot
 * be made faster without becoming the thing it refuses to be — but the wait
 * can be moved off the customer's evening entirely. So this is set on the
 * brand colour, sits directly under the hero, and gives every outlet's line
 * plus whatever delivery listing that outlet has.
 */
export function OrderAhead() {
  return (
    <section id="order" className="relative bg-marigold text-char">
      <div className="shell py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="ticket text-char/60">Do not queue</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-lg mt-6 text-char">Order before you leave</h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="body-lg mt-7 max-w-md text-char/80">
                We need {WAIT.label} whether you are standing at the counter or
                sitting at home. Call the outlet on your way and it will be
                coming off the grill as you walk in.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <ul className="grid gap-px overflow-hidden rounded-lg bg-char/15 sm:grid-cols-2">
              {STORES.map((s) => (
                <li key={s.id} className="bg-marigold p-7">
                  <p className="ticket-sm text-char/55">{s.city}</p>
                  <p className="display-sm mt-3 text-char">{s.name}</p>
                  <a
                    href={`tel:${s.phoneHref}`}
                    className="num mt-4 block text-lg text-char underline decoration-char/30 underline-offset-4 transition-colors hover:decoration-char"
                  >
                    {s.phone}
                  </a>
                  {s.delivery && (
                    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {s.delivery.swiggy && (
                        <a
                          href={s.delivery.swiggy}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="ticket-sm text-char/70 transition-colors hover:text-char"
                        >
                          Swiggy ↗
                        </a>
                      )}
                      {s.delivery.zomato && (
                        <a
                          href={s.delivery.zomato}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="ticket-sm text-char/70 transition-colors hover:text-char"
                        >
                          Zomato ↗
                        </a>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <p className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-char/25 pt-7">
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              className="ticket rounded-full bg-char px-6 py-3.5 text-marigold transition-opacity hover:opacity-85"
            >
              WhatsApp us
            </a>
            <span className="ticket-sm text-char/60">{WAIT.peakNote}</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
