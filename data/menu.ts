/**
 * The Burger Tree menu, transcribed from the client's two printed menus:
 *
 *   · Burger Tree menu design_palakkad.pdf   → the `pkd` price column
 *   · Burger Tree menu design_aug15v2.pdf    → the `cbe` price column (Race Course & RS Puram)
 *
 * Names, descriptions and prices are verbatim. Nothing is invented. Where an
 * item is printed on only one of the two menus its other price is `null`, and
 * the UI hides it for that city rather than guessing a number.
 *
 * All prices exclude GST — the printed menus say so, and so does the footer.
 */

import type { City } from './site'

export type Diet = 'veg' | 'nonveg'
/** 0 = no heat, 1 = mild, 2 = spicy. Derived — see `heatOf` below. */
export type Heat = 0 | 1 | 2

export type MenuItem = {
  id: string
  name: string
  desc?: string
  /** Rupees, ex-GST. `null` means "not printed on that city's menu". */
  pkd: number | null
  cbe: number | null
  diet: Diet
  heat: Heat
  /** Slug into data/images.json, when we have a photograph of this family. */
  photo?: string
}

export type MenuGroup = {
  id: string
  name: string
  /** The italic explainer the printed menu runs under some group headings. */
  note?: string
  items: MenuItem[]
}

export type MenuSection = {
  id: string
  /** Nav label. */
  name: string
  /** The kitchen-ticket eyebrow. */
  kicker: string
  /** Lead photograph for the section. */
  photo: string
  groups: MenuGroup[]
}

/* ------------------------------------------------------------------ *
 * Heat
 *
 * The printed menu marks heat with two small icons in a key on page 3
 * (MILD HEAT / SPICY). Those icons are artwork, not text, so they don't
 * survive extraction. Rather than invent a rating per item we derive it
 * from the wording the menu itself uses in each description — which is
 * what the icons track anyway.
 * ------------------------------------------------------------------ */

const SPICY = /spicy|schezwan|nashville|dragon|chilli flakes|hot chilli/i
const MILD = /peri peri|chilli|cajun|jamaican|korean|green chilli|jalapeno/i

function heatOf(name: string, desc = ''): Heat {
  const s = `${name} ${desc}`
  if (SPICY.test(s)) return 2
  if (MILD.test(s)) return 1
  return 0
}

/** Terse item constructor — keeps the table below readable. */
function item(
  name: string,
  pkd: number | null,
  cbe: number | null,
  desc: string | undefined,
  diet: Diet,
  photo?: string,
): MenuItem {
  return {
    id: name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    name,
    desc,
    pkd,
    cbe,
    diet,
    heat: heatOf(name, desc),
    photo,
  }
}

const nv = (n: string, p: number | null, c: number | null, d?: string, photo?: string) =>
  item(n, p, c, d, 'nonveg', photo)
const vg = (n: string, p: number | null, c: number | null, d?: string, photo?: string) =>
  item(n, p, c, d, 'veg', photo)

/* ------------------------------------------------------------------ *
 * The menu
 * ------------------------------------------------------------------ */

export const MENU: MenuSection[] = [
  {
    id: 'chicken',
    name: 'Chicken burgers',
    kicker: 'Non veg classic',
    photo: 'p04_018',
    groups: [
      {
        id: 'chicken-classic',
        name: 'Non veg classic burgers',
        items: [
          nv('Smash Chick', 229, 242, 'Smashed Chicken Patty, Fresh Veggies and In house Toppings', 'p04_017'),
          nv('Smokey Chick', 249, 267, 'BBQ Sauce Smeared Supreme of Grilled Chicken, Cheese slice, Fresh Veggies and Special BBQ Toppings', 'p04_018'),
          nv('Zinger Blaze', 245, 251, 'Crispy fried Supreme of Chicken, Fresh Veggies and In house Toppings.', 'p04_019'),
          nv('Flame Kebab', 254, 274, 'Green Chilli Smeared Supreme of Grilled Chicken, Cheese Slice, Fresh Veggies and In house Mint Mayo Toppings.'),
          nv('Nashville Zing', 265, 279, 'Spicy and Crispy Fried Supreme of Chicken, Fresh Veggies and In house Toppings'),
          nv('Korean Zing', 279, 289, 'Crispy Fried Supreme of Chicken, Fresh Veggies and Korean base Mayo Toppings.'),
          nv('Fire Bird', 249, 269, 'Chilli Flakes Smeared Supreme of Grilled Chicken, Cheese Slice, Fresh Veggies and In house Peri Peri Toppings.'),
          nv('Sweet Fire Grill', 260, 286, 'Supreme of Grilled Chicken, Cheese Slice, Fresh Veggies and Honey Base Mayo Toppings.'),
          nv('Sweet Fire Smash', 244, 268, 'Smashed Chicken Patty, Fresh Veggies, Honey Base Mayo Toppings'),
        ],
      },
    ],
  },
  {
    id: 'beef',
    name: 'Beef burgers',
    kicker: 'Non veg beef',
    photo: 'p05_021',
    groups: [
      {
        id: 'beef-burgers',
        name: 'Non veg beef burgers',
        items: [
          nv('Smash Buff', 239, 255, 'Smashed Beef Patty, Fresh Veggies, In house Special Toppings', 'p05_020'),
          nv('Texan Buff', 291, 315, 'Smashed Beef Patty, Fried Onion Rings, Fresh Veggies, Cheese Slice and In house Special Toppings.', 'p05_021'),
          nv('Flame Grill Buff', 339, 349, 'Grilled Supreme of Beef, Cheese Slice, Fresh Veggies and In house Special Toppings.', 'p05_022'),
          nv('BBQ Beast', 349, 359, 'Grilled Supreme of Beef, Cheese Slice, Fresh Veggies, In house BBQ and Special Toppings.'),
          nv('Red Flame Buff', 349, 359, 'Chilli Flakes Smeared Grilled Beef, Cheese Slice, Fresh Veggies, In house Peri Peri Mayo Toppings.'),
        ],
      },
    ],
  },
  {
    id: 'signature',
    name: 'Signature',
    kicker: 'The big ones',
    photo: 'p01_000',
    groups: [
      {
        id: 'signature-burgers',
        name: 'Signature burgers',
        items: [
          nv('Thousand Island', 329, 359, 'Supreme of Grilled Chicken, Spicy and Crispy Fried Chicken, Cheese Slice, Fresh Veggies, Thousand island and In house Signature Toppings.'),
          nv('The Shocker', 344, 379, 'Spicy and Crispy Fried Supreme of Chicken, Chicken Patty, Omelette, Cheese Slice, Fresh Veggies and In house Signature Toppings.', 'p01_000'),
          nv('B & B Special', 359, 380, 'BBQ Sauce Smeared Grilled Supreme of Chicken, Beef Patty, Omelette, Cheese Slice, Fresh Veggies and Bt Signature Toppings.'),
          nv('Dynamite', 346, 359, 'Crispy Fried Supreme of Chicken, Beef Patty, Cheese Slice, Fresh Veggies and Bt Signature Toppings.'),
          nv('Lava Chick', 299, 315, 'Cheesy and Juicy Chicken Patty, Fresh Veggies, In house Signature Toppings.'),
          nv('Lava Buff', 315, 325, 'Cheesy and Juicy Beef Patty, Fresh Veggies and In house Signature Toppings.'),
          nv('Juicy Lucy Buff', 319, 345, 'Beef Patty, Cheese Slice, Sauteed Mushroom, Fresh Veggies and In house Signature Toppings.'),
          nv('Oklahoma Buff', 369, 389, 'Smashed Double Beef Patty, Fresh Veggies, Cheese Slices, Caramelised Veggies and In house Signature Toppings.'),
          nv('Brooklyn Chick', 249, 279, 'Chicken Patty, Cheese Slice, French Fries, Fresh Veggies and Caramelised Veggies and In house Cheesy Cream Mayo Toppings.'),
        ],
      },
    ],
  },
  {
    id: 'subwiches',
    name: 'Subwiches & burritos',
    kicker: 'Long form',
    photo: 'p07_072',
    groups: [
      {
        id: 'nv-subwiches',
        name: 'Non veg subwiches',
        items: [
          nv('Crunchy Chick Sub', 251, 279, 'Spicy and Crispy Fried Chilli Chicken, Fresh Veggies and In house Special Toppings.', 'p06_047'),
          nv('Dragon Chick Sub', 264, 289, 'Spicy Fried Chilli Chicken, Fresh Veggies and In house Special Toppings.'),
          nv('Cheesy Buff Keema Sub', 315, 339, 'Minced Beef Keema, Mozzarella Cheese, Fresh Veggies and In house Special Toppings'),
          nv('Dragon Buff Sub', 311, 329, 'Spicy Fried Chilli Beef, Fresh Veggies and In house Special Toppings.', 'p13_208'),
          nv('Crunchy Buff Sub', 309, 329, 'Spicy and Crispy Fried Beef, Fresh Veggies and In house Special Toppings'),
        ],
      },
      {
        id: 'nv-burritos',
        name: 'Non veg burritos',
        items: [
          nv('Crunchy Chick Burrito', 246, 259, 'Crunchy Chicken, Fresh Veggies, French Fries and In house Special Toppings.', 'p09_090'),
          nv('Flame Grill Chick Burrito', 251, 269, 'Grilled Kebab Chicken, Fresh Veggies, French Fries and In house Special Toppings.', 'p09_091'),
          nv('Red Flame Chick Burrito', 251, 269, 'Chilli Flakes Smeared Chilli Chicken, Fresh Veggies, French Fries and In house Peri Peri Toppings.', 'p09_092'),
          nv('Smokey Buff Burrito', 326, 342, 'Grilled Beef, Fresh Veggies, French Fries and In house Special Toppings'),
          nv('Red Flame Buff Burrito', 331, 349, 'Grilled Beef, Fresh Veggies, French Fries and In house Peri Peri Seasoning and Toppings.', 'p15_234'),
        ],
      },
    ],
  },
  {
    id: 'clubs',
    name: 'Clubs & bowls',
    kicker: 'Stacked & deconstructed',
    photo: 'p08_089',
    groups: [
      {
        id: 'club-four',
        name: 'Non veg club sandwiches — four layer',
        items: [
          nv('Classic Zing Chick Club', 349, 374, 'One Layer Crispy Fried Supreme Of Chicken, One Layer Omelette, Veggies, Bt Special Toppings', 'p08_088'),
          nv('Kababi Chick Club', 359, 374, 'One Layer Green Chilli Smeared Grilled Supreme Of Chicken, One Layer Omelette, Veggies, Bt Special Mint Mayo Toppings'),
          nv('Mozzarella Grilled Chick Club', 379, 399, 'One Layer Grilled Supreme Of Chicken, One Layer Omelette, Three Layer Fully Spread Mozzarella Cheese, Veggies, Bt Special Toppings', 'p08_089'),
        ],
      },
      {
        id: 'club-three',
        name: 'Non veg club sandwiches — three layer',
        items: [
          nv('Mozzarella Buff Keema Club', 379, 379, 'One Layer Minced Beef Keema, Mozzarella Cheese, One Layer Veggies, Bt Special Toppings'),
        ],
      },
      {
        id: 'nv-bowls',
        name: 'Non veg burger bowls',
        note: 'A burger bowl is a deconstructed burger served without a bun, where all the classic burger ingredients such as Chicken / Beef, Lettuce, Pickles, Onions, Cheese and a Special Sauce are layered or mixed in a bowl.',
        items: [
          nv('Kababi Chick Bowl', 329, 349, 'Green Chilli Smeared Supreme of Grilled Chicken, Fresh Veggies, Feta Cheese Cubes and In house Special Toppings.', 'p10_117'),
          nv('Crunchy Chick Bowl', 337, 359, 'Crispy Fried Chilli Chicken, Fresh Veggies, Feta Cheese Cubes and In house Special Toppings.'),
          nv('Dragon Chick Bowl', 359, 379, 'Spicy Fried Chilli Chicken, Fresh Veggies, Feta Cheese Cubes and In house Special Schezwan Hot Chilli Toppings'),
          nv('Crunchy Buff Bowl', 369, 389, 'Spicy and Crispy Fried Chilli Beef, Fresh Veggies, Feta Cheese Cubes and In house Special Toppings'),
        ],
      },
    ],
  },
  {
    id: 'fries',
    name: 'Fries & starters',
    kicker: 'Nine millimetre',
    photo: 'p10_116',
    groups: [
      {
        id: 'fries-plain',
        name: 'Fries',
        items: [
          vg('Classic Fries', 154, 169, '9mm Normal French Fries', 'p15_233'),
          vg('Cajun Fries', 173, 189, 'Classic Fries with Cajun Seasoning'),
          vg('Jamaican Fries', 173, 189, 'Classic Fries with Jamaican Seasoning.'),
          vg('Peri Peri Fries', 173, 189, 'Classic Fries with Peri Peri Seasoning.'),
          vg('Fiery Fries', 253, 253, 'Classic Fries, Fresh Veggies, Schezwan and In house Special Toppings.'),
          vg('Cheesy Fries', 229, 239, 'Classic Fries with In house Special Cheesy Cream Mayo Toppings'),
        ],
      },
      {
        id: 'fries-loaded',
        name: 'Loaded fries',
        items: [
          nv('Loaded Chick Fries', 311, 311, 'Classic Fries with Minced Chicken, Fresh Veggies and In house Special Toppings.', 'p10_115'),
          nv('Loaded Buff Fries', 324, 334, 'Classic Fries with Minced Beef, Fresh Veggies and In house Special Toppings'),
          nv('Crispy Chick Fries', 319, 319, 'Classic Fries with Crispy Fried Chicken, Jalapenos and In house Special Toppings', 'p10_116'),
          nv('Nashville Chick Fries', 339, 339, 'Classic Fries with Spicy and Crispy Fried Chicken, Jalapenos, Nashville Seasoning and In house Special Toppings.'),
          nv('Korean Sizzling Fries', 349, 349, 'Classic Fries with Crispy Fried Chicken, Jalapenos and In house Special Korean Toppings.', 'p11_144'),
          nv('BBQ Chick Fries', 339, 339, 'Classic Fries with Crispy Fried Chicken, Jalapenos and In house Special BBQ Toppings'),
          nv('Dragon Buff Fries', 339, 339, 'Classic Fries with Spicy Fried Chilli Beef, Jalapenos and In house Special Toppings'),
          nv('Crunchy Buff Fries', 339, 339, 'Classic Fries with Spicy and Crispy Chilli Beef, Jalapenos and In house Special Toppings'),
        ],
      },
    ],
  },
  {
    id: 'grilled',
    name: 'Grilled, strips & salads',
    kicker: 'Off the grill',
    photo: 'p11_142',
    groups: [
      {
        id: 'grilled-more',
        name: 'Grilled & more',
        note: 'Spicy Peri Peri / Green Chilli / Jamaican / Cajun condiments smeared grilled Supreme of Chicken, served with Garlic Bread, Cheesy Cream Mayo & Veggies.',
        items: [
          nv('Peri Peri Chicken', 377, 377, undefined, 'p11_142'),
          nv('Grunus Chicken', 377, 377),
          nv('Jamaican Chicken', 384, 384),
          nv('Cajun Chicken', 384, 384),
        ],
      },
      {
        id: 'strips',
        name: 'Strips & more',
        note: '9 pieces of crispy fried chicken finger strips seasoned with special cheesy and spicy toppings.',
        items: [
          nv('Cheesy Strips', 296, 301),
          nv('Cajun Cheesy Strips', 306, 319),
          nv('Peri Peri Cheesy Strips', 306, 319),
          nv('Jamaican Cheesy Strips', 306, 319),
        ],
      },
      {
        id: 'tenders',
        name: 'Tenders',
        note: 'Crispy fried chicken with or without spicy seasoning, served with in-house mayo dips.',
        items: [
          nv('Crunchy Chick Tenders', 279, 279),
          nv('Nashville Tenders', 289, 289),
          nv('Korean Tenders', 299, 299),
        ],
      },
      {
        id: 'nv-salads',
        name: 'Non veg salads',
        note: 'Classic salad with Lettuce, Capsicum, Olives served with Grilled Chicken / Beef, Garlic Bread and Caesar / Peri Peri / Cheesy Cream Mayo dressing.',
        items: [
          nv('Caesar Chicken Salad', 281, 281, undefined, 'p11_143'),
          nv('Caesar Buff Salad', 301, 320),
          nv('Peri Peri Chicken Salad', 281, 281),
          nv('Peri Peri Buff Salad', 301, 320),
        ],
      },
    ],
  },
  {
    id: 'sliders',
    name: 'Sliders & kids',
    kicker: 'Small format',
    photo: 'p06_046',
    groups: [
      {
        id: 'sliders',
        name: 'Sliders',
        note: 'Mini version of regular burgers, usually served in sets of two.',
        items: [
          nv('Slider 1', 349, 369, 'Zinger Mini & Nashville Mini Burgers', 'p06_046'),
          nv('Slider 2', 359, 379, 'Smokey Chick Mini & Red Flame Chick Mini Burgers'),
          vg('Slider 3', 349, 359, 'Paneer Delight Mini & Red Flame Paneer Mini Burgers', 'p13_207'),
        ],
      },
      {
        id: 'kids',
        name: 'Kids burgers',
        note: 'Small burgers, specially made with kids-friendly ingredients & toppings. Served only for kids.',
        items: [
          nv('Classic Zing Junior', 179, 189, 'Crispy Fried Supreme of Chicken, Fresh Veggies and In house Kids Special Toppings.', 'p06_045'),
          nv('Smokey Chick Junior', 189, 199, 'Grilled Supreme of Chicken, Cheese Slice, Fresh Veggies and In house Kids Special Toppings.'),
          vg('Smokey Paneer Junior', 179, 189, 'Grilled Paneer, Cheese Slice, Fresh Veggies and In house Kids Special Toppings.', 'p13_206'),
          vg('Sweet Fire Paneer Junior', 189, 189, 'Grilled Paneer, Cheese Slice, Fresh Veggies and In house Kids Special Honey Base Mayo Toppings.'),
        ],
      },
    ],
  },
  {
    id: 'veg',
    name: 'Veg burgers',
    kicker: 'Paneer & shroom',
    photo: 'p12_190',
    groups: [
      {
        id: 'veg-burgers',
        name: 'Veg burgers',
        items: [
          vg('Shroom Stack', 233, 256, 'Sauteed Mushrooms, Fresh Veggies and In house Special Toppings', 'p12_189'),
          vg('Smokey Paneer', 239, 263, 'BBQ Sauce Smeared Grilled Paneer, Cheese Slice, Fresh Veggies and In house BBQ Special Toppings', 'p12_190'),
          vg('Red Flame Paneer', 244, 263, 'Chilli Flakes Smeared Grilled Paneer, Cheese Slice, Fresh Veggies and In house Peri Peri Mayo Toppings'),
          vg('Kababi Paneer', 244, 274, 'Green Chilli Smeared Grilled Paneer, Cheese Slice, Fresh Veggies and In house Mint Mayo Special Toppings'),
          vg('Paneer Delight', 244, 263, 'Grilled Paneer, Cheese Slice, Fresh Veggies and In house Special Toppings', 'p12_191'),
          vg('Juicy Lucy Paneer', 305, 329, 'Grilled Paneer, Cheese Slice, Sauteed Mushrooms, Fresh Veggies and In house Special Toppings'),
          vg('Sweet Fire Paneer', 249, 269, 'Grilled Paneer, Cheese Slice, Fresh Veggies and In house Honey Base Mayo Toppings'),
        ],
      },
      {
        id: 'veg-subwiches',
        name: 'Veg subwiches',
        items: [
          vg('Chilli Paneer Sub', 249, 279, 'Crispy Fried Chilli Paneer Cubes, Fresh Veggies and In house Special Toppings'),
          vg('Fajita Paneer Sub', 259, 289, 'Grilled and Scrambled Paneer, Fresh Veggies and In house Special Toppings'),
        ],
      },
    ],
  },
  {
    id: 'vegmore',
    name: 'Veg burritos & bowls',
    kicker: 'More veg',
    photo: 'p16_250',
    groups: [
      {
        id: 'veg-burritos',
        name: 'Veg burritos',
        items: [
          vg('Paneer Fire Burrito', 256, 279, 'Chilli Paneer, Fresh Veggies, French Fries and In house Special Toppings'),
          vg('Wild Shroom Burrito', 259, 279, 'Grilled Mushrooms, Fresh Veggies, French Fries and In house Special Toppings'),
          vg('Red Flame Paneer Burrito', 259, 289, 'Grilled Paneer, Fresh Veggies, French Fries and In house Peri Peri Toppings'),
        ],
      },
      {
        id: 'veg-bowls',
        name: 'Veg burger bowls',
        note: 'A burger bowl is a deconstructed burger served without a bun, where all the classic burger ingredients such as Paneer, Cheese, Lettuce, Pickles, Onions and a Special Sauce are layered or mixed in a bowl.',
        items: [
          vg('Chilli Paneer Bowl', 279, 299, 'Spicy Fried Chilli Paneer Cubes, Fresh Veggies, Feta Cheese Cubes and In house Special Toppings.', 'p16_250'),
          vg('Fried Shroom Bowl', 279, 299, 'Pan Fried Mushrooms, Fresh Veggies, Feta Cheese Cubes and In house Special Toppings'),
        ],
      },
      {
        id: 'veg-salads',
        name: 'Veg salads',
        note: 'Classic salad with Lettuce, Capsicum, Olives served with Grilled Paneer, Garlic Bread and Caesar or Peri Peri dressing.',
        items: [
          vg('Caesar Veg Salad', 269, 279, undefined, 'p15_235'),
          vg('Peri Peri Veg Salad', 269, 289),
        ],
      },
    ],
  },
  {
    id: 'shakes',
    name: 'Milkshakes',
    kicker: 'Blended cold',
    photo: 'p16_248',
    groups: [
      {
        id: 'milkshakes',
        name: 'Milkshakes',
        note: 'Milkshakes are delicious, sweet and cold beverages typically made by blending milk, ice cream and various flavourings or sweeteners.',
        items: [
          vg('Bananza', 179, 179, 'Refreshingly healthy, Banana twist! Enjoy the delicious blend of Banana with thick Milk and Sugar.', 'p16_248'),
          vg('Mango Tango', 179, 179, 'Taste the King of Fruits! Enjoy the Sweet, Delicious taste of Mango in a Milkshake'),
          vg('Caffeine Crush', 179, 179, 'Sweet and Creamy Classic Cold Coffee blended with Milk and Ice cream'),
          vg('Straw Burst', 179, 179, 'Refreshing Strawberry Sweetness. Savor a delicious healthy Strawberry Milkshake made with thick milk and Sugar'),
          vg('Sitaphal Bliss', 179, 179, 'A Rich and Velvety Treat! Enjoy the Authentic Taste Of Sweet Sitaphal Blended with Chilled Milk'),
          vg('Tender Royale', 179, 179, 'Pure Tropical Refreshment! A Smooth and Creamy Blend of Soft Tender Coconut and Chilled Milk'),
          vg('Avocado Punch', 179, 179, 'Pure Creamy Goodness! Indulge in a Rich, Buttery Avocado Milkshake Blended to Perfection'),
        ],
      },
      {
        id: 'signature-shakes',
        name: 'Signature milkshakes',
        note: 'Treat yourself to deliciousness! Indulge in the rich, creamy taste of Signature Milkshakes.',
        items: [
          vg('KitKat Crunch', 226, 249, 'Have a Break with Pure Chocolate Bliss! Enjoy a Rich, Velvety Milkshake Loaded with Crushed KitKat.', 'p16_249'),
          vg('Oreo Dream', 226, 249, 'Pure Chocolatey Crunch! A Sweet and Frosty Milkshake Packed with Classic Oreo Cookies in Every Sip'),
          vg('Butterscotch Rush', 226, 249, 'Smooth, Sweet and Wonderfully Crunchy! Enjoy a Velvety blend Loaded with Rich Butterscotch Flavor.'),
          vg('Midnight Peanut', 229, 249, 'Unbelievable Shake, Taste this Special Milkshake with a delightful taste of Oreo Biscuits, Nutty & Creamy Peanut Butter.'),
          vg('Choco-Loco', 229, 249, 'Chocolate heat in a glass! Enjoy the delicious and creamy Milkshake made with Ice Cream, Milk and Chocolate.'),
          vg('Nutella Knockout', 244, 259, 'Indulge in Sweet Nutella Heaven. Get a Classic Milkshake made with Nutella, Milk, Ice Cream and Sugar.'),
          vg('Biscoff Blitz', 259, 281, 'Unbeatable Biscoff deliciousness. Enjoy a creamy, indulgent summer iced drink with Lotus Biscoff Milkshake'),
        ],
      },
    ],
  },
  {
    id: 'coolers',
    name: 'Mojitos & coolers',
    kicker: 'Muddled & poured',
    photo: 'p17_267',
    groups: [
      {
        id: 'mojitos',
        name: 'Mojitos',
        note: 'A refreshing blend of mint, lemon and sugar expertly muddled together, topped with flavour and carbonated water.',
        items: [
          vg('Blue Frost', 169, 179, 'Escape to a tropical paradise with our Blue Frost Mojito', 'p17_267'),
          vg('Green Grove', 169, 179, 'Indulge the perfect balance of sweet and sour Green Apple Taste.', 'p17_268'),
          vg('Berry Blue', 179, 189, 'Indulge the taste of Blueberries. Taste, Refresh and Rejuvenate.'),
          vg('Passion Pop', 179, 189, 'Refresh and Relax with our Passion Fruit Mojito.'),
          vg('Virgin Mojito', 179, 189, 'Sweet & Spicy. Elevate your taste buds with our Virgin Mojito. This drink is Sweet and Spicy with Green Chillies.', 'p17_269'),
          vg('Watermelon Wave', 179, 189, 'Beat in the summer vibes with our Watermelon Mojito. This will leave you cool and rejuvenated.', 'p17_270'),
        ],
      },
      {
        id: 'iced-teas',
        name: 'Iced teas',
        note: 'Refresh and rejuvenate. Freshly made iced tea with a hint of lemon and sugar.',
        items: [
          vg('Mint Chill', 165, 179, 'Enjoy the freshly made Mint Iced tea'),
          vg('Arctic Blue', 165, 179, 'Dive into a refreshing summer. Quench your thirst with our Arctic Blue Iced tea.'),
          vg('Apple Crush', 165, 179, 'Energise your mind and body with Green apple flavoured Iced tea.'),
          vg('Canary Chill', 172, 179, 'Cool down with Peachy Freshness. Rejuvenate yourself with a tangy and sweet Peach Iced Tea.'),
        ],
      },
      {
        id: 'lemonades',
        name: 'Lemonades',
        note: 'A thirst quenching drink that is refreshingly tangy and sweet.',
        items: [
          vg('Orange Splash', 133, 144, 'Tangy, sweet and ultra-refreshing! The ultimate citrus fusion of fresh orange and zesty lemonade.', 'p18_271'),
          vg('Pineapple Fusion', 133, 144, 'Sweet meets tangy! An icy, invigorating blend of fresh lemon juice and tropical pineapple goodness.'),
          vg('Strawberry Drift', 133, 144, 'Sweet, tangy and totally cooling! A delicious swirl of juicy strawberries and fresh, icy lemonade.', 'p18_272'),
          vg('Honey Mint Breeze', 139, 149, 'A refreshing golden touch! Cool down with zesty lemons, crushed fresh mint, and a touch of sweet honey.'),
        ],
      },
    ],
  },
  {
    id: 'desserts',
    name: 'Faloodas & sundaes',
    kicker: 'The sweet end',
    photo: 'p19_275',
    groups: [
      {
        id: 'faloodas',
        name: 'Faloodas',
        note: 'Enjoy the delectable Falooda with its unique blend of Fruits, Nuts, Vermicelli, Dry Fruits and Ice Creams.',
        items: [
          vg('Royal Falooda', 219, 229, undefined, 'p18_273'),
          vg('Butterscotch Falooda', 229, 239),
          vg('Mixfruit Falooda', 240, 249, undefined, 'p18_274'),
          vg('Dry Fruits Falooda', 259, 269),
        ],
      },
      {
        id: 'sundaes',
        name: 'Sundaes',
        note: 'Sundaes are ice cream desserts topped with sweet sauces and other yummy things.',
        items: [
          vg('Wonder Filled', 219, 244, 'Indulge the taste of crushed Oreo biscuits in creamy Vanilla Ice cream and rich chocolate toppings.', 'p19_276'),
          vg('Dark Knight', 229, 254, 'Featuring crushed Kit Kat Chocolate with rich Chocolate ice cream and Chocolate toppings.'),
          vg('Brownie with Ice Cream', 235, 259, 'A warm and fudgy Brownie topped with a scoop of creamy Vanilla Ice cream and drizzled with rich chocolate.', 'p19_275'),
          vg('Brownie with Custom Flavour Ice Cream', 265, 295, 'A warm and gooey Brownie paired with a scoop of your choice of Ice Cream (Chocolate, Strawberry, Mango, Butterscotch) and drizzled with rich Chocolate.'),
        ],
      },
    ],
  },
  {
    id: 'coffee',
    name: 'Tea & coffee',
    kicker: 'Hot & iced',
    photo: 'p20_280',
    groups: [
      {
        id: 'black-tea',
        name: 'Black tea',
        note: 'Infusions, without milk.',
        items: [
          vg('Masala Tea', 69, 89, undefined, 'p19_277'),
          vg('Vanilla Tea', 69, 89),
          vg('Ginger Tea', 59, 79),
          vg('Lemon Tea', 59, 79, undefined, 'p19_278'),
        ],
      },
      {
        id: 'hot-coffee',
        name: 'Hot coffee',
        note: 'Crafted espresso and steamed milk. Printed on the Coimbatore menu only.',
        items: [
          vg('Cafe Latte', null, 180, 'Crafted with a Single Shot of Espresso and Steamed Milk.', 'p20_280'),
          vg('Cappuccino', null, 180, "Experience the Artful Balance of Espresso's Boldness, Creamy Steamed Milk and Heavenly Layer of Foam.", 'p20_279'),
          vg('Mocha', null, 190, 'Heavenly Marriage of Boldness and Chocolate Sweetness.'),
          vg('Spanish Latte', null, 200, 'Combination of Espresso and Silky Condensed Milk with a Perfectly Frothed Layer of Hot Milk.'),
          vg('Vanilla Latte', null, 230, 'Experience Cafe Perfection with Vanilla infused Latte, Crafted with a Single Shot of Espresso and Steamed Milk.'),
          vg('Hot Chocolate', null, 190, 'Awaken Your Senses with Pure Chocolate Bliss: Sip on our Hot Chocolate, combining premium Chocolate Powder and Frothy Hot Milk.'),
          vg('Mocha Caramel', null, 210, 'Embrace the delight of Caramel Mocha: A Harmonious Combination of Smooth Espresso and Luxurious Caramel.', 'p20_281'),
          vg('Mochachino', null, 200, 'Indulge in the Perfect Blend: Rich Chocolate, Smooth Espresso and Velvety Milk For a decadent Coffee Delight'),
          vg('Oreo Latte', null, 220, 'Marvellous Blend of Oreo Biscuits, Bold Espresso and Velvety Milk with a topping of Crushed Oreo Bliss.', 'p20_282'),
          vg('Espresso', null, 140, 'Fuel your day with Espresso Power. A Bold Shot of Energy and Intensity in Every Sip.'),
          vg('Americano', null, 160, 'Experience the Purest Form of Flavour, where Espresso meets Hot Water with Exquisite Harmony.'),
          vg('Flat White', null, 170, 'Smooth and Balanced Blend of Espresso and Steamed Milk.'),
          vg('Machiatto', null, 170, 'Perfect Harmony of Rich Espresso topped with Creamy Milk.'),
          vg('Affogato', null, 230, 'Affogato delights with Vanilla Ice Cream Submerged in a Bold Espresso.'),
        ],
      },
      {
        id: 'iced-coffee',
        name: 'Iced coffee',
        note: 'A refreshing blend of espresso and a splash of cold milk. Printed on the Coimbatore menu only.',
        items: [
          vg('Iced Latte', null, 220, 'Chilled Perfection in every sip. Cool and Creamy combo of Smooth Espresso and Frothy Milk, a Refreshing treat for Coffee Lovers.'),
          vg('Iced Cappuccino', null, 220, 'Blends the intensity of Espresso, creaminess of Frothed Milk and a hint of sweetness, keeping you cool and Energised.'),
          vg('Iced Mocha', null, 230, 'A Refreshing blend of Espresso, creamy Chocolate and Splash of Cold Milk.'),
          vg('Iced Chocolate', null, 220, 'Frozen Bliss in every sip, Chilled symphony of creamy Chocolate and Frozen Milk.'),
          vg('Iced Americano', null, 190, 'Refreshing Blend of Bold Espresso and a Splash of Cold Water to keep you cool and focused.'),
          vg('Iced Spanish Latte', null, 245, 'Chilled Latte Combines the robust flavours of Espresso, smooth Sweetness of Condensed Milk.'),
          vg('Iced Mochachino', null, 245, 'Perfect blend of Chocolaty goodness, Smooth Espresso, chilled and Creamy Milk.'),
          vg('Iced Machiatto', null, 245, 'Tempting blend of Smooth Espresso, a Hint of Creaminess and a refreshing Chill, creating a cool and invigorating Coffee Moment.'),
          vg('Iced Vanilla Latte', null, 245, 'Espresso meets the creamy embrace of Milk and smooth flavour of Vanilla, creating a frosty refreshment.'),
        ],
      },
    ],
  },
  {
    id: 'addons',
    name: 'Add ons',
    kicker: 'Build it up',
    photo: 'p14_229',
    groups: [
      {
        id: 'addons',
        name: 'Add ons',
        items: [
          nv('Grilled Beef Patty', 170, 170),
          nv('Grilled Supreme of Chicken', 140, 140),
          nv('Crispy Fried Supreme of Chicken', 140, 140),
          nv('Chicken Patty', 130, 130),
          nv('Beef Patty', 140, 140),
          vg('Grilled Paneer Patty', 120, 120),
          vg('Omelette', 70, 70),
          vg('Cheese Slice', 50, 50),
          vg('BT Mayo Dip', 40, 40),
          vg('BT Special Dip', 50, 50),
          vg('Garlic Bread', 55, 55),
          vg('Cheese Cube', 50, 50),
          vg('Ice Cream Scoop, Any Flavour', 100, 100, 'Vanilla / Chocolate / Strawberry / Mango / Butterscotch'),
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

export const priceFor = (i: MenuItem, city: City) =>
  city === 'Palakkad' ? i.pkd : i.cbe

/** Items a city actually prints. Used to hide Coimbatore-only coffee in Palakkad. */
export const availableIn = (i: MenuItem, city: City) => priceFor(i, city) !== null

export const allItems = MENU.flatMap((s) => s.groups.flatMap((g) => g.items))

/**
 * The cheapest and dearest *dish* in a city. Add-ons are excluded: a range
 * that starts at the ₹40 mayo dip tells you nothing about what dinner costs.
 */
export function priceRange(city: City) {
  const p = MENU.filter((s) => s.id !== 'addons')
    .flatMap((s) => s.groups.flatMap((g) => g.items))
    .map((i) => priceFor(i, city))
    .filter((n): n is number => n !== null)
  return { min: Math.min(...p), max: Math.max(...p) }
}

export const itemCount = (city: City) =>
  allItems.filter((i) => availableIn(i, city)).length

/**
 * The dishes we lead with on the home page. Chosen because we have a
 * photograph of each and between them they cover chicken, beef, veg and
 * the sweet end of the menu.
 */
export const FEATURED = [
  'the-shocker',
  'texan-buff',
  'smokey-chick',
  'smokey-paneer',
  'korean-sizzling-fries',
  'kitkat-crunch',
] as const

export const byId = (id: string) => allItems.find((i) => i.id === id)

export const LEGEND = [
  { key: 'veg', label: 'Vegetarian' },
  { key: 'nonveg', label: 'Non-vegetarian' },
  { key: 'mild', label: 'Mild heat' },
  { key: 'spicy', label: 'Spicy' },
] as const

/** Printed at the foot of every menu page. */
export const MENU_NOTES = [
  'Every item will take a minimum of 20–25 minutes for the preparation, in peak time this may change.',
  'Menu price may vary from time to time depending on the cost of the ingredients in the market.',
  'Take away foods better to consume within 2 hours.',
  'We apologize on occasions if your choices are not available.',
  'After the order confirmation, can’t cancel or change.',
  'All prices excluded GST.',
]
