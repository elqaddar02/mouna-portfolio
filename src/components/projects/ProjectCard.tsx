import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'
import { Figure } from '../ui/Figure'
import { PlaceholderBadge } from '../ui/PlaceholderBadge'

interface ProjectCardProps {
  project: Project
  /** CSS aspect ratio of the image frame, e.g. "4 / 5". */
  aspect: string
  /** Which image to use — portrait thumbnail or landscape cover. */
  imageKind?: 'cover' | 'thumb'
  className?: string
  headingLevel?: 'h2' | 'h3'
  sizes?: string
}

export function ProjectCard({ project, aspect, imageKind = 'cover', className, headingLevel = 'h3', sizes }: ProjectCardProps) {
  const { t, l } = useI18n()
  const H = headingLevel
  const img = imageKind === 'thumb' ? project.thumbnailImage : project.coverImage

  return (
    <article className={cn('group', className)}>
      <Link to={`/works/${project.slug}`} className="block focus-visible:outline-offset-4">
        <div className="relative overflow-hidden border-2 border-ink">
          <Figure
            image={img}
            aspect={aspect}
            sizes={sizes}
            imgClassName="transition-transform duration-[900ms] ease-arch group-hover:scale-[1.045]"
          />
          <span className="text-label absolute left-0 top-0 bg-ink px-2.5 py-1.5 text-[0.72rem] text-paper">
            {project.number}
          </span>
          <span
            aria-hidden="true"
            className="text-label absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between border-t-2 border-ink bg-orange px-3 py-2.5 text-[0.75rem] text-paper transition-transform duration-500 ease-arch group-hover:translate-y-0 group-focus-visible:translate-y-0"
          >
            {t.common.viewProject}
            <ArrowRight className="size-4" />
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-label text-[0.7rem] text-concrete-ink">
            {t.categories[project.category]}
            {project.year && (
              <>
                {' '}
                <span aria-hidden="true">·</span> {project.year}
              </>
            )}
          </p>
          <span className="text-label border-2 border-ink px-2 py-0.5 text-[0.65rem]">
            {t.formats[project.format]}
          </span>
        </div>
        <H className="text-title mt-2 transition-colors group-hover:text-orange-deep">{l(project.title)}</H>
        {l(project.shortDescription) && (
          <p className="mt-2 line-clamp-2 max-w-md text-[0.95rem] text-concrete-ink">{l(project.shortDescription)}</p>
        )}
        {project.placeholder && <PlaceholderBadge className="mt-3" />}
      </Link>
    </article>
  )
}
