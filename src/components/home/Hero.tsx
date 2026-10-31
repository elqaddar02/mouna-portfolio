import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { getProject } from '../../data/projects'
import { useI18n } from '../../i18n/useI18n'
import { ArrowLink } from '../ui/ArrowLink'
import { TitleBlock } from '../ui/TitleBlock'

const EASE = [0.22, 1, 0.36, 1] as const

/** One word of the name: its letters rise from behind a mask in sequence. */
function Word({ text, start, reduce, children }: { text: string; start: number; reduce: boolean | null; children?: React.ReactNode }) {
  return (
    <span className="-mb-[0.1em] block overflow-hidden pb-[0.14em] md:inline-block">
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

/**
 * Work-first hero: the name on one line (two on phones), a short statement,
 * then a full-width render that opens its project.
 */
export function Hero() {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const [first = '', last = ''] = profile.name.toUpperCase().split(' ')
  const linked = profile.heroProject ? getProject(profile.heroProject) : undefined

  // Gentle parallax: the render drifts more slowly than the page.
  const frameRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } }
  const nameEnd = 0.15 + (first.length + last.length) * 0.035

  const img = profile.heroImage
  const image = (
    <div ref={frameRef} className="relative aspect-[4/3] overflow-hidden bg-paper-2 md:aspect-[16/9] lg:aspect-[21/9]">
      <motion.img
        src={img.src}
        alt={l(img.alt)}
        width={img.width}
        height={img.height}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
        style={reduce ? undefined : { y: imageY, scale: 1.14 }}
      />
    </div>
  )

  return (
    <section aria-labelledby="hero-title" className="drafting-grid border-b-2 border-ink">
      <div className="frame pt-5 md:pt-8">
        <div className="text-label relative flex items-center justify-between gap-6 pb-3 text-[0.7rem]">
          <span>(A-000) Portfolio</span>
          <span>EN / FR</span>
          {/* the rule draws itself like a pen stroke */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-ink"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.05, ease: EASE }}
          />
        </div>

        <h1 id="hero-title" className="text-hero mt-6 uppercase md:mt-8 md:whitespace-nowrap" aria-label={profile.name}>
          <span aria-hidden="true" className="block">
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

        <div className="grid-12 mt-6 items-end gap-y-6 md:mt-8">
          <motion.div className="col-span-4 md:col-span-7" {...rise(0.45)}>
            <p className="text-label flex items-center gap-2.5">
              <span aria-hidden="true" className="size-2.5 bg-orange" />
              {t.home.heroRole}
            </p>
            <p className="text-title mt-3 uppercase">
              {t.home.heroTagline1} <span className="text-concrete-ink">{t.home.heroTagline2}</span>
            </p>
          </motion.div>
          <motion.div className="col-span-4 flex flex-col items-start gap-5 md:col-span-5 md:items-end md:text-right" {...rise(0.55)}>
            <p className="max-w-sm text-[1.05rem] leading-relaxed">{t.home.heroLead}</p>
            <ArrowLink to="#selected-works" variant="solid">
              {t.home.heroCta}
            </ArrowLink>
          </motion.div>
        </div>
      </div>

      <div className="frame mt-8 pb-14 md:mt-12 md:pb-20">
        <motion.div
          className="relative"
          initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.3, delay: 0.35, ease: EASE }}
        >
          {linked ? (
            <Link to={`/works/${linked.slug}`} className="block border-2 border-ink" aria-label={`${t.common.viewProject} — ${l(linked.title)}`}>
              {image}
            </Link>
          ) : (
            <div className="border-2 border-ink">{image}</div>
          )}
          <motion.div
            className="absolute left-4 top-4 hidden w-72 md:block lg:left-6 lg:top-6"
            initial={reduce ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          >
            <TitleBlock sheet="A-000" />
          </motion.div>
        </motion.div>

        {linked && (
          <motion.div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2" {...rise(1.1)}>
            <p className="text-label text-[0.7rem] text-concrete-ink">
              {t.home.heroFigure} <span aria-hidden="true">·</span> <span className="text-ink">{linked.number}</span> — {l(linked.title)}
            </p>
            <ArrowLink to={`/works/${linked.slug}`} variant="text">
              {t.common.viewProject}
            </ArrowLink>
          </motion.div>
        )}
      </div>
    </section>
  )
}
