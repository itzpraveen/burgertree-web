'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { BRAND, WAIT } from '@/data/site'
import { asset } from '@/lib/base-path'
import { usePrefersReducedMotion } from '@/lib/use-media'
import styles from './hero.module.css'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const still = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 55])
  const photoRotate = useTransform(scrollYProgress, [0, 1], [-3, 2])

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={`ticket ${styles.eyebrow} ${styles.entrance}`}>
          Burgers n’ beyond · Est. {BRAND.foundedYear}
        </p>
        <h1 id="hero-title" className={styles.title} aria-label={BRAND.name}>
          <span className={styles.titleLine}><span>Burger</span></span>
          <span className={styles.titleLine}><span>Tree.</span></span>
        </h1>
        <div className={`${styles.message} ${styles.entrance}`}>
          <p className={styles.headline}>Fresh buns. Big flavour.</p>
          <p className={styles.description}>From our kitchen to your first bite.</p>
        </div>
        <div className={`${styles.actions} ${styles.entrance}`}>
          <Link href="/menu" className="brand-button brand-button-dark">
            Explore the menu <span aria-hidden>↗</span>
          </Link>
          <a href="#order" className={`text-link ${styles.orderLink}`}>Order ahead <span aria-hidden>↗</span></a>
        </div>
      </div>

      <figure className={styles.visual}>
        <div className={styles.pictureEntrance}>
          <motion.div className={styles.pictureMotion} style={{ y: still ? 0 : photoY, rotate: still ? -3 : photoRotate }}>
            {/* The image is a background edit of our Smokey Chick menu photo.
                Every derivative is served locally, including on GitHub Pages. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/hero/smokey-chick-v2-1024.webp')}
              srcSet={[640, 1024, 1536].map(width => `${asset(`/hero/smokey-chick-v2-${width}.webp`)} ${width}w`).join(', ')}
              sizes="(max-width: 700px) 110vw, 70vw"
              alt="Smokey Chick burger with BBQ grilled chicken, cheese and fresh vegetables in a soft bun"
              width={1536}
              height={1024}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={styles.food}
            />
          </motion.div>
        </div>
        <figcaption className={styles.caption}>
          <div>
            <p className="ticket-sm">Fresh off our grill</p>
            <Link href="/menu#item-smokey-chick" className={styles.dishLink}>Meet Smokey Chick <span aria-hidden>↗</span></Link>
          </div>
          <p className={styles.dishNote}>BBQ chicken. Melted cheese.<br />Our own freshly baked bun.</p>
        </figcaption>
      </figure>

      <div className={styles.bottom}>
        <p>Palakkad &amp; Coimbatore</p>
        <p>Made to order · Allow {WAIT.min}–{WAIT.max} minutes</p>
        <a href="#eat">Find your favourite <span aria-hidden>↓</span></a>
      </div>
    </section>
  )
}
