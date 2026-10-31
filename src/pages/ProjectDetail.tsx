import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MediaRows } from '../components/gallery/MediaRows'
import { ProjectNav } from '../components/projects/ProjectNav'
import { ArrowLink } from '../components/ui/ArrowLink'
import { Figure } from '../components/ui/Figure'
import { Label } from '../components/ui/Label'
import { PlaceholderBadge } from '../components/ui/PlaceholderBadge'
import { Reveal } from '../components/ui/Reveal'
import { ScrollProgress } from '../components/ui/ScrollProgress'
import { SplitReveal } from '../components/ui/SplitReveal'
import { getProject, sortedProjects } from '../data/projects'
import type { ImageType, Localized, Project } from '../data/types'
import type { Dictionary } from '../i18n/en'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useLightbox } from '../hooks/useLightbox'
import { fmt, useI18n } from '../i18n/useI18n'
import { cn } from '../lib/cn'

const EASE = [0.22, 1, 0.36, 1] as const

type SectionKey = keyof Dictionary['project']['sections']

/** Page structure — sections without text or images are skipped and the numbering closes up. */
const SECTIONS: { key: SectionKey; text?: (p: Project) => Localized; types?: ImageType[] }[] = [
  { key: 'overview', text: (p) => p.fullDescription },
  { key: 'concept', text: (p) => p.architecturalConcept },
  { key: 'site', text: (p) => p.siteAnalysis, types: ['site'] },
  { key: 'process', text: (p) => p.designProcess },
  { key: 'sketches', types: ['sketch', 'diagram'] },
  { key: 'drawings', types: ['drawing'] },
  { key: 'plans', types: ['plan'] },
  { key: 'sections', types: ['section', 'elevation'] },
  { key: 'models', types: ['model'] },
  { key: 'visuals', types: ['render', 'photo'] },
]

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  return project ? <ProjectView key={project.id} project={project} /> : <MissingProject />
}

function ProjectView({ project }: { project: Project }) {
  const { t, l } = useI18n()
  useDocumentMeta({
    title: `${project.number} — ${l(project.title)}`,
    description: l(project.shortDescription),
    image: project.coverImage.src,
  })

  const reduce = useReducedMotion()
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } }
  /** Fades and slides in once, when scrolled into view. */
  const inView = (delay: number, offset = 16, axis: 'x' | 'y' = 'y') =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, [axis]: offset },
          whileInView: { opacity: 1, [axis]: 0 },
          viewport: { once: true, margin: '0px 0px -8% 0px' },
          transition: { duration: 0.7, delay, ease: EASE },
        }

  const images = useMemo(() => [project.coverImage, ...project.gallery, ...project.drawings], [project])
  const { open, indexOf, lightbox } = useLightbox(images)

  const sections = SECTIONS.map((s) => ({
    ...s,
    body: s.text ? l(s.text(project)) : '',
    images: s.types ? [...project.gallery, ...project.drawings].filter((img) => s.types!.includes(img.imageType)) : [],
  })).filter((s) => s.body || s.images.length)

  const pos = sortedProjects.findIndex((p) => p.id === project.id)
  const prev = sortedProjects[(pos - 1 + sortedProjects.length) % sortedProjects.length]!
  const next = sortedProjects[(pos + 1) % sortedProjects.length]!

  // Rows left empty in the editor are hidden rather than shown blank.
  const facts = (
    [
      [t.common.number, project.number],
      [t.common.category, t.categories[project.category]],
      [t.common.year, project.year],
      [t.common.location, l(project.location)],
      [t.common.format, t.formats[project.format]],
      ...(project.meta ?? []).map((m): [string, string] => [l(m.label), l(m.value)]),
    ] as [string, string][]
  ).filter(([, v]) => v)

  return (
    <article>
      <ScrollProgress />
      {/* Title */}
      <header className="frame pb-10 pt-8 md:pb-14 md:pt-12">
        <nav aria-label={t.project.breadcrumbLabel} className="text-label flex items-center gap-2 text-[0.72rem]">
          <Link to="/works" className="hover:text-orange-deep">
            {t.project.breadcrumb}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.number}</span>
        </nav>
        <div className="mt-8 grid-12 items-end gap-y-6">
          <div className="col-span-4 md:col-span-9">
            <motion.p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-none text-orange-deep" {...rise(0)}>
              {project.number}
            </motion.p>
            <SplitReveal
              as="h1"
              trigger="mount"
              delay={0.1}
              text={l(project.title)}
              className={cn('mt-3 uppercase', l(project.title).length > 24 ? 'text-display-long' : 'text-display')}
            />
            {l(project.subtitle) && (
              <motion.p className="text-lead mt-5 max-w-3xl text-concrete-ink" {...rise(0.4)}>
                {l(project.subtitle)}
              </motion.p>
            )}
          </div>
          <motion.div className="col-span-4 flex flex-wrap gap-2 md:col-span-3 md:justify-end" {...rise(0.5)}>
            <span className="text-label border-2 border-ink bg-ink px-2.5 py-1 text-[0.68rem] text-paper">
              {t.formats[project.format]}
            </span>
            <span className="text-label border-2 border-ink px-2.5 py-1 text-[0.68rem]">{t.categories[project.category]}</span>
            {project.placeholder && <PlaceholderBadge long />}
          </motion.div>
        </div>
      </header>

      {/* Cover */}
      <div className="frame">
        <motion.div
          className="border-2 border-ink"
          initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
        >
          <Figure
            image={project.coverImage}
            aspect={null}
            frameClassName="aspect-[4/3] md:aspect-[16/9]"
            priority
            sizes="100vw"
            index={0}
            onOpen={() => open(0)}
          />
        </motion.div>
      </div>

      {/* Fact sheet + contents */}
      <section aria-labelledby="facts-title" className="frame grid-12 gap-y-10 py-14 md:py-20">
        <div className="col-span-4 md:col-span-8">
          <Label as="h2" className="mb-5">
            <span id="facts-title">{t.project.factSheet}</span>
          </Label>
          <dl className="grid grid-cols-2 border-l-2 border-t-2 border-ink lg:grid-cols-3">
            {facts.map(([k, v], i) => (
              <motion.div key={k} className="border-b-2 border-r-2 border-ink p-3 md:p-4" {...inView(i * 0.06)}>
                <dt className="text-label text-[0.62rem] text-concrete-ink">{k}</dt>
                <dd className="mt-1 font-display text-[1.05rem] font-medium leading-snug">{v}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
        <nav aria-label={t.project.contents} className="col-span-4 md:col-span-3 md:col-start-10">
          <ol className="space-y-1.5 border-l-2 border-ink pl-4">
            {sections.map((s, i) => (
              <motion.li key={s.key} {...inView(0.2 + i * 0.05, -12)}>
                <a href={`#${s.key}`} className="text-label flex gap-3 text-[0.7rem] hover:text-orange-deep">
                  <span className="text-concrete-ink">{String(i + 1).padStart(2, '0')}</span>
                  {t.project.sections[s.key]}
                </a>
              </motion.li>
            ))}
          </ol>
        </nav>
      </section>

      {/* Sections */}
      {sections.map((s, i) => (
        <section key={s.key} id={s.key} aria-labelledby={`${s.key}-title`} className="frame grid-12 relative gap-y-8 py-14 md:py-20">
          {/* the section rule draws itself across the page */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[2px] origin-left bg-ink"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.1, ease: EASE }}
          />
          <header className="col-span-4 md:col-span-3">
            <div className="md:sticky md:top-24">
              <motion.p className="text-outline font-display text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none" {...inView(0.15, -24, 'x')}>
                {String(i + 1).padStart(2, '0')}
              </motion.p>
              <h2 id={`${s.key}-title`} className="text-label mt-4 text-[0.8rem]">
                {t.project.sections[s.key]}
              </h2>
              {s.images.length > 0 && (
                <p className="text-label mt-1 text-[0.68rem] text-concrete-ink">
                  {s.images.length === 1 ? t.project.image : fmt(t.project.images, { n: s.images.length })}
                </p>
              )}
            </div>
          </header>
          <div className="col-span-4 md:col-span-9">
            {s.body && (
              <Reveal>
                <p className={s.key === 'overview' ? 'text-lead max-w-4xl' : 'max-w-2xl text-lg leading-relaxed'}>{s.body}</p>
              </Reveal>
            )}
            {s.images.length > 0 && (
              <div className={s.body ? 'mt-12' : ''}>
                <MediaRows images={s.images} indexOf={indexOf} onOpen={open} />
              </div>
            )}
          </div>
        </section>
      ))}

      <Reveal>
        <ProjectNav prev={prev} next={next} />
      </Reveal>
      {lightbox}
    </article>
  )
}

function MissingProject() {
  const { t } = useI18n()
  useDocumentMeta({ title: t.meta.notFoundTitle, description: t.project.notFound })
  return (
    <section className="drafting-grid frame flex min-h-[70vh] flex-col justify-center py-20">
      <Label>{t.notFound.label}</Label>
      <h1 className="text-headline mt-6 max-w-2xl">{t.project.notFound}</h1>
      <div className="mt-10">
        <ArrowLink to="/works" variant="solid">
          {t.common.allProjects}
        </ArrowLink>
      </div>
    </section>
  )
}

