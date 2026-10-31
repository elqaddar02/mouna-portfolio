import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Suspense, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { useI18n } from '../../i18n/useI18n'
import { Footer } from './Footer'
import { Header } from './Header'

/** Keeps the outgoing page rendered during its exit animation. */
function FrozenOutlet() {
  const outlet = useOutlet()
  const [frozen] = useState(outlet)
  return frozen
}

export function Layout() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  return (
    <>
      <a
        href="#main"
        className="text-label fixed left-3 top-3 z-[60] -translate-y-24 bg-orange px-4 py-3 text-paper focus:translate-y-0"
      >
        {t.nav.skip}
      </a>
      <Header />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
      >
        <motion.main
          key={pathname}
          id="main"
          tabIndex={-1}
          className="min-h-[70vh] pt-header outline-none"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<PageFallback />}>
            <FrozenOutlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  )
}

function PageFallback() {
  return (
    <div className="frame flex min-h-[60vh] items-center" aria-busy="true">
      <span className="block h-[3px] w-24 animate-pulse bg-orange" />
    </div>
  )
}
