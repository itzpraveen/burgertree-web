import { Hero } from '@/components/home/hero'
import { PromiseMarquee } from '@/components/home/marquee'
import { OrderAhead } from '@/components/home/order-ahead'
import { TwentyMinutes } from '@/components/home/twenty-minutes'
import { Pillars } from '@/components/home/pillars'
import { Featured } from '@/components/home/featured'
import { Origin } from '@/components/home/origin'
import { Kitchens } from '@/components/home/kitchens'

/** Brand, food, craft, roots, and a direct route to the visitor's kitchen. */
export default function Home() {
  return (
    <>
      <Hero />
      <PromiseMarquee />
      <Featured />
      <Pillars />
      <TwentyMinutes />
      <Origin />
      <OrderAhead />
      <Kitchens />
    </>
  )
}
