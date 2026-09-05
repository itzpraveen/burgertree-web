'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Logo, Stamp } from '@/components/brand/logo'
import { FoodImage } from '@/components/ui/food-image'
import { BRAND, WAIT } from '@/data/site'
import { usePrefersReducedMotion } from '@/lib/use-media'
import styles from './home.module.css'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const still = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const stampRotate = useTransform(scrollYProgress, [0, 1], [-12, 40])

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <p className={`ticket ${styles.entrance}`} style={{ '--enter-delay': '60ms' } as React.CSSProperties}>
          From Calicut, with love · Est. {BRAND.foundedYear}
        </p>
        <h1 id="hero-title" className={`${styles.heroLogo} ${styles.entrance}`}>
          <Logo dark width={430} priority />
        </h1>
        <div className={`${styles.entrance} ${styles.heroMessage}`} style={{ '--enter-delay': '180ms' } as React.CSSProperties}>
          <p className={styles.heroHeadline}>Big on flavour.<br />Made with love.</p>
          <p className={styles.heroDescription}>
            Our buns. Our patties. Our recipes.<br />Your new favourite burger.
          </p>
        </div>
        <div className={`${styles.heroActions} ${styles.entrance}`} style={{ '--enter-delay': '280ms' } as React.CSSProperties}>
          <Link href="/menu" className="brand-button brand-button-dark">
            Explore the menu <span aria-hidden>↗</span>
          </Link>
          <a href="#order" className="text-link">Order ahead <span aria-hidden>↗</span></a>
        </div>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.heroPhoto}>
          <motion.div className={styles.heroPhotoMotion} style={{ y: still ? 0 : photoY }}>
            <FoodImage
            slug="p01_000"
            alt="The Shocker: Burger Tree’s signature chicken burger with cheese, omelette and house toppings"
            priority
            sizes="(max-width: 700px) 100vw, 60vw"
            className={styles.heroFood}
            />
          </motion.div>
        </div>
        <motion.div className={styles.heroStamp} style={{ rotate: still ? -12 : stampRotate }}>
          <Stamp size={132} spin={false} />
        </motion.div>
        <div className={styles.heroCaption}>
          <span className="ticket-sm">Meet The Shocker</span>
          <Link href="/menu#signature" className="text-link">One of our signatures <span aria-hidden>↗</span></Link>
        </div>
      </div>
      <div className={styles.heroBottom}>
        <p className="ticket-sm">Made to order · {WAIT.min}–{WAIT.max} mins</p>
        <a href="#eat" className="ticket-sm">Good things below <span className={styles.scrollArrow} aria-hidden>↓</span></a>
      </div>
    </section>
  )
}
