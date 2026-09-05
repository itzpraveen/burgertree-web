'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CitySwitch, useCity } from '@/components/city-provider'
import { FoodImage } from '@/components/ui/food-image'
import { DietMark, HeatMark } from '@/components/menu/marks'
import {
  MENU,
  MENU_NOTES,
  availableIn,
  itemCount,
  priceFor,
  priceRange,
  type Diet,
  type MenuItem,
} from '@/data/menu'
import { clsx } from '@/lib/cx'

type Filter = 'all' | Diet

/** Matches on the name and on the ingredient list, because people search for
 *  "paneer" and "mushroom" far more often than they search for "Shroom Stack". */
function matches(item: MenuItem, q: string) {
  if (!q) return true
  const hay = `${item.name} ${item.desc ?? ''}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

export function MenuBrowser() {
  const { city } = useCity()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(MENU[0].id)

  const sections = useMemo(
    () =>
      MENU.map((s) => ({
        ...s,
        groups: s.groups
          .map((g) => ({
            ...g,
            items: g.items.filter(
              (i) =>
                availableIn(i, city) &&
                (filter === 'all' || i.diet === filter) &&
                matches(i, query),
            ),
          }))
          .filter((g) => g.items.length > 0),
      })).filter((s) => s.groups.length > 0),
    [city, filter, query],
  )

  const shown = sections.reduce(
    (n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0),
    0,
  )
  const total = itemCount(city)
  const range = priceRange(city)

  // Highlight whichever section heading last crossed under the nav.
  const observer = useRef<IntersectionObserver | null>(null)
  useEffect(() => {
    observer.current?.disconnect()
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit?.target.id) setActive(hit.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    }
    observer.current = io
    return () => io.disconnect()
  }, [sections])

  return (
    <>
      {/* Controls. Sticky under the header so the price column and the filters
          are reachable from anywhere in a very long document. */}
      <div
        className="sticky z-30 border-b border-[var(--line)] bg-char/92 backdrop-blur-xl"
        style={{ top: 'var(--nav-h)' }}
      >
        <div className="shell flex flex-col gap-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <CitySwitch />

            <div
              className="inline-flex rounded-full border border-[var(--line-strong)] p-1"
              role="radiogroup"
              aria-label="Filter by diet"
            >
              {(
                [
                  ['all', 'Everything'],
                  ['veg', 'Veg'],
                  ['nonveg', 'Non veg'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={filter === k}
                  onClick={() => setFilter(k)}
                  className={clsx(
                    'ticket rounded-full px-5 py-2.5 transition-colors',
                    filter === k ? 'bg-cream text-char' : 'text-cream-dim hover:text-cream',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:ml-auto sm:w-72">
              <label htmlFor="menu-search" className="sr-only">
                Search the menu
              </label>
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search paneer, korean, brownie…"
                className="body-base w-full rounded-full border border-[var(--line-strong)] bg-transparent px-5 py-2.5 text-cream placeholder:text-ash focus:border-marigold focus:outline-none"
              />
            </div>
          </div>

          <nav aria-label="Menu sections" className="rail -mx-1">
            <ul className="flex w-max gap-1 px-1 pb-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={clsx(
                      'ticket-sm block whitespace-nowrap rounded-full px-4 py-2.5 transition-colors',
                      active === s.id
                        ? 'bg-olive-lift text-marigold'
                        : 'text-ash hover:text-cream',
                    )}
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="shell">
        <p className="ticket-sm py-6 text-ash" role="status">
          {query || filter !== 'all'
            ? `${shown} of ${total} items`
            : `${total} items · ₹${range.min}–₹${range.max} · ${city} prices, excluding GST`}
        </p>

        {sections.length === 0 && (
          <p className="body-lg py-20 text-cream-dim">
            Nothing on the {city} menu matches that. Try “paneer”, “beef”,
            “korean” or clear the search.
          </p>
        )}

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="border-t border-[var(--line)] py-16 [scroll-margin-top:calc(var(--nav-h)+9rem)] lg:py-24"
          >
            <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
              <div className="lg:sticky lg:self-start lg:[top:calc(var(--nav-h)+9.5rem)]">
                <p className="ticket-sm text-marigold">{section.kicker}</p>
                <h2 className="display-md mt-4 text-cream">{section.name}</h2>
                <FoodImage
                  slug={section.photo}
                  alt=""
                  ratio="4 / 3"
                  sizes="(max-width: 1024px) 92vw, 20rem"
                  className="mt-7 rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-12">
                {section.groups.map((group) => (
                  <div key={group.id}>
                    <div className="rule pt-5">
                      <h3 className="ticket text-cream">{group.name}</h3>
                      {group.note && (
                        <p className="body-base mt-3 max-w-2xl text-ash">{group.note}</p>
                      )}
                    </div>

                    <ul className="mt-7 grid gap-x-12 gap-y-7 xl:grid-cols-2">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <article id={`item-${item.id}`} className="menu-item">
                            <div className="flex items-baseline gap-3">
                              <DietMark diet={item.diet} className="translate-y-0.5" />
                              <h4 className="display-sm text-cream">{item.name}</h4>
                              <HeatMark heat={item.heat} className="translate-y-[-1px]" />
                              {/* The leader is the printed menu's own device. */}
                              <span
                                aria-hidden
                                className="mx-1 h-px min-w-4 flex-1 self-end border-b border-dotted border-[var(--line-strong)] pb-1"
                              />
                              <span className="num shrink-0 text-marigold">
                                ₹{priceFor(item, city)}
                              </span>
                            </div>
                            {item.desc && (
                              <p className="body-base mt-2 max-w-prose pl-[1.625rem] text-cream-dim">
                                {item.desc}
                              </p>
                            )}
                          </article>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <aside className="rule mt-8 py-16">
          <h2 className="ticket text-marigold">Please note</h2>
          <ul className="mt-7 grid max-w-4xl gap-3 sm:grid-cols-2">
            {MENU_NOTES.map((n) => (
              <li key={n} className="body-base text-ash">
                {n}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  )
}
