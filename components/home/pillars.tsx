'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { FoodImage } from '@/components/ui/food-image'
import { Reveal } from '@/components/ui/reveal'
import { BRAND } from '@/data/site'
import { usePrefersReducedMotion } from '@/lib/use-media'
import styles from './home.module.css'

export function Pillars() {
  const ref = useRef<HTMLElement>(null)
  const still = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1.15])

  return (
    <section ref={ref} id="how" className={styles.craft} aria-labelledby="craft-title">
      <div className={`shell ${styles.craftGrid}`}>
        <figure className={styles.craftPhoto}>
          <div className={styles.craftPhotoInner}>
            <motion.div style={{ scale: still ? 1 : scale }}>
              <FoodImage slug="p05_022" alt="Flame Grill Buff, with a freshly baked bun and Burger Tree’s house toppings" ratio="4 / 5" sizes="(max-width: 700px) 90vw, 44vw" />
            </motion.div>
          </div>
          <figcaption className="ticket-sm"><span>Made here. From the bun up.</span><span>That’s Burger Tree.</span></figcaption>
        </figure>
        <div>
          <Reveal>
            <p className="ticket">A little more care in every layer</p>
            <h2 id="craft-title" className={`display-lg ${styles.craftHeading}`}>Good things<br />start here.</h2>
          </Reveal>
          <ol className={styles.craftRows}>
            {BRAND.pillars.map((pillar, i) => (
              <Reveal as="li" key={pillar.initial} delay={i * 70}>
                <div className={styles.craftRow}>
                  <span className={styles.craftLetter} aria-hidden>{pillar.initial}</span>
                  <div>
                    <h3 className="display-sm">{pillar.title}</h3>
                    <p>{pillar.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
