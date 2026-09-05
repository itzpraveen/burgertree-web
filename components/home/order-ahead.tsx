'use client'

import { Reveal } from '@/components/ui/reveal'
import { useCity } from '@/components/city-provider'
import { CITIES, storesByCity, WAIT } from '@/data/site'
import styles from './home.module.css'

export function OrderAhead() {
  const { city, setCity } = useCity()
  return (
    <section id="order" className={styles.order} aria-labelledby="order-title">
      <div className={`shell ${styles.orderLayout}`}>
        <Reveal>
          <p className="ticket">Your next good meal</p>
          <h2 id="order-title" className={`display-lg ${styles.orderTitle}`}>You bring<br />the appetite.</h2>
          <p className={`body-lg ${styles.orderCopy}`}>We’ll take care of the rest. Choose your city, call your kitchen, and let’s get your favourites started.</p>
          <p className={styles.orderNote}>Fresh to order · Allow {WAIT.label}.<br />Your kitchen can confirm the current wait and pickup time.</p>
        </Reveal>
        <div>
          <div className={styles.orderCitySwitch} role="group" aria-label="Choose a city to order">
            {CITIES.map((c) => <button type="button" key={c} aria-pressed={city === c} onClick={() => setCity(c)}>{c}</button>)}
          </div>
          <div aria-live="polite" aria-atomic="true">
            <ul key={city} className={`${styles.orderList} ${styles.orderKitchens}`} aria-label={`${city} kitchens`}>
              {storesByCity(city).map((store) => (
                <li key={store.id} className={styles.orderRow}>
                  <div className={styles.orderRowTop}>
                    <h3 className="display-sm">{store.name}</h3>
                    <span className="ticket-sm">{store.city}</span>
                  </div>
                  <a href={`tel:${store.phoneHref}`} className={`${styles.orderPhone} text-link`} aria-label={`Call ${store.name}: ${store.phone}`}>
                    {store.phone} <span aria-hidden>↗</span>
                  </a>
                  <div className={styles.orderLinks}>
                    <a className="text-link" href={store.maps} target="_blank" rel="noreferrer noopener">Directions <span aria-hidden>↗</span></a>
                    {store.delivery?.swiggy && <a className="text-link" href={store.delivery.swiggy} target="_blank" rel="noreferrer noopener">Swiggy <span aria-hidden>↗</span></a>}
                    {store.delivery?.zomato && <a className="text-link" href={store.delivery.zomato} target="_blank" rel="noreferrer noopener">Zomato <span aria-hidden>↗</span></a>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
