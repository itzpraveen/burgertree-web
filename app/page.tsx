import { Hero } from '@/components/home/hero'
import { PromiseMarquee } from '@/components/home/marquee'
import { OrderAhead } from '@/components/home/order-ahead'
import { TwentyMinutes } from '@/components/home/twenty-minutes'
import { Pillars } from '@/components/home/pillars'
import { Featured } from '@/components/home/featured'
import { Origin } from '@/components/home/origin'
import { Kitchens } from '@/components/home/kitchens'

/**
 * The page argues one thing, in order: we are slow on purpose (hero), so do not
 * queue for it (order ahead), this is deliberate and here is the kitchen saying
 * so (the disclaimer), here is what we do with the time (the three pillars),
 * here is what you get (the food), here is why we work this way (1998), here is
 * where to find us.
 *
 * Order-ahead sits second because the site's job is not only to sell the wait —
 * it is to stop people meeting it unprepared.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <PromiseMarquee />
      <OrderAhead />
      <TwentyMinutes />
      <Pillars />
      <Featured />
      <Origin />
      <Kitchens />
    </>
  )
}
