import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../../config/nav'
import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'

export function Header() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const reduce = useReducedMotion()
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Hide on scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > 240 && y > prev && !open)
  })

  // Stable so the menu's scroll-lock / focus effect runs once per opening, not on every header render.
  const closeMenu = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-40 border-b-2 border-ink bg-paper"
        // Keyboard users must never tab into a hidden header.
        onFocusCapture={() => setHidden(false)}
        animate={{ y: hidden && !reduce ? '-100%' : '0%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="frame flex h-header items-center justify-between gap-6">
          <Link to="/" className="shrink-0">
            <Logo />
            <span className="sr-only"> — {t.nav.homeLink}</span>
          </Link>

          <nav aria-label={t.nav.primary} className="hidden lg:block">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'text-label group relative flex items-center gap-1.5 px-4 py-2 text-[0.78rem] transition-colors hover:text-orange-deep',
                        isActive && 'text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="text-concrete-ink" aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {t.nav[item.key]}
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute inset-x-4 -bottom-[1px] h-[3px] origin-left bg-orange transition-transform duration-300 ease-arch',
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                          )}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              ref={toggleRef}
              type="button"
              className="text-label border-2 border-ink px-3 py-1.5 text-[0.72rem] hover:bg-ink hover:text-paper lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              {t.nav.menu}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && <MobileMenu onClose={closeMenu} />}
      </AnimatePresence>
    </>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>('a, button')
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-paper lg:hidden"
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="frame flex h-header shrink-0 items-center justify-between border-b-2 border-paper/20">
        <Link to="/">
          <Logo inverse />
          <span className="sr-only"> — {t.nav.homeLink}</span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="text-label border-2 border-paper px-3 py-1.5 text-[0.72rem] hover:bg-orange hover:text-ink hover:border-orange"
          aria-label={t.nav.closeMenu}
        >
          {t.nav.close}
        </button>
      </div>

      <nav aria-label={t.nav.primary} className="frame flex-1 py-8">
        <ul>
          {NAV_ITEMS.map((item, i) => (
            <motion.li
              key={item.to}
              className="border-b border-paper/20"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-baseline gap-4 py-3 font-display text-[clamp(2.6rem,12vw,5rem)] font-bold uppercase leading-none tracking-[-0.04em] transition-colors hover:text-orange',
                    isActive && 'text-orange',
                  )
                }
              >
                <span className="text-label text-[0.7rem] text-paper/60">{String(i + 1).padStart(2, '0')}</span>
                {t.nav[item.key]}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="frame flex items-center justify-between border-t-2 border-paper/20 py-5">
        <span className="text-label text-paper/60">{t.nav.language}</span>
        <LanguageSwitcher inverse />
      </div>
    </motion.div>
  )
}
