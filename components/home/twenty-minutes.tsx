import { Reveal } from '@/components/ui/reveal'
import { WAIT } from '@/data/site'
import styles from './home.module.css'

export function TwentyMinutes() {
  return (
    <section className={styles.wait} aria-labelledby="wait-title">
      <div className={`shell ${styles.waitInner}`}>
        <Reveal>
          <p className={styles.waitNumber}>{WAIT.min}–{WAIT.max}</p>
          <p className={`ticket ${styles.waitUnit}`}>Minutes. Made fresh for you.</p>
        </Reveal>
        <Reveal delay={120} className={styles.waitCopy}>
          <h2 id="wait-title" className="display-md">A little time.<br />A lot of love.</h2>
          <p className="body-base text-cream-dim">We prepare your food after you order. Allow {WAIT.label}, and a little longer at busy times. Heading our way? Call your kitchen ahead to check when it’ll be ready.</p>
          <a href="#order" className="text-link">Find your kitchen &amp; order <span aria-hidden>↗</span></a>
        </Reveal>
      </div>
    </section>
  )
}
