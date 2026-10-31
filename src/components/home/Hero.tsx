import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { profile } from '../../data/profile'
import { sortedProjects } from '../../data/projects'
import type { ArchImage } from '../../data/types'
import { fmt, useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'
import { ArrowLink } from '../ui/ArrowLink'

const EASE = [0.22, 1, 0.36, 1] as const
/** Seconds each slide stays on screen while playing. */
const SLIDE_SECONDS = 6

/** One word of the name: its letters rise from behind a mask in sequence. */
function Word({ text, start, reduce, children }: { text: string; start: number; reduce: boolean | null; children?: ReactNode }) {
  return (
    <span className="-mb-[0.1em] inline-block overflow-hidden pb-[0.14em]">
      {[...text].map((ch, i) =>
        reduce ? (
          <span key={i}>{ch}</span>
        ) : (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.9, delay: 0.15 + (start + i) * 0.035, ease: EASE }}
          >
            {ch}
          </motion.span>
        ),
      )}
      {children}
    </span>
  )
}

interface Slide {
  key: string
  image: ArchImage
  fit: 'cover' | 'contain'
  number?: string
  title?: string
  meta?: string
  href?: string
}

/** Name band, then a full-width slideshow of the projects marked "slide" in the editor. */
export function Hero() {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const [first = '', last = ''] = profile.name.toUpperCase().split(' ')
  const nameEnd = 0.15 + (first.length + last.length) * 0.035

  const projectSlides: Slide[] = sortedProjects
    .filter((p) => p.slide && !p.placeholder)
    .map((p) => ({
      key: p.slug,
      image: p.slideImage,
      fit: p.slideFit,
      number: p.number,
      title: l(p.title),
      meta: [t.categories[p.category], t.formats[p.format], p.year].filter(Boolean).join(' · '),
      href: `/works/${p.slug}`,
    }))
  // Fallback when no project is in the slideshow: the profile's homepage image.
  const slides: Slide[] = projectSlides.length ? projectSlides : [{ key: 'hero', image: profile.heroImage, fit: 'cover' }]

  // Open on the project chosen as "first slide" in the editor, if it is in the slideshow.
  const [index, setIndex] = useState(() => Math.max(0, slides.findIndex((s) => s.key === profile.heroProject)))
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [startX, setStartX] = useState<number | null>(null)
  const count = slides.length
  const autoplay = !reduce && count > 1
  const playing = autoplay && !paused && !hovered
  const current = slides[index]!

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    else if (e.key === 'ArrowLeft') go(-1)
  }
  const onPointerUp = (e: PointerEvent) => {
    if (startX !== null && Math.abs(e.clientX - startX) > 50) go(e.clientX < startX ? 1 : -1)
    setStartX(null)
  }

  const ctrl =
    'grid size-11 place-items-center border-2 border-ink bg-paper text-ink transition-colors hover:bg-orange focus-visible:outline-offset-2'

  return (
    <section aria-labelledby="hero-title" className="border-b-2 border-ink">
      {/* Name band */}
      <div className="drafting-grid border-b-2 border-ink">
        <div className="frame pb-6 pt-5 md:pb-8 md:pt-7">
          <div className="text-label relative flex items-center justify-between gap-6 pb-3 text-[0.7rem]">
            <span>(A-000) Portfolio</span>
            <span>EN / FR</span>
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-ink"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.05, ease: EASE }}
            />
          </div>
          <div className="mt-5 flex flex-col gap-5 md:mt-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <h1 id="hero-title" className="text-name uppercase md:whitespace-nowrap" aria-label={profile.name}>
              <span aria-hidden="true">
                <Word text={first} start={0} reduce={reduce} />{' '}
                <Word text={last} start={first.length} reduce={reduce}>
                  {reduce ? (
                    <span className="text-orange">.</span>
                  ) : (
                    <motion.span
                      className="inline-block text-orange"
                      initial={{ y: '-120%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{ duration: 0.6, delay: nameEnd + 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      .
                    </motion.span>
                  )}
                </Word>
              </span>
            </h1>
            <motion.div
              className="shrink-0 lg:pb-2 lg:text-right"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            >
              <p className="text-label flex items-center gap-2.5 lg:justify-end">
                <span aria-hidden="true" className="size-2.5 bg-orange" />
                {t.home.heroRole}
              </p>
              <p className="mt-2 font-display text-lg font-semibold uppercase leading-tight tracking-tight md:text-xl">
                {t.home.heroTagline1} <span className="text-concrete-ink">{t.home.heroTagline2}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slideshow */}
      <motion.div
        role="region"
        aria-roledescription="carousel"
        aria-label={t.home.sliderLabel}
        className="relative"
        initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.3, delay: 0.3, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onKeyDown={onKeyDown}
      >
        <div
          className="relative aspect-[4/3] touch-pan-y overflow-hidden bg-paper-2 select-none md:aspect-auto md:h-[calc(100svh-var(--spacing-header)-19rem)] md:min-h-[420px]"
          onPointerDown={(e) => setStartX(e.clientX)}
          onPointerUp={onPointerUp}
          onPointerCancel={() => setStartX(null)}
        >
          {slides.map((s, i) => {
            const active = i === index
            return (
              <motion.div
                key={s.key}
                role="group"
                aria-roledescription="slide"
                aria-label={fmt(t.home.slideLabel, { i: i + 1, n: count })}
                aria-hidden={!active}
                className={cn('absolute inset-0', s.fit === 'contain' && 'bg-white')}
                initial={false}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 1, ease: 'easeInOut' }}
              >
                <motion.img
                  src={s.image.src}
                  alt={l(s.image.alt)}
                  width={s.image.width}
                  height={s.image.height}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  draggable={false}
                  className={cn('size-full', s.fit === 'contain' ? 'object-contain p-6 md:p-12' : 'object-cover')}
                  // slow "Ken Burns" zoom while the slide is on screen
                  initial={false}
                  animate={{ scale: active && !reduce ? 1.07 : 1 }}
                  transition={{ duration: active ? SLIDE_SECONDS + 1.5 : 0.01, ease: 'linear' }}
                />
              </motion.div>
            )
          })}

          {/* Caption panel */}
          {current.title && (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.key}
                className="absolute bottom-4 left-4 right-4 hidden max-w-md border-2 border-ink bg-paper p-5 md:right-auto md:block lg:bottom-6 lg:left-6"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="font-display text-xl font-bold leading-none text-orange-deep">{current.number}</p>
                <p className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight">{current.title}</p>
                <p className="text-label mt-2 text-[0.68rem] text-concrete-ink">{current.meta}</p>
                <ArrowLink to={current.href!} variant="text" className="mt-4">
                  {t.common.viewProject}
                </ArrowLink>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Arrows */}
          {count > 1 && (
            <div className="absolute right-4 top-4 flex gap-2 lg:right-6 lg:top-6">
              <button type="button" className={ctrl} onClick={() => go(-1)} aria-label={t.home.sliderPrev}>
                <ArrowLeft className="size-5" aria-hidden="true" />
              </button>
              <button type="button" className={ctrl} onClick={() => go(1)} aria-label={t.home.sliderNext}>
                <ArrowRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Caption on phones (below the image, for legibility) */}
        {current.title && (
          <div className="frame border-t-2 border-ink py-4 md:hidden">
            <p className="font-display text-lg font-bold leading-none text-orange-deep">{current.number}</p>
            <p className="mt-1.5 font-display text-xl font-semibold leading-tight tracking-tight">{current.title}</p>
            <p className="text-label mt-1.5 text-[0.65rem] text-concrete-ink">{current.meta}</p>
            <ArrowLink to={current.href!} variant="text" className="mt-3">
              {t.common.viewProject}
            </ArrowLink>
          </div>
        )}

        {/* Indicators: 001 — 002 — 003, each filling while its slide plays */}
        {count > 1 && (
          <div className="frame flex items-stretch gap-3 border-t-2 border-ink py-3">
            <div className="grid flex-1 gap-3" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${s.number} — ${s.title}`}
                  aria-current={i === index}
                  className="group text-left"
                >
                  <span className="relative block h-[3px] overflow-hidden bg-concrete">
                    {i < index && <span className="absolute inset-0 bg-ink" />}
                    {i === index && (
                      <span
                        key={`${index}-${autoplay}`}
                        className={cn('absolute inset-0 origin-left bg-orange', autoplay ? 'animate-slide-progress' : '')}
                        style={{ animationDuration: `${SLIDE_SECONDS}s`, animationPlayState: playing ? 'running' : 'paused' }}
                        onAnimationEnd={() => go(1)}
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-label mt-2 block truncate text-[0.66rem] transition-colors',
                      i === index ? 'text-ink' : 'text-concrete-ink group-hover:text-ink',
                    )}
                  >
                    {s.number} <span className="hidden sm:inline">— {s.title}</span>
                  </span>
                </button>
              ))}
            </div>
            {autoplay && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? t.home.sliderPlay : t.home.sliderPause}
                className="grid size-9 shrink-0 place-items-center self-center border-2 border-ink hover:bg-orange"
              >
                {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </section>
  )
}
