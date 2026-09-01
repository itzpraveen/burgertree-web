import Link from 'next/link'
import { CONTACT } from '@/data/site'
import { itemCount } from '@/data/menu'

export default function NotFound() {
  return (
    <div className="shell flex min-h-svh flex-col justify-center py-40">
      <p className="ticket text-marigold">Not on the menu</p>
      <h1 className="display-xl mt-8 text-cream">404</h1>
      <p className="body-lg mt-8 max-w-lg text-cream-dim">
        That page does not exist. The menu, on the other hand, has{' '}
        {itemCount('Coimbatore')} things on it.
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
          Call to order
        </a>
      </div>
    </div>
  )
}
