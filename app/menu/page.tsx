import type { Metadata } from 'next'
import { MenuBrowser } from '@/components/menu/menu-browser'
import { PageHead } from '@/components/ui/page-head'
import { MENU, itemCount } from '@/data/menu'
import { MenuLegend } from '@/components/menu/marks'
import { BRAND } from '@/data/site'

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'The full Burger Tree menu — chicken, beef, paneer and mushroom burgers, subwiches, burritos, bowls, club sandwiches, loaded fries, milkshakes, mojitos, faloodas and coffee. Palakkad and Coimbatore prices.',
  alternates: { canonical: '/menu' },
}

/**
 * Google reads restaurant menus. Giving it the real structure — sections,
 * items, descriptions, prices — is the single highest-value piece of markup
 * on the site, so it gets the Coimbatore column (the newer of the two) and
 * an explicit currency.
 */
function MenuSchema() {
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${BRAND.name} menu`,
    inLanguage: 'en-IN',
    hasMenuSection: MENU.map((s) => ({
      '@type': 'MenuSection',
      name: s.name,
      hasMenuItem: s.groups.flatMap((g) =>
        g.items
          .filter((i) => i.cbe !== null)
          .map((i) => ({
            '@type': 'MenuItem',
            name: i.name,
            ...(i.desc ? { description: i.desc } : {}),
            suitableForDiet:
              i.diet === 'veg'
                ? 'https://schema.org/VegetarianDiet'
                : undefined,
            offers: {
              '@type': 'Offer',
              price: i.cbe,
              priceCurrency: 'INR',
            },
          })),
      ),
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

export default function MenuPage() {
  return (
    <>
      <PageHead
        kicker="Two cities, two price columns"
        title="The menu"
        lede={`Palakkad prints ${itemCount('Palakkad')} items and Coimbatore ${itemCount(
          'Coimbatore',
        )}, at different prices. Pick your city and everything below switches to that outlet's own printed column. All prices exclude GST.`}
      >
        <MenuLegend className="mt-10" />
      </PageHead>
      <MenuBrowser />
      <MenuSchema />
    </>
  )
}
