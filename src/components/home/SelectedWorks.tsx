import { featuredProjects } from '../../data/projects'
import type { Project } from '../../data/types'
import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'
import { ProjectCard } from '../projects/ProjectCard'
import { ArrowLink } from '../ui/ArrowLink'
import { Label } from '../ui/Label'
import { Lines } from '../ui/MultilineHeading'
import { Reveal } from '../ui/Reveal'

/** Asymmetric editorial rhythm — cycles if more projects are featured. */
const LAYOUT = [
  { col: 'md:col-span-7', aspect: '4 / 3', kind: 'cover' },
  { col: 'md:col-span-4 md:col-start-9 md:mt-56', aspect: '4 / 5', kind: 'thumb' },
  { col: 'md:col-span-5 md:col-start-2 md:-mt-8', aspect: '4 / 5', kind: 'thumb' },
  { col: 'md:col-span-6 md:col-start-7 md:mt-40', aspect: '3 / 2', kind: 'cover' },
] as const

type Slot = { col: string; aspect: string; kind: 'cover' | 'thumb' }

/** Picks a slot; a project without its own portrait thumbnail keeps a landscape frame. */
function slotFor(project: Project, i: number, count: number): Slot {
  if (count === 1) return { col: 'md:col-span-10', aspect: '16 / 9', kind: 'cover' }
  const slot: Slot = LAYOUT[i % LAYOUT.length]!
  const hasThumb = project.thumbnailImage.src !== project.coverImage.src
  return slot.kind === 'thumb' && !hasThumb ? { ...slot, aspect: '4 / 3', kind: 'cover' } : slot
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
          <h2 id="works-title" className="text-display mt-6 uppercase">
            <Lines text={t.home.worksHeading} />
          </h2>
        </div>
        <div className="col-span-4 flex flex-col items-start gap-4 md:col-span-4 md:items-end">
          <p className="text-label text-concrete-ink">
            {String(items.length).padStart(2, '0')} {items.length === 1 ? t.common.project : t.common.projects}
          </p>
          <ArrowLink to="/works">{t.common.fullArchive}</ArrowLink>
        </div>
      </div>

      <div className="frame grid-12 mt-16 gap-y-16 md:mt-24 md:gap-y-10">
        {items.map((project, i) => {
          const slot = slotFor(project, i, items.length)
          return (
            <Reveal key={project.id} className={cn('col-span-4', slot.col)}>
              <ProjectCard project={project} aspect={slot.aspect} imageKind={slot.kind} sizes="(min-width: 768px) 55vw, 100vw" />
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
