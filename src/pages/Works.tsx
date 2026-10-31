import { LayoutGrid, List, RotateCcw } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilterGroup, type FilterOption } from '../components/projects/FilterGroup'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectIndex } from '../components/projects/ProjectIndex'
import { CountUp } from '../components/ui/CountUp'
import { Label } from '../components/ui/Label'
import { ScrollProgress } from '../components/ui/ScrollProgress'
import { SplitReveal } from '../components/ui/SplitReveal'
import { sortedProjects } from '../data/projects'
import type { Project } from '../data/types'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { fmt, useI18n } from '../i18n/useI18n'
import { cn } from '../lib/cn'

type FilterKey = 'category' | 'format'

const FIELD: Record<FilterKey, (p: Project) => string> = {
  category: (p) => p.category,
  format: (p) => p.format,
}

/**
 * Editorial grid rhythm: wide / narrow pairs, with the narrow card dropped
 * lower so each project gets its own space; cycles for longer lists.
 */
const GRID = [
  { col: 'md:col-span-7', aspect: '3 / 2', kind: 'cover' },
  { col: 'md:col-span-4 md:col-start-9 md:mt-40', aspect: '4 / 5', kind: 'thumb' },
  { col: 'md:col-span-6 md:col-start-3', aspect: '3 / 2', kind: 'cover' },
  { col: 'md:col-span-5 md:col-start-8 md:mt-32', aspect: '4 / 5', kind: 'thumb' },
] as const

const EASE = [0.22, 1, 0.36, 1] as const

export default function Works() {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const [params, setParams] = useSearchParams()
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } }
  useDocumentMeta({ title: t.meta.worksTitle, description: t.meta.worksDescription })

  const active: Record<FilterKey, string | null> = {
    category: params.get('category'),
    format: params.get('format'),
  }
  const view = params.get('view') === 'index' ? 'index' : 'grid'

  const matches = (p: Project, except?: FilterKey) =>
    (Object.keys(FIELD) as FilterKey[]).every((k) => k === except || !active[k] || FIELD[k](p) === active[k])

  const results = sortedProjects.filter((p) => matches(p))

  /** Options present in the data, with counts that respect the other active filters. */
  const options = useMemo(() => {
    const build = (key: FilterKey, label: (v: string) => string): FilterOption[] => {
      const values = [...new Set(sortedProjects.map(FIELD[key]))]
      return values.map((v) => ({
        value: v,
        label: label(v),
        count: sortedProjects.filter((p) => matches(p, key) && FIELD[key](p) === v).length,
      }))
    }
    return {
      category: build('category', (v) => t.categories[v as Project['category']]),
      format: build('format', (v) => t.formats[v as Project['format']]),
    }
  }, [t, params])

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const hasFilters = Object.values(active).some(Boolean)
  const reset = () => {
    const next = new URLSearchParams()
    if (view === 'index') next.set('view', 'index')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <ScrollProgress />
      <header className="drafting-grid border-b-2 border-ink">
        <div className="frame grid-12 gap-y-6 pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="col-span-4 md:col-span-12">
            <Label>{t.works.label}</Label>
          </div>
          <SplitReveal
            as="h1"
            trigger="mount"
            text={t.works.heading}
            suffix={<span className="text-orange">.</span>}
            className="text-mega col-span-4 uppercase md:col-span-9"
          />
          <motion.div className="col-span-4 flex flex-col justify-end md:col-span-3" {...rise(0.35)}>
            <p className="font-display text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none tracking-tight">
              <CountUp value={sortedProjects.length} />
            </p>
            <p className="text-label mt-2 text-concrete-ink">{t.common.projects}</p>
          </motion.div>
          <motion.p className="col-span-4 max-w-xl text-lg md:col-span-6" {...rise(0.45)}>
            {t.works.lead}
          </motion.p>
        </div>
      </header>

      <section aria-label={t.works.filters} className="border-b-2 border-ink bg-paper">
        <motion.div className="frame space-y-4 py-6" {...rise(0.55)}>
          <FilterGroup
            label={t.works.filterCategory}
            allLabel={t.works.all}
            options={options.category}
            value={active.category}
            onChange={(v) => update('category', v)}
          />
          <FilterGroup
            label={t.works.filterFormat}
            allLabel={t.works.all}
            options={options.format}
            value={active.format}
            onChange={(v) => update('format', v)}
          />
        </motion.div>
        <div className="frame flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink py-3">
          <p className="text-label text-[0.72rem]" aria-live="polite">
            {fmt(t.works.results, { n: results.length, total: sortedProjects.length })}
          </p>
          <div className="flex items-center gap-4">
            {hasFilters && (
              <button type="button" onClick={reset} className="text-label flex items-center gap-1.5 text-[0.7rem] hover:text-orange-deep">
                <RotateCcw className="size-3.5" aria-hidden="true" />
                {t.works.reset}
              </button>
            )}
            <div role="group" aria-label={t.works.viewLabel} className="flex border-2 border-ink">
              {(
                [
                  ['grid', t.works.viewGrid, LayoutGrid],
                  ['index', t.works.viewIndex, List],
                ] as const
              ).map(([mode, label, Icon]) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={view === mode}
                  onClick={() => update('view', mode === 'index' ? 'index' : null)}
                  className={cn(
                    'text-label flex items-center gap-1.5 px-2.5 py-1.5 text-[0.68rem]',
                    view === mode ? 'bg-ink text-paper' : 'hover:bg-orange',
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="frame py-14 md:py-20" aria-label={t.nav.works}>
        {results.length === 0 ? (
          <div className="flex flex-col items-start gap-6 border-2 border-dashed border-ink p-10">
            <p className="text-title">{t.works.empty}</p>
            <button type="button" onClick={reset} className="text-label border-2 border-ink px-4 py-2.5 hover:bg-ink hover:text-paper">
              {t.works.reset}
            </button>
          </div>
        ) : view === 'index' ? (
          <ProjectIndex projects={results} />
        ) : (
          <motion.ul layout className="grid-12 gap-y-16 md:gap-y-28">
            <AnimatePresence mode="popLayout">
              {results.map((project, i) => {
                const slot = GRID[i % GRID.length]!
                return (
                  <motion.li
                    key={project.id}
                    layout
                    // cards rise as they scroll into view; the right-hand card follows its neighbour
                    initial={reduce ? false : { opacity: 0, y: 56 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.8, delay: i % 2 ? 0.15 : 0, ease: EASE }}
                    className={cn('col-span-4', slot.col)}
                  >
                    <ProjectCard
                      project={project}
                      aspect={slot.aspect}
                      imageKind={slot.kind}
                      headingLevel="h2"
                      sizes="(min-width: 768px) 55vw, 100vw"
                    />
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>
    </>
  )
}
