import { animate, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { sortedProjects } from '../../data/projects'
import { profile } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import { BRAND } from './Logo'

const EASE = [0.76, 0, 0.24, 1] as const
const SEEN_KEY = 'me-portfolio.intro-seen'
/** The counter never finishes sooner than this, nor waits longer for images. */
const MIN_MS = 1900
const MAX_MS = 4000

/** First visit of the session, with motion allowed, and not an automated browser. */
export function shouldShowIntro() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (navigator.webdriver) return false
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* storage blocked: show it, it simply will not be remembered */
  }
  return true
}

/** Loads the homepage slideshow images while the intro plays. */
function preloadHomeImages() {
  if (window.location.pathname !== '/') return Promise.resolve()
  const srcs = sortedProjects.filter((p) => p.slide && !p.placeholder).map((p) => p.slideImage.src)
  const first = sortedProjects.find((p) => p.slug === profile.heroProject)?.slideImage.src
  const ordered = first ? [first, ...srcs.filter((s) => s !== first)] : srcs
  return Promise.all(
    ordered.slice(0, 3).map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = img.onerror = () => resolve()
          img.src = src
        }),
    ),
  ).then(() => undefined)
}

/** Construction lines as % of the screen: horizontals grow from the left, verticals from the top. */
const LINES = [
  { axis: 'x', at: 38 },
  { axis: 'x', at: 66 },
  { axis: 'y', at: 34 },
  { axis: 'y', at: 66 },
] as const

/**
 * Opening screen, like a sheet on a drafting table: a grid, construction
 * lines, the logo drawn from its base, and a counter tied to image loading.
 * It then lifts away in two panels (ink, then brown) to reveal the page.
 */
export function Intro({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const { t } = useI18n()
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const left = useRef(false)

  const leave = () => {
    if (left.current) return
    left.current = true
    setLeaving(true)
    onReveal()
  }

  useEffect(() => {
    const ready = Promise.race([preloadHomeImages(), new Promise((r) => setTimeout(r, MAX_MS - MIN_MS))])
    const counter = animate(0, 100, {
      duration: MIN_MS / 1000,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.min(99, Math.round(v))),
    })
    let cancelled = false
    Promise.all([counter.then(() => undefined), ready]).then(() => {
      if (cancelled) return
      setCount(100)
      setTimeout(() => !cancelled && leave(), 280)
    })
    const skip = () => leave()
    window.addEventListener('keydown', skip)
    return () => {
      cancelled = true
      counter.stop()
      window.removeEventListener('keydown', skip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const year = new Date().getFullYear()

  return (
    <div className="pointer-events-auto fixed inset-0 z-[100]" onClick={leave} aria-hidden="true">
      {/* Brown panel lifts a beat after the ink one, like a second sheet. */}
      <motion.div
        className="absolute inset-0 bg-orange"
        initial={{ y: '0%' }}
        animate={leaving ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.9, ease: EASE, delay: leaving ? 0.14 : 0 }}
        onAnimationComplete={() => leaving && onDone()}
      />
      <motion.div
        className="absolute inset-0 overflow-hidden bg-ink text-paper"
        initial={{ y: '0%' }}
        animate={leaving ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        {/* Blueprint grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(184 181 173 / 0.09) 1px, transparent 1px), linear-gradient(to bottom, rgb(184 181 173 / 0.09) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Construction lines */}
        {LINES.map(({ axis, at }, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className={axis === 'x' ? 'absolute inset-x-0 h-px origin-left bg-orange-light/60' : 'absolute inset-y-0 w-px origin-top bg-orange-light/60'}
            style={axis === 'x' ? { top: `${at}%` } : { left: `${at}%` }}
            initial={axis === 'x' ? { scaleX: 0 } : { scaleY: 0 }}
            animate={axis === 'x' ? { scaleX: 1 } : { scaleY: 1 }}
            transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Title block, as on a drawing sheet */}
        <div className="text-label absolute inset-x-0 top-0 flex justify-between gap-4 p-5 text-[0.65rem] md:p-8 md:text-[0.7rem]">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {BRAND}
          </motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-right">
            {t.home.heroRole} — ENAU
          </motion.span>
        </div>

        {/* Logo, built from its base upward */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.img
            src="/brand/mark-dark-480.webp"
            alt=""
            width={480}
            height={410}
            className="h-auto w-36 md:w-52"
            initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            transition={{ duration: 1.3, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="mt-6 overflow-hidden">
            <motion.p
              className="font-display text-xl uppercase tracking-[-0.02em] md:text-2xl"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile.name}
            </motion.p>
          </div>
        </div>

        {/* Counter and progress rule */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <div className="flex items-end justify-between gap-4">
            <span className="font-display text-5xl leading-none tabular-nums tracking-[-0.04em] md:text-7xl">
              {String(count).padStart(3, '0')}
            </span>
            <span className="text-label text-right text-[0.65rem] md:text-[0.7rem]">
              {t.common.madeWith.replace('{year}', String(year))}
            </span>
          </div>
          <div className="mt-4 h-0.5 bg-paper/15">
            <div className="h-full origin-left bg-orange-light" style={{ transform: `scaleX(${count / 100})` }} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
