'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { BRAND } from '@/data/site'
import { onScroll } from '@/lib/scroll-store'
import { clsx } from '@/lib/cx'

const NAV = [
  { href: '/menu', label: 'The menu' },
  { href: '/story', label: 'Our story' },
  { href: '/stores', label: 'Find us' },
  { href: '/contact', label: 'Say hello' },
]

export function SiteHeader() {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const lastY = useRef(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  useEffect(() => onScroll((state) => {
    const goingDown = state.y > lastY.current
    lastY.current = state.y
    setHidden(goingDown && state.y > 380)
    if (progress.current) progress.current.style.transform = `scaleX(${state.progress})`
  }), [])

  const [sheetPath, setSheetPath] = useState(pathname)
  if (sheetPath !== pathname) {
    setSheetPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    const sheet = dialog.current
    if (!sheet) return
    if (!open) {
      sheet.close()
      return
    }
    sheet.showModal()
    const oldOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeAtDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeAtDesktop)
    return () => {
      desktop.removeEventListener('change', closeAtDesktop)
      document.documentElement.style.overflow = oldOverflow
      sheet.close()
    }
  }, [open])

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 border-b border-char/20 bg-marigold text-char',
        'transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] focus-within:translate-y-0',
        hidden && !open ? '-translate-y-full' : 'translate-y-0',
      )}
      style={{ height: 'var(--nav-h)' }}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label="Burger Tree, home" className="flex h-full shrink-0 items-center py-3.5 transition-opacity hover:opacity-70 [&_img]:h-full [&_img]:w-auto">
          <Logo width={96} priority dark />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className="site-nav-link ticket relative flex items-center px-4 py-3">
                {item.label}
                <span aria-hidden className={clsx('absolute inset-x-4 bottom-2 h-px origin-left bg-char transition-transform duration-300', active ? 'scale-x-100' : 'scale-x-0')} />
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-5">
          <Link href="/#order" className="header-order brand-button brand-button-dark">Order ahead <span aria-hidden>↗</span></Link>
          <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Open navigation" className="ticket -mr-2 flex min-h-11 items-center gap-3 p-2 md:hidden">
            Menu
            <span className="flex w-5 flex-col gap-1.5" aria-hidden><span className="h-0.5 w-full bg-char" /><span className="h-0.5 w-full bg-char" /></span>
          </button>
        </div>
      </div>
      <div ref={progress} aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-char/70" />
      <dialog ref={dialog} id="mobile-nav" aria-label="Navigation" className="mobile-sheet" data-lenis-prevent onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
        <div className="shell flex h-[var(--nav-h)] items-center justify-between border-b border-char/20">
          <Link href="/" onClick={() => setOpen(false)} aria-label="Burger Tree, home"><Logo width={60} dark /></Link>
          <button type="button" onClick={() => { setOpen(false); trigger.current?.focus() }} className="ticket flex min-h-11 items-center gap-4 px-2">Close <span aria-hidden className="text-2xl">×</span></button>
        </div>
        <nav aria-label="Mobile" className="shell py-5">
          {NAV.map((item, i) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname.replace(/\/$/, '') === item.href ? 'page' : undefined} className="mobile-sheet-link display-md" style={{ '--link-delay': `${i * 55 + 70}ms` } as React.CSSProperties}>
              {item.label}<span aria-hidden>↗</span>
            </Link>
          ))}
          <Link href="/#order" onClick={() => setOpen(false)} className="brand-button brand-button-dark mt-8 w-full">Find your kitchen &amp; order <span aria-hidden>↗</span></Link>
          <p className="ticket-sm mt-9 leading-relaxed">{BRAND.promise}</p>
          <p className="ticket-sm mt-4">Palakkad &amp; Coimbatore</p>
        </nav>
      </dialog>
    </header>
  )
}
