import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../../data/types'
import { useI18n } from '../../i18n/useI18n'

/** Technical index table with a cursor-following image preview on pointer devices. */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState<Project | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 30 })
  const sy = useSpring(y, { stiffness: 300, damping: 30 })

  const onMove = (e: MouseEvent) => {
    x.set(e.clientX + 24)
    y.set(e.clientY - 120)
  }

  // Place the preview under the cursor immediately instead of springing in from the corner.
  const onEnter = (e: MouseEvent, p: Project) => {
    if (!hovered) {
      sx.jump(e.clientX + 24)
      sy.jump(e.clientY - 120)
    }
    onMove(e)
    setHovered(p)
  }

  const th = 'text-label py-3 pr-4 text-left text-[0.68rem] font-medium text-concrete-ink'

  return (
    <div className="relative" onMouseMove={onMove} onMouseLeave={() => setHovered(null)}>
      <table className="w-full border-collapse">
        <thead className="border-b-2 border-ink">
          <tr>
            <th scope="col" className={`${th} w-16`}>{t.works.colNo}</th>
            <th scope="col" className={th}>{t.works.colTitle}</th>
            <th scope="col" className={`${th} hidden md:table-cell`}>{t.common.category}</th>
            <th scope="col" className={`${th} hidden sm:table-cell`}>{t.common.format}</th>
            <th scope="col" className={`${th} w-20 text-right`}>{t.common.year}</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <motion.tr
              key={p.id}
              initial={reduce ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
              className="group relative border-b border-ink/30 transition-colors hover:bg-ink hover:text-paper"
              onMouseEnter={(e) => onEnter(e, p)}
              onMouseLeave={() => setHovered(null)}
            >
              <td className="py-5 pr-4 font-mono text-sm">{p.number}</td>
              <td className="py-5 pr-4">
                <Link
                  to={`/works/${p.slug}`}
                  className="flex items-center gap-3 font-display text-[clamp(1.25rem,2.6vw,2.25rem)] font-semibold leading-none tracking-tight after:absolute after:inset-0 after:content-['']"
                >
                  {l(p.title)}
                  <ArrowRight className="size-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-orange-light group-hover:opacity-100" aria-hidden="true" />
                </Link>
              </td>
              <td className="hidden py-5 pr-4 text-sm md:table-cell">{t.categories[p.category]}</td>
              <td className="hidden py-5 pr-4 sm:table-cell">
                <span className="text-label border-2 border-current px-2 py-0.5 text-[0.62rem]">{t.formats[p.format]}</span>
              </td>
              <td className="py-5 text-right font-mono text-sm">{p.year}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {!reduce && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.id}
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-30 hidden w-64 border-2 border-ink bg-paper [@media(hover:hover)]:block"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
            >
              <img src={hovered.thumbnailImage.src} alt="" width={hovered.thumbnailImage.width} height={hovered.thumbnailImage.height} className="aspect-[4/5] w-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
