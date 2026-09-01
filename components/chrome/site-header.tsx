'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { CONTACT } from '@/data/site'
import { onScroll } from '@/lib/scroll-store'
import { clsx } from '@/lib/cx'

const NAV = [
  { href: '/menu', label: 'Menu' },
  { href: '/story', label: 'Story' },
  { href: '/stores', label: 'Stores' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const lastY = useRef(0)

  useEffect(() => {
    const off = onScroll((s) => {
      // Hide on the way down, reveal on the way up — but never near the top,
      // and never while the mobile sheet is open.
      const goingDown = s.y > lastY.current
      lastY.current = s.y
      setHidden(goingDown && s.y > 380)
    })
    return () => {
      off()
    }
  }, [])

  // Navigating closes the sheet. Derived during render rather than done in an
  // effect, so the new page never paints for a frame with the old sheet open.
  const [sheetPath, setSheetPath] = useState(pathname)
  if (sheetPath !== pathname) {
    setSheetPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 border-b border-char/20 bg-marigold text-char',
        'transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]',
        hidden && !open ? '-translate-y-full' : 'translate-y-0',
      )}
      style={{ height: 'var(--nav-h)' }}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        {/* The mark is sized off the bar, not the other way round: it fills
            the height minus a fixed pad, so it can never be squeezed again. */}
        <Link
          href="/"
          aria-label="Burger Tree, home"
          className="flex h-full shrink-0 items-center py-4 transition-opacity hover:opacity-70 lg:py-5 [&_img]:h-full [&_img]:w-auto"
        >
          <Logo width={96} priority dark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + '/')
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'ticket relative px-4 py-3 transition-colors',
                  active ? 'text-char' : 'text-char/75 hover:text-char',
                )}
              >
                {n.label}
                <span
                  className={clsx(
                    'absolute inset-x-4 bottom-2 h-px origin-left bg-char transition-transform duration-500',
                    '[transition-timing-function:var(--ease-out-expo)]',
                    active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${CONTACT.mainPhoneHref}`}
            className="ticket hidden rounded-full bg-char px-5 py-3 text-marigold transition-opacity hover:opacity-85 sm:block"
          >
            Call to order
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="ticket -mr-2 flex items-center gap-2 p-2 text-char md:hidden"
          >
            {open ? 'Close' : 'Menu'}
            <span className="relative block h-3 w-4" aria-hidden>
              <span
                className={clsx(
                  'absolute left-0 h-px w-full bg-char transition-all duration-400',
                  '[transition-timing-function:var(--ease-out-expo)]',
                  open ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={clsx(
                  'absolute left-0 h-px w-full bg-char transition-all duration-400',
                  '[transition-timing-function:var(--ease-out-expo)]',
                  open ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-char/20 bg-marigold md:hidden"
      >
        <nav aria-label="Primary" className="shell flex flex-col py-4">
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className="display-md border-b border-char/20 py-5 text-char last:border-b-0"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {n.label}
            </Link>
          ))}
          <a
            href={`tel:${CONTACT.mainPhoneHref}`}
            className="ticket mt-6 rounded-full bg-char px-5 py-4 text-center text-marigold"
          >
            Call to order · {CONTACT.mainPhone}
          </a>
        </nav>
      </div>
    </header>
  )
}
