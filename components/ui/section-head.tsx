import { Reveal } from './reveal'
import { clsx } from '@/lib/cx'

/**
 * Section headers are set as kitchen tickets: a rule, an order number, a
 * label. The numbering is real — it's the order the page runs in — which is
 * the only reason it earns its place.
 */
export function SectionHead({
  index,
  kicker,
  title,
  lede,
  className,
  align = 'left',
}: {
  index?: number
  kicker: string
  title: string
  lede?: string
  className?: string
  align?: 'left' | 'center'
}) {
  return (
    <header className={clsx('rule pt-6', align === 'center' && 'text-center', className)}>
      <Reveal>
        <div
          className={clsx(
            'flex items-baseline gap-4',
            align === 'center' && 'justify-center',
          )}
        >
          {index !== undefined && (
            <span className="ticket-sm text-marigold">
              {String(index).padStart(2, '0')}
            </span>
          )}
          <span className="ticket text-ash">{kicker}</span>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="display-lg mt-7 max-w-4xl text-cream">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={160}>
          <p
            className={clsx(
              'body-lg mt-7 max-w-2xl text-cream-dim',
              align === 'center' && 'mx-auto',
            )}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </header>
  )
}
