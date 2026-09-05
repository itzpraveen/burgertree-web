import Link from 'next/link'
import { Logo, Stamp } from '@/components/brand/logo'
import { BRAND, CONTACT, STORES } from '@/data/site'

const NAV = [
  { href: '/menu', label: 'Menu' },
  { href: '/story', label: 'Story' },
  { href: '/stores', label: 'Stores' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--line)] bg-char-2">
      <Link href="/menu" className="footer-invitation shell">
        <span>Come hungry.</span><span aria-hidden>↗</span>
      </Link>
      <div className="shell grid gap-14 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)] lg:py-28">
        <div className="flex flex-col gap-8">
          <Logo width={200} />
          <p className="body-base max-w-sm text-cream-dim">
            {BRAND.promise}. From our kitchens in Palakkad and Coimbatore,
            with love.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${CONTACT.mainPhoneHref}`}
              className="display-sm w-fit text-marigold transition-opacity hover:opacity-70"
            >
              {CONTACT.mainPhone}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="ticket w-fit text-cream-dim transition-colors hover:text-cream"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>

        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="ticket-sm mb-6 text-ash">Pages</h2>
            <ul className="flex flex-col gap-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="display-sm text-cream transition-colors hover:text-marigold"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="ticket-sm mb-6 text-ash">Kitchens</h2>
            <ul className="flex flex-col gap-5">
              {STORES.map((s) => (
                <li key={s.id}>
                  <p className="display-sm text-cream">{s.name}</p>
                  <p className="ticket-sm mt-1.5 text-ash">{s.city}</p>
                  <a
                    href={`tel:${s.phoneHref}`}
                    className="num mt-1.5 block text-sm text-cream-dim transition-colors hover:text-marigold"
                  >
                    {s.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col gap-6 border-t border-[var(--line)] py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="ticket-sm text-ash">
          {BRAND.legalName} — a unit of {BRAND.parent} · © {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="ticket-sm text-ash transition-colors hover:text-cream">
            Privacy
          </Link>
          <Stamp size={54} spin={false} className="opacity-65" />
        </div>
      </div>
    </footer>
  )
}
