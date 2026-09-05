import type { Metadata, Viewport } from 'next'
import { Archivo, Archivo_Black } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from '@/components/chrome/smooth-scroll'
import { SiteHeader } from '@/components/chrome/site-header'
import { SiteFooter } from '@/components/chrome/site-footer'
import { BRAND, SITE_ORIGIN, SITE_URL, STORES } from '@/data/site'
import { route } from '@/lib/base-path'

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
})

const archivoBlack = Archivo_Black({
  variable: '--font-archivo-black',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const DESCRIPTION =
  'Burger Tree — Burgers n’ Beyond. Fresh buns, house-made patties and food prepared to order. Explore the menu and find your kitchen in Palakkad or Coimbatore. Bakery roots in Calicut since 1998.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'Burger Tree — Burgers n’ Beyond',
    template: '%s · Burger Tree',
  },
  description: DESCRIPTION,
  applicationName: BRAND.name,
  keywords: [
    'Burger Tree',
    'burgers Palakkad',
    'burgers Coimbatore',
    'fresh burgers Kerala',
    'made to order burgers',
    'Race Course Coimbatore burgers',
    'R.S. Puram burgers',
  ],
  openGraph: {
    type: 'website',
    siteName: BRAND.name,
    title: 'Burger Tree — Burgers n’ Beyond',
    description: DESCRIPTION,
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: route('/') },
}

export const viewport: Viewport = {
  themeColor: '#FAA227',
  colorScheme: 'dark',
}

/** Google rich-result data. Only facts we can actually verify. */
function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: BRAND.legalName,
        url: SITE_URL,
        parentOrganization: { '@type': 'Organization', name: BRAND.parent },
        foundingDate: String(BRAND.foundedYear),
        slogan: BRAND.tagline,
      },
      ...STORES.map((s) => ({
        '@type': 'Restaurant',
        '@id': `${SITE_URL}/stores#${s.id}`,
        name: `${BRAND.name} — ${s.name}`,
        parentOrganization: { '@id': `${SITE_URL}/#org` },
        servesCuisine: ['Burgers', 'American', 'Fast Casual'],
        telephone: s.phone,
        email: s.email,
        hasMap: s.maps,
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.address.join(', '),
          addressLocality: s.city,
          addressRegion: s.state,
          postalCode: s.pincode,
          addressCountry: 'IN',
        },
      })),
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${archivoBlack.variable}`}
    >
      <body>
        <a href="#main" className="skip-link ticket">
          Skip to content
        </a>
        <SmoothScroll />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <StructuredData />
      </body>
    </html>
  )
}
