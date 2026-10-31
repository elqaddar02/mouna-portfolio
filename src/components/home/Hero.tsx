import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { getProject } from '../../data/projects'
import { useI18n } from '../../i18n/useI18n'
import { ArrowLink } from '../ui/ArrowLink'
import { Figure } from '../ui/Figure'
import { TitleBlock } from '../ui/TitleBlock'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Work-first hero: the name on one line (two on phones), a short statement,
 * then a full-width render that opens its project.
 */
export function Hero() {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const [first, last] = profile.name.toUpperCase().split(' ')
  const linked = profile.heroProject ? getProject(profile.heroProject) : undefined

  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } }

  const image = (
    <Figure
      image={profile.heroImage}
      aspect={null}
      frameClassName="aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]"
      priority
      sizes="100vw"
      imgClassName="transition-transform duration-[1200ms] ease-arch group-hover:scale-[1.03]"
    />
  )

  return (
    <section aria-labelledby="hero-title" className="drafting-grid border-b-2 border-ink">
      <div className="frame pt-5 md:pt-8">
        <div className="text-label flex items-center justify-between gap-6 border-b-2 border-ink pb-3 text-[0.7rem]">
          <span>(A-000) Portfolio</span>
          <span>EN / FR</span>
        </div>

        <h1 id="hero-title" className="text-hero mt-6 uppercase md:mt-8">
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.08em]">
            <motion.span
              className="block md:whitespace-nowrap"
              {...(reduce ? {} : { initial: { y: '105%' }, animate: { y: '0%' }, transition: { duration: 1, delay: 0.1, ease: EASE } })}
            >
              <span className="block md:inline">{first}</span>{' '}
              <span className="block md:inline">
                {last}
                <span className="text-orange">.</span>
              </span>
            </motion.span>
          </span>
        </h1>

        <div className="grid-12 mt-6 items-end gap-y-6 md:mt-8">
          <motion.div className="col-span-4 md:col-span-7" {...rise(0.35)}>
            <p className="text-label flex items-center gap-2.5">
              <span aria-hidden="true" className="size-2.5 bg-orange" />
              {t.home.heroRole}
            </p>
            <p className="text-title mt-3 uppercase">
              {t.home.heroTagline1} <span className="text-concrete-ink">{t.home.heroTagline2}</span>
            </p>
          </motion.div>
          <motion.div className="col-span-4 flex flex-col items-start gap-5 md:col-span-5 md:items-end md:text-right" {...rise(0.45)}>
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
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        >
          {linked ? (
            <Link to={`/works/${linked.slug}`} className="group block border-2 border-ink" aria-label={`${t.common.viewProject} — ${l(linked.title)}`}>
              {image}
            </Link>
          ) : (
            <div className="border-2 border-ink">{image}</div>
          )}
          <TitleBlock sheet="A-000" className="absolute left-4 top-4 hidden w-72 md:grid lg:left-6 lg:top-6" />
        </motion.div>

        {linked && (
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="text-label text-[0.7rem] text-concrete-ink">
              {t.home.heroFigure} <span aria-hidden="true">·</span> <span className="text-ink">{linked.number}</span> — {l(linked.title)}
            </p>
            <ArrowLink to={`/works/${linked.slug}`} variant="text">
              {t.common.viewProject}
            </ArrowLink>
          </div>
        )}
      </div>
    </section>
  )
}
