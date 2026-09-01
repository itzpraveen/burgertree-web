import { Reveal } from './reveal'
import type { ReactNode } from 'react'

/**
 * The masthead every page but the home page opens with. Deliberately quiet —
 * the home page spends the boldness, and these pages are for reading.
 */
export function PageHead({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string
  title: string
  lede?: string
  children?: ReactNode
}) {
  return (
    <header className="shell pb-14 pt-[calc(var(--nav-h)+5rem)] lg:pb-20 lg:pt-[calc(var(--nav-h)+8rem)]">
      <Reveal>
        <p className="ticket text-marigold">{kicker}</p>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="display-lg mt-7 max-w-5xl text-cream">{title}</h1>
      </Reveal>
      {lede && (
        <Reveal delay={160}>
          <p className="body-lg mt-8 max-w-2xl text-cream-dim">{lede}</p>
        </Reveal>
      )}
      {children && <Reveal delay={240}>{children}</Reveal>}
    </header>
  )
}
