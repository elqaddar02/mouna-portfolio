import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { featuredProjects } from '../../data/projects'
import type { Project } from '../../data/types'
import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'
import { ArrowLink } from '../ui/ArrowLink'
import { Label } from '../ui/Label'
import { SplitReveal } from '../ui/SplitReveal'

const EASE = [0.22, 1, 0.36, 1] as const

/** A drawing (plan, diagram…) revealed on hover, hinting at what the project page holds. */
function secondaryImage(p: Project) {
  return [...p.drawings, ...p.gallery].find((i) => i.src !== p.coverImage.src && ['plan', 'diagram', 'section', 'site'].includes(i.imageType))
}

/** Full-width row: large image on one side, project information on the other; sides alternate. */
function FeatureRow({ project, flip }: { project: Project; flip: boolean }) {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const href = `/works/${project.slug}`
  const cover = project.coverImage
  const second = secondaryImage(project)
  const contain = project.slideFit === 'contain'
  const meta = [t.categories[project.category], t.formats[project.format], project.year].filter(Boolean).join(' · ')
  const inView = (delay: number, from: Record<string, number>) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, ...from },
          whileInView: { opacity: 1, x: 0, y: 0 },
          viewport: { once: true, margin: '0px 0px -12% 0px' },
          transition: { duration: 0.9, delay, ease: EASE },
        }

  return (
    <article className="grid-12 items-center gap-y-8">
      <motion.div className={cn('col-span-4 md:col-span-7', flip && 'md:order-2 md:col-start-6')} {...inView(0, { y: 48 })}>
        {/* duplicate of the title link, so kept out of the tab order and the accessibility tree */}
        <Link to={href} tabIndex={-1} aria-hidden="true" className="group relative block overflow-hidden border-2 border-ink">
          <div className={cn('relative aspect-[4/3] md:aspect-[3/2]', contain ? 'bg-white' : 'bg-paper-2')}>
            <img
              src={cover.src}
              alt={l(cover.alt)}
              width={cover.width}
              height={cover.height}
              loading="lazy"
              decoding="async"
              className={cn(
                'absolute inset-0 size-full transition-[transform,opacity] duration-[900ms] ease-arch group-hover:scale-[1.04]',
                contain ? 'object-contain p-4 md:p-8' : 'object-cover',
                second && 'group-hover:opacity-0 group-focus-visible:opacity-0',
              )}
            />
            {second && (
              <img
                src={second.src}
                alt=""
                aria-hidden="true"
                width={second.width}
                height={second.height}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full scale-[1.04] bg-white object-contain p-4 opacity-0 transition-[transform,opacity] duration-[900ms] ease-arch group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-8"
              />
            )}
          </div>
          <span className="text-label absolute left-0 top-0 bg-ink px-2.5 py-1.5 text-[0.72rem] text-paper">{project.number}</span>
        </Link>
      </motion.div>

      <motion.div
        className={cn('col-span-4 md:col-span-4', flip ? 'md:order-1 md:col-start-1' : 'md:col-start-9')}
        {...inView(0.15, { y: 32 })}
      >
        <p className="text-outline font-display text-[clamp(4rem,9vw,8.5rem)] font-bold leading-[0.8] tracking-tight">{project.number}</p>
        <h3 className="mt-6 font-display text-[clamp(1.6rem,2.6vw,2.5rem)] font-semibold leading-[1.05] tracking-tight">
          <Link to={href} className="hover:text-orange-deep">
            {l(project.title)}
          </Link>
        </h3>
        <p className="text-label mt-4 border-y-2 border-ink py-2.5 text-[0.68rem]">{meta}</p>
        {l(project.shortDescription) && <p className="mt-5 text-[1.02rem] leading-relaxed text-concrete-ink">{l(project.shortDescription)}</p>}
        <ArrowLink to={href} variant="solid" className="mt-7">
          {t.common.viewProject}
        </ArrowLink>
      </motion.div>
    </article>
  )
}

export function SelectedWorks() {
  const { t } = useI18n()
  // Only published work on the homepage; template entries stay in the archive until replaced.
  const items = featuredProjects.filter((p) => !p.placeholder)
  return (
    <section id="selected-works" aria-labelledby="works-title" className="border-t-2 border-ink py-20 md:py-28">
      <div className="frame grid-12 items-end gap-y-6">
        <div className="col-span-4 md:col-span-8">
          <Label index={2}>{t.home.worksLabel}</Label>
          <SplitReveal id="works-title" text={t.home.worksHeading} className="text-display mt-6 uppercase" />
        </div>
        <div className="col-span-4 flex flex-col items-start gap-4 md:col-span-4 md:items-end">
          <p className="text-label text-concrete-ink">
            {String(items.length).padStart(2, '0')} {items.length === 1 ? t.common.project : t.common.projects}
          </p>
          <ArrowLink to="/works">{t.common.fullArchive}</ArrowLink>
        </div>
      </div>

      <div className="frame mt-16 space-y-24 md:mt-24 md:space-y-36">
        {items.map((project, i) => (
          <FeatureRow key={project.id} project={project} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}
