import type { Metadata, Viewport } from 'next'
import { Archivo, Archivo_Black, Martian_Mono } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from '@/components/chrome/smooth-scroll'
import { SiteHeader } from '@/components/chrome/site-header'
import { SiteFooter } from '@/components/chrome/site-footer'
import { BRAND, STORES } from '@/data/site'

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

const martian = Martian_Mono({
  variable: '--font-martian',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
})

const DESCRIPTION =
  'Burger Tree is slow on purpose. Nothing is cooked until you order it, on buns baked in our own kitchen — so allow 20–25 minutes, or call ahead and it will be ready when you arrive. Four outlets across Palakkad and Coimbatore.'

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.site),
  title: {
    default: 'Burger Tree — Slow on purpose',
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
    title: 'Burger Tree — Slow on purpose',
    description: DESCRIPTION,
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#12110E',
  colorScheme: 'dark',
}

/** Google rich-result data. Only facts we can actually verify. */
function StructuredData() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BRAND.site}/#org`,
        name: BRAND.legalName,
        url: BRAND.site,
        parentOrganization: { '@type': 'Organization', name: BRAND.parent },
        foundingDate: String(BRAND.foundedYear),
        slogan: BRAND.tagline,
      },
      ...STORES.map((s) => ({
        '@type': 'Restaurant',
        '@id': `${BRAND.site}/stores#${s.id}`,
        name: `${BRAND.name} — ${s.name}`,
        parentOrganization: { '@id': `${BRAND.site}/#org` },
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
      className={`${archivo.variable} ${archivoBlack.variable} ${martian.variable}`}
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
