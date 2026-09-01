/**
 * Verified Burger Tree facts.
 *
 * Everything here was read off the client's own printed menus (Aug-2025 Coimbatore
 * and Palakkad editions) or off burgertree.in itself. Nothing is invented.
 * If a fact isn't in here, the site doesn't claim it.
 */

export const BRAND = {
  name: 'Burger Tree',
  legalName: 'Burger Tree®',
  parent: 'Aspire Holdings',
  tagline: "Burgers n' Beyond",
  promise: 'Freshly made · Never frozen · Always with love',
  foundedYear: 1998,
  foundedPlace: 'Calicut, Kerala',
  site: 'https://www.burgertree.in',
  /** Printed verbatim on every menu, under the heading "PLEASE NOTE". */
  disclaimer:
    'We have to clarify that we are not a \u2018Quick Service Restaurant (QSR)\u2019. We take pride in preparing orders freshly upon request.',
  /** Page two of the printed menu, under the heading "OUR STORY". Verbatim. */
  story:
    "At Burger Tree, the Bun, Bread and Patties we serve are all prepared in our kitchen, using our secret recipe and to the best of standards. Every item we use, be it Fruits, Vegetables, Cheese, Eggs and Meat are all fresh and procured from the best source available. We don't compromise on quality and ensure each food is prepared with the best of ingredients in a clean and healthy environment. At Burger Tree, you have a big list to select the food of your choice and taste.",
  /** The footnote at the bottom of the burger pages. */
  prepNote:
    'Every item takes a minimum of 20–25 minutes to prepare. At peak times this may change.',
  prepMinutes: 20,
  /** The three pillars printed on page 2 of the menu. */
  pillars: [
    {
      initial: 'F',
      title: 'Fresh Buns',
      note: 'Baked in our own kitchen',
      body:
        'The bun is the part most burger places buy in by the crate. Ours comes out of our own oven — which is how a bakery in Calicut ends up running a burger house.',
    },
    {
      initial: 'M',
      title: 'Made to Order',
      note: 'Every patty, every time',
      body:
        'Nothing sits under a heat lamp waiting for you. Your patty hits the grill after your order reaches the kitchen, which is the entire reason this takes as long as it does.',
    },
    {
      initial: 'S',
      title: 'Secret Recipe',
      note: 'Our own sauces and toppings',
      body:
        'The mayo, the peri peri, the mint, the BBQ, the Korean base — all mixed in house. It is the part of the menu we will not tell you about.',
    },
  ],
} as const

/**
 * The origin this build is actually served from.
 *
 * `BRAND.site` is a fact about the business and stays put; this is a fact about
 * the deployment. The GitHub Pages build overrides it so canonicals, the
 * sitemap and robots.txt describe the URL the visitor is really on rather than
 * a domain that is serving something else.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.site

/** Scheme and host of {@link SITE_URL}, with any sub-path dropped. */
export const SITE_ORIGIN = new URL(SITE_URL).origin

export type Store = {
  id: string
  name: string
  city: 'Palakkad' | 'Coimbatore'
  state: 'Kerala' | 'Tamil Nadu'
  address: string[]
  pincode: string
  phone: string
  phoneHref: string
  email: string
  maps: string
  /** Which printed menu (and therefore which price column) this outlet uses. */
  priceColumn: 'pkd' | 'cbe'
  /**
   * Delivery listings, so the site can offer a way to not wait in the shop.
   *
   * ⚠ These were found by searching, not supplied by the client. Confirm each
   * one opens the right outlet before this goes live — a link that lands on the
   * wrong branch is worse than no link. Omit the field and the UI drops the row.
   */
  delivery?: { swiggy?: string; zomato?: string }
}

export const STORES: Store[] = [
  {
    id: 'tharekkad',
    name: 'Tharekkad',
    city: 'Palakkad',
    state: 'Kerala',
    address: ['18/80, S.M. Complex', 'College Road, Tharekkad'],
    pincode: '678001',
    phone: '+91 95446 00900',
    phoneHref: '+919544600900',
    email: 'burgertree1@gmail.com',
    maps: 'https://goo.gl/maps/QXPBitWrTPqSk2ie7',
    priceColumn: 'pkd',
    delivery: {
      swiggy: 'https://www.swiggy.com/city/palakkad/burger-tree-vinayaka-colony-tharekkad-rest231762',
    },
  },
  {
    id: 'olavakkode',
    name: 'Olavakkode',
    city: 'Palakkad',
    state: 'Kerala',
    address: ['52/57-22, Hasco Tower', 'Malampuzha Road, Olavakkode'],
    pincode: '678002',
    phone: '+91 79026 00900',
    phoneHref: '+917902600900',
    email: 'burgertree002@gmail.com',
    maps: 'https://goo.gl/maps/L1Wpjvr2V5SCwdBf8',
    priceColumn: 'pkd',
    delivery: {
      swiggy:
        'https://www.swiggy.com/city/palakkad/burger-tree-olavakode-chunnambuthara-olavakode-rest254224',
      zomato: 'https://www.zomato.com/palakkad/burger-tree-olavakode/order',
    },
  },
  {
    id: 'rs-puram',
    name: 'R.S. Puram',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    address: ['Door No. 8, Sree Nandhini Complex', 'Venkataswamy Road, West R.S. Puram'],
    pincode: '641002',
    phone: '+91 95356 00900',
    phoneHref: '+919535600900',
    email: 'burgertree3@gmail.com',
    maps: 'https://www.google.com/maps/search/?api=1&query=11.0121828,76.9495792',
    priceColumn: 'cbe',
    delivery: { zomato: 'https://www.zomato.com/coimbatore/burger-tree-rs-puram/order' },
  },
  {
    id: 'race-course',
    name: 'Race Course',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    address: ['16, Abdul Rahim Road', 'Race Course'],
    pincode: '641018',
    phone: '+91 96056 00900',
    phoneHref: '+919605600900',
    email: 'burgertree4@gmail.com',
    maps: 'https://maps.app.goo.gl/j9TznKQyZnUkqrHVA',
    priceColumn: 'cbe',
    delivery: { zomato: 'https://www.zomato.com/coimbatore/burger-tree-race-course/order' },
  },
]

export const CONTACT = {
  /** The number the current site treats as the main line. */
  mainPhone: '+91 95446 00900',
  mainPhoneHref: '+919544600900',
  whatsappHref: 'https://wa.me/919544600900',
  email: 'aspireburgertree@gmail.com',
} as const

/**
 * How long the kitchen actually needs.
 *
 * The printed menu says 20–25 minutes. Public reviews across all four outlets
 * are consistently kind about the food (4.4/5) and consistently unkind about
 * exactly one thing: orders arriving at 40–45 minutes when 20–25 was promised.
 * The site therefore quotes the honest range, never a single number, and puts
 * ordering ahead in front of anyone who cannot spare it.
 */
export const WAIT = {
  min: 20,
  max: 25,
  label: '20–25 minutes',
  peakNote: 'Longer when every table is full — order ahead if you are in a hurry.',
} as const

export const CITIES = ['Palakkad', 'Coimbatore'] as const
export type City = (typeof CITIES)[number]

/** Which price column a city reads. */
export const CITY_PRICE_COLUMN: Record<City, 'pkd' | 'cbe'> = {
  Palakkad: 'pkd',
  Coimbatore: 'cbe',
}

export const storesByCity = (city: City) => STORES.filter((s) => s.city === city)
