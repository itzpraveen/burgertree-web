import type { Metadata } from 'next'
import { PageHead } from '@/components/ui/page-head'
import { BRAND, CONTACT } from '@/data/site'
import { route } from '@/lib/base-path'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What burgertree.in stores about you: one setting, in your own browser. No accounts, no tracking, no cookies.',
  alternates: { canonical: route('/privacy') },
  robots: { index: true, follow: true },
}

/**
 * Short because the site genuinely is. There is no account system, no
 * analytics script, no ad pixel and no server-side log of anything a visitor
 * does — so the honest policy is four paragraphs, not four pages of boilerplate
 * describing data collection that never happens.
 */
const SECTIONS = [
  {
    h: 'What this site stores',
    p: [
      'One thing: which city you picked for menu prices. It is saved in your browser’s local storage under the key “bt.city” so that the menu shows the right price column next time you visit.',
      'It never leaves your device. It is not sent to us, it is not readable by anyone else, and clearing your browser data removes it.',
    ],
  },
  {
    h: 'What this site does not do',
    p: [
      'No accounts, no sign-ins, no newsletter, no forms. No cookies are set. There is no analytics, advertising or session-recording script on any page. We do not know that you visited.',
      'There is also no online ordering here. Orders are placed by telephone with an outlet directly, and anything you tell them on the phone is handled by that outlet, not by this website.',
    ],
  },
  {
    h: 'Things this site links to',
    p: [
      'Links to Google Maps, WhatsApp and telephone or email applications hand you over to those services, which have their own privacy policies. We have no visibility into what happens once you follow one.',
      'Typefaces are served by Google Fonts through this site’s own build, so your browser does not contact a font server while reading these pages.',
    ],
  },
  {
    h: 'Questions',
    p: [
      `Write to ${CONTACT.email} and it will reach ${BRAND.parent}.`,
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PageHead
        kicker="Privacy"
        title="We do not collect anything"
        lede="This is a menu, four addresses and some photographs of food. It is not a data business."
      />

      <div className="shell pb-28">
        <div className="max-w-2xl">
          {SECTIONS.map((s) => (
            <section key={s.h} className="rule py-10">
              <h2 className="display-sm text-cream">{s.h}</h2>
              {s.p.map((para) => (
                <p key={para} className="body-base mt-5 text-cream-dim">
                  {para}
                </p>
              ))}
            </section>
          ))}
          <p className="ticket-sm pt-8 text-ash">
            {BRAND.legalName} — a unit of {BRAND.parent}
          </p>
        </div>
      </div>
    </>
  )
}
