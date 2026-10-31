import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MediaRows } from '../components/gallery/MediaRows'
import { ProjectNav } from '../components/projects/ProjectNav'
import { ArrowLink } from '../components/ui/ArrowLink'
import { Figure } from '../components/ui/Figure'
import { Label } from '../components/ui/Label'
import { PlaceholderBadge } from '../components/ui/PlaceholderBadge'
import { Reveal } from '../components/ui/Reveal'
import { getProject, sortedProjects } from '../data/projects'
import type { ImageType, Localized, Project } from '../data/types'
import type { Dictionary } from '../i18n/en'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useLightbox } from '../hooks/useLightbox'
import { fmt, useI18n } from '../i18n/useI18n'

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

  const facts: [string, string][] = [
    [t.common.number, project.number],
    [t.common.category, t.categories[project.category]],
    [t.common.year, project.year],
    [t.common.location, l(project.location)],
    [t.common.origin, t.origins[project.projectType]],
    [t.common.format, t.formats[project.format]],
    ...(project.meta ?? []).map((m): [string, string] => [l(m.label), l(m.value)]),
  ]

  return (
    <article>
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
            <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-none text-orange-deep">{project.number}</p>
            <h1 className="text-display mt-3 uppercase">{l(project.title)}</h1>
            <p className="text-lead mt-5 max-w-3xl text-concrete-ink">{l(project.subtitle)}</p>
          </div>
          <div className="col-span-4 flex flex-wrap gap-2 md:col-span-3 md:justify-end">
            <span className="text-label border-2 border-ink bg-ink px-2.5 py-1 text-[0.68rem] text-paper">
              {t.origins[project.projectType]}
            </span>
            <span className="text-label border-2 border-ink px-2.5 py-1 text-[0.68rem]">{t.categories[project.category]}</span>
            {project.placeholder && <PlaceholderBadge long />}
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="frame">
        <div className="border-2 border-ink">
          <Figure
            image={project.coverImage}
            aspect={null}
            frameClassName="aspect-[4/3] md:aspect-[16/9]"
            priority
            sizes="100vw"
            index={0}
            onOpen={() => open(0)}
          />
        </div>
      </div>

      {/* Fact sheet + contents */}
      <section aria-labelledby="facts-title" className="frame grid-12 gap-y-10 py-14 md:py-20">
        <div className="col-span-4 md:col-span-8">
          <Label as="h2" className="mb-5">
            <span id="facts-title">{t.project.factSheet}</span>
          </Label>
          <dl className="grid grid-cols-2 border-l-2 border-t-2 border-ink lg:grid-cols-3">
            {facts.map(([k, v]) => (
              <div key={k} className="border-b-2 border-r-2 border-ink p-3 md:p-4">
                <dt className="text-label text-[0.62rem] text-concrete-ink">{k}</dt>
                <dd className="mt-1 font-display text-[1.05rem] font-medium leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <nav aria-label={t.project.contents} className="col-span-4 md:col-span-3 md:col-start-10">
          <ol className="space-y-1.5 border-l-2 border-ink pl-4">
            {sections.map((s, i) => (
              <li key={s.key}>
                <a href={`#${s.key}`} className="text-label flex gap-3 text-[0.7rem] hover:text-orange-deep">
                  <span className="text-concrete-ink">{String(i + 1).padStart(2, '0')}</span>
                  {t.project.sections[s.key]}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {/* Sections */}
      {sections.map((s, i) => (
        <section key={s.key} id={s.key} aria-labelledby={`${s.key}-title`} className="frame grid-12 gap-y-8 border-t-2 border-ink py-14 md:py-20">
          <header className="col-span-4 md:col-span-3">
            <div className="md:sticky md:top-24">
              <p className="text-outline font-display text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none">
                {String(i + 1).padStart(2, '0')}
              </p>
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

      <ProjectNav prev={prev} next={next} />
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

