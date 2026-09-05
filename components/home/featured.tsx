'use client'

import Link from 'next/link'
import { CitySwitch, useCity } from '@/components/city-provider'
import { FoodImage } from '@/components/ui/food-image'
import { Reveal } from '@/components/ui/reveal'
import { DietMark, HeatMark } from '@/components/menu/marks'
import { FEATURED, byId, priceFor } from '@/data/menu'
import styles from './home.module.css'

export function Featured() {
  const { city } = useCity()
  const dishes = FEATURED.map((id) => byId(id)).filter(
    (d): d is NonNullable<typeof d> => d?.photo !== undefined && priceFor(d, city) !== null,
  )

  return (
    <section id="eat" className={`shell ${styles.featured}`} aria-labelledby="featured-title">
      <div className={styles.sectionTop}>
        <Reveal>
          <p className="ticket text-marigold">Burgers n’ beyond</p>
          <h2 id="featured-title" className={`display-lg ${styles.sectionTitle}`}>Find your<br /><span className="text-marigold">kind of happy.</span></h2>
        </Reveal>
        <Reveal delay={100} className={styles.sectionIntro}>
          <p className="body-lg text-cream-dim">Big burgers. Loaded fries. Something sweet. There’s a little love in everything on our menu.</p>
          <Link href="/menu" className="text-link mt-6 text-marigold">See the whole menu <span aria-hidden>↗</span></Link>
        </Reveal>
      </div>
      <div className={styles.featuredControls}>
        <CitySwitch />
        <p className="ticket-sm text-cream-dim">{city} prices · GST extra</p>
      </div>
      <ul className={styles.dishGrid}>
        {dishes.map((dish, i) => (
          <Reveal as="li" key={dish.id} delay={(i % 3) * 80}>
            <Link href={`/menu#item-${dish.id}`} className={styles.dishLink}>
              <div className={styles.dishVisual}>
                <FoodImage
                  slug={dish.photo!}
                  alt={dish.name}
                  ratio="1 / 1"
                  sizes="(max-width: 700px) 46vw, (max-width: 1000px) 45vw, 30vw"
                  imgClassName={dish.id === 'the-shocker' ? 'object-[50%_68%]' : undefined}
                />
                <span className={styles.dishArrow} aria-hidden>↗</span>
              </div>
              <div className={styles.dishInfo}>
                <h3 className="display-sm">{dish.name}</h3>
                <span className="num text-lg text-marigold">₹{priceFor(dish, city)}</span>
              </div>
              <div className={`ticket-sm ${styles.dishMeta}`}>
                <DietMark diet={dish.diet} />
                <span>{dish.diet === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}</span>
                <HeatMark heat={dish.heat} />
              </div>
              {dish.desc && <p className={styles.dishDesc}>{dish.desc}</p>}
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
