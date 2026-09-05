import Link from 'next/link'
import { Reveal } from '@/components/ui/reveal'
import { STORES } from '@/data/site'
import styles from './home.module.css'

export function Kitchens() {
  return (
    <section id="where" className={`shell ${styles.kitchens}`} aria-labelledby="kitchens-title">
      <Reveal className={styles.kitchensTop}>
        <div>
          <p className="ticket text-marigold">Pull up a chair</p>
          <h2 id="kitchens-title" className="display-md mt-5">Four kitchens. Same love.</h2>
        </div>
        <Link href="/stores" className="text-link text-marigold">All addresses &amp; directions <span aria-hidden>↗</span></Link>
      </Reveal>
      <ul className={styles.kitchenList}>
        {STORES.map((store, i) => (
          <Reveal as="li" key={store.id} delay={i * 70}>
            <Link href={`/stores#${store.id}`} className={styles.kitchenLink}>
              <span className="ticket-sm text-cream-dim">{store.city}</span>
              <h3 className="display-sm">{store.name} <span aria-hidden>↗</span></h3>
              <p className="body-base text-cream-dim">{store.address[1]}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
