import { profile } from '../../data/profile'
import { sortedProjects } from '../../data/projects'
import { useI18n } from '../../i18n/useI18n'
import { ArrowLink } from '../ui/ArrowLink'
import { Label } from '../ui/Label'
import { Reveal } from '../ui/Reveal'

export function Intro() {
  const { t, l } = useI18n()
  // Count published work only; template entries don't count.
  const real = sortedProjects.filter((p) => !p.placeholder)
  const stats = [
    [String(real.length).padStart(2, '0'), t.home.statProjects],
    [String(new Set(real.map((p) => p.category)).size).padStart(2, '0'), t.home.statCategories],
    ['02', t.home.statLanguages],
  ] as const

  return (
    <section aria-labelledby="intro-title" className="frame grid-12 gap-y-8 py-20 md:py-32">
      <div className="col-span-4 md:col-span-3">
        <Label index={1} as="h2">
          <span id="intro-title">{t.home.introLabel}</span>
        </Label>
      </div>

      <Reveal className="col-span-4 md:col-span-9">
        {/* The biography appears once Mouna's real text replaces the template. */}
        {!profile.placeholder && <p className="text-lead mb-10 max-w-4xl">{l(profile.shortBio)}</p>}

        <ul className="flex flex-wrap gap-x-3 gap-y-2 font-mono text-sm uppercase tracking-wider">
          {t.home.disciplines.map((d, i) => (
            <li key={d} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="text-orange">/</span>}
              {d}
            </li>
          ))}
        </ul>

        <dl className="mt-12 grid grid-cols-3 border-y-2 border-ink">
          {stats.map(([n, label], i) => (
            <div key={label} className={i > 0 ? 'border-l-2 border-ink pl-4 md:pl-6' : ''}>
              <dt className="text-label pt-3 text-[0.68rem] text-concrete-ink">{label}</dt>
              <dd className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight pb-3">{n}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10">
          <ArrowLink to="/about" variant="text">
            {t.home.introLink}
          </ArrowLink>
        </div>
      </Reveal>
    </section>
  )
}
