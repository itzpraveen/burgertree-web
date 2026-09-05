import Link from 'next/link'
import { Reveal } from '@/components/ui/reveal'
import { BRAND } from '@/data/site'
import styles from './home.module.css'

export function Origin() {
  return (
    <section className={styles.origin} aria-labelledby="origin-title">
      <div className={`shell ${styles.originGrid}`}>
        <Reveal>
          <p className={styles.originYear}>{BRAND.foundedYear}<span>A family bakery. Calicut, Kerala.</span></p>
        </Reveal>
        <Reveal delay={120} className={styles.originCopy}>
          <h2 id="origin-title" className="display-lg">Bakery roots.<br />Burger hearts.</h2>
          <p className="body-lg">Our story began at a family café and bakery in Calicut. A love of good food brought us here. We still bake our own buns, make our own patties, and bring that same care to your table.</p>
          <Link href="/story" className="text-link">A little more about us <span aria-hidden>↗</span></Link>
        </Reveal>
      </div>
    </section>
  )
}
