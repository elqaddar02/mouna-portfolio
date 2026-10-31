import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'

/** Previous / next project — wraps around the archive. */
export function ProjectNav({ prev, next }: { prev: Project; next: Project }) {
  const { t, l } = useI18n()
  const item = (p: Project, dir: 'prev' | 'next') => {
    const Icon = dir === 'prev' ? ArrowLeft : ArrowRight
    return (
      <Link
        to={`/works/${p.slug}`}
        rel={dir}
        className={cn(
          'group flex flex-col gap-6 p-6 transition-colors hover:bg-ink hover:text-paper md:p-10',
          dir === 'next' && 'border-t-2 border-ink md:border-l-2 md:border-t-0 md:items-end md:text-right',
        )}
      >
        <span className="text-label flex items-center gap-2 text-[0.72rem]">
          {dir === 'prev' && <Icon className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />}
          {dir === 'prev' ? t.project.previous : t.project.next}
          {dir === 'next' && <Icon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
        </span>
        <span>
          <span className="text-label block text-orange-deep group-hover:text-orange">{p.number}</span>
          <span className="text-headline mt-2 block">{l(p.title)}</span>
        </span>
      </Link>
    )
  }
  return (
    <nav aria-label={t.project.projectNav} className="grid border-t-2 border-ink md:grid-cols-2">
      {item(prev, 'prev')}
      {item(next, 'next')}
    </nav>
  )
}
