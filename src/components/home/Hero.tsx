import { motion, useReducedMotion } from 'motion/react'
import { profile } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import { ArrowLink } from '../ui/ArrowLink'
import { Figure } from '../ui/Figure'
import { TitleBlock } from '../ui/TitleBlock'

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const [first, last] = profile.name.toUpperCase().split(' ')

  const line = (i: number) =>
    reduce
      ? {}
      : {
          initial: { y: '105%' },
          animate: { y: '0%' },
          transition: { duration: 1, delay: 0.1 + i * 0.08, ease: EASE },
        }

  return (
    <section aria-labelledby="hero-title" className="drafting-grid relative border-b-2 border-ink">
      <div className="frame pt-5 md:pt-8">
        <div className="text-label flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b-2 border-ink pb-3 text-[0.7rem]">
          <span>(A-000) Portfolio</span>
          <span className="hidden md:inline">{l(profile.role)}</span>
          <span>EN / FR</span>
        </div>

        <h1 id="hero-title" className="text-mega relative z-10 mt-6 uppercase md:mt-10">
          <span className="block overflow-hidden pb-[0.02em]">
            <motion.span className="block" {...line(0)}>{first}</motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.16em] -mb-[0.1em]">
            <motion.span className="block" {...line(1)}>
              {last}
              <span className="text-orange">.</span>
            </motion.span>
          </span>
        </h1>
      </div>

      <div className="frame grid-12 gap-y-10 pb-14 md:pb-20">
        <motion.div
          className="col-span-4 flex flex-col pt-6 md:col-span-6 md:pt-10 lg:col-span-5"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
        >
          <p className="text-label flex items-center gap-2.5">
            <span aria-hidden="true" className="size-2.5 bg-orange" />
            {t.home.heroRole}
          </p>
          <p className="text-headline mt-5 uppercase">
            <span className="block">{t.home.heroTagline1}</span>
            <span className="block text-concrete-ink">{t.home.heroTagline2}</span>
          </p>
          <p className="mt-6 max-w-md text-lg leading-relaxed">{t.home.heroLead}</p>
          <div className="mt-8">
            <ArrowLink to="#selected-works" variant="solid">
              {t.home.heroCta}
            </ArrowLink>
          </div>

          <div className="mt-auto hidden items-end gap-4 pt-16 md:flex" aria-hidden="true">
            <span className="relative block h-16 w-[2px] overflow-hidden bg-concrete">
              <span className="animate-scroll-line absolute inset-0 bg-ink" />
            </span>
            <span className="text-label text-[0.68rem]">{t.common.scroll}</span>
          </div>
        </motion.div>

        <div className="relative col-span-4 md:col-span-6 md:-mt-[9vw] lg:col-span-5 lg:col-start-8">
          <motion.div
            className="border-2 border-ink"
            initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
          >
            <Figure
              image={profile.heroImage}
              aspect={null}
              frameClassName="aspect-[4/3] md:aspect-[4/5]"
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
            className="mt-3 md:absolute md:-left-10 md:bottom-10 md:mt-0 md:w-72"
          >
            <TitleBlock sheet="A-000" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
