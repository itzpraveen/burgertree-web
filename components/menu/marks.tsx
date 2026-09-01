import type { Diet, Heat } from '@/data/menu'
import { clsx } from '@/lib/cx'

/**
 * The green and red squares are an Indian labelling convention, not
 * decoration — they carry the same meaning here as on the printed menu, so
 * they keep the same shape and both get a text label for screen readers.
 */
export function DietMark({ diet, className }: { diet: Diet; className?: string }) {
  const veg = diet === 'veg'
  return (
    <span
      className={clsx(
        'inline-grid size-3.5 shrink-0 place-items-center rounded-[2px] border',
        veg ? 'border-veg' : 'border-nonveg',
        className,
      )}
      role="img"
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span
        className={clsx('block size-1.5 rounded-full', veg ? 'bg-veg' : 'bg-nonveg')}
        aria-hidden
      />
    </span>
  )
}

export function HeatMark({ heat, className }: { heat: Heat; className?: string }) {
  if (heat === 0) return null
  const spicy = heat === 2
  return (
    <span
      className={clsx('inline-flex shrink-0 items-center gap-0.5', className)}
      role="img"
      aria-label={spicy ? 'Spicy' : 'Mild heat'}
      title={spicy ? 'Spicy' : 'Mild heat'}
    >
      {Array.from({ length: spicy ? 2 : 1 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={clsx(
            'block size-1.5 rotate-45 rounded-[1px]',
            spicy ? 'bg-ember-hi' : 'bg-ember',
          )}
        />
      ))}
    </span>
  )
}

/** The key from page three of the printed menu. */
export function MenuLegend({ className }: { className?: string }) {
  return (
    <ul className={clsx('flex flex-wrap items-center gap-x-7 gap-y-3', className)}>
      <li className="flex items-center gap-2.5">
        <DietMark diet="veg" />
        <span className="ticket-sm text-ash">Vegetarian</span>
      </li>
      <li className="flex items-center gap-2.5">
        <DietMark diet="nonveg" />
        <span className="ticket-sm text-ash">Non-vegetarian</span>
      </li>
      <li className="flex items-center gap-2.5">
        <HeatMark heat={1} />
        <span className="ticket-sm text-ash">Mild heat</span>
      </li>
      <li className="flex items-center gap-2.5">
        <HeatMark heat={2} />
        <span className="ticket-sm text-ash">Spicy</span>
      </li>
    </ul>
  )
}
