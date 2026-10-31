import type { ReactNode } from 'react'
import { ArrowLink } from '../components/ui/ArrowLink'
import { Figure } from '../components/ui/Figure'
import { Label } from '../components/ui/Label'
import { PlaceholderBadge } from '../components/ui/PlaceholderBadge'
import { Reveal } from '../components/ui/Reveal'
import { profile } from '../data/profile'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useI18n } from '../i18n/useI18n'

const pad = (n: number) => String(n).padStart(2, '0')

function AboutSection({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="frame grid-12 gap-y-6 border-t-2 border-ink py-14 md:py-20">
      <div className="col-span-4 md:col-span-3">
        <Label as="h2" index={n}>
          <span id={`${id}-title`}>{title}</span>
        </Label>
      </div>
      <Reveal className="col-span-4 md:col-span-9">{children}</Reveal>
    </section>
  )
}

export default function About() {
  const { t, l } = useI18n()
  const s = t.about.sections
  useDocumentMeta({ title: t.meta.aboutTitle, description: t.meta.aboutDescription, image: profile.portrait.src })

  return (
    <>
      <header className="drafting-grid">
        <div className="frame pb-6 pt-10 md:pt-16">
          <Label>{t.about.label}</Label>
          <h1 className="text-mega mt-6 uppercase">
            {t.about.heading}
            <span className="text-orange">.</span>
          </h1>
        </div>

        <div id="intro" className="frame grid-12 gap-y-10 pb-16 pt-6 md:pb-24">
          <div className="col-span-4 md:col-span-5">
            <div className="border-2 border-ink">
              <Figure image={profile.portrait} priority sizes="(min-width: 768px) 40vw, 100vw" />
            </div>
            <p className="text-label mt-3 text-[0.68rem] text-concrete-ink">
              {profile.name} — {l(profile.role)}
            </p>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <Label index={1}>{s.intro}</Label>
            <p className="text-lead mt-6">{l(profile.shortBio)}</p>
            <div className="mt-8 space-y-5 text-lg leading-relaxed">
              {profile.longBio.map((p, i) => (
                <p key={i}>{l(p)}</p>
              ))}
            </div>
            {profile.placeholder && <PlaceholderBadge long className="mt-6" />}
          </div>
        </div>
      </header>

      <AboutSection id="interests" n={2} title={s.interests}>
        <ol className="border-t-2 border-ink">
          {profile.interests.map((item, i) => (
            <li key={i} className="flex items-baseline gap-5 border-b-2 border-ink py-4">
              <span className="font-mono text-sm text-orange-deep">{pad(i + 1)}</span>
              <span className="text-title">{l(item)}</span>
            </li>
          ))}
        </ol>
      </AboutSection>

      <AboutSection id="education" n={3} title={s.education}>
        <ul>
          {profile.education.map((e, i) => (
            <li key={i} className="grid gap-2 border-b-2 border-ink py-5 first:border-t-2 md:grid-cols-[10rem_1fr_1fr] md:gap-6">
              <span className="font-mono text-sm">{l(e.period)}</span>
              <span className="font-display text-xl font-semibold leading-tight">{l(e.institution)}</span>
              <span className="text-concrete-ink">
                {l(e.programme)}
                {e.note && <span className="mt-1 block text-sm">{l(e.note)}</span>}
              </span>
            </li>
          ))}
        </ul>
      </AboutSection>

      <AboutSection id="philosophy" n={4} title={s.philosophy}>
        <div className="grid gap-6 md:grid-cols-3">
          {profile.philosophy.map((p, i) => (
            <blockquote key={i} className="border-t-[6px] border-ink pt-5">
              <p className="text-outline font-display text-5xl font-bold leading-none">{pad(i + 1)}</p>
              <p className="mt-4 font-display text-xl leading-snug">{l(p)}</p>
            </blockquote>
          ))}
        </div>
      </AboutSection>

      <AboutSection id="skills" n={5} title={s.skills}>
        <ul className="flex flex-wrap gap-2">
          {profile.skills.map((skill, i) => (
            <li key={i} className="border-2 border-ink px-3 py-2 text-[0.95rem]">
              {l(skill)}
            </li>
          ))}
        </ul>
      </AboutSection>

      <AboutSection id="software" n={6} title={s.software}>
        <dl className="grid grid-cols-1 border-l-2 border-t-2 border-ink sm:grid-cols-2 lg:grid-cols-3">
          {profile.software.map((group, i) => (
            <div key={i} className="border-b-2 border-r-2 border-ink p-5">
              <dt className="text-label text-[0.68rem] text-concrete-ink">
                {pad(i + 1)} — {l(group.category)}
              </dt>
              <dd className="mt-3">
                {group.tools.length ? (
                  <ul className="space-y-1 font-display text-lg font-medium">
                    {group.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="italic text-concrete-ink">{t.about.softwareEmpty}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </AboutSection>

      <AboutSection id="languages" n={7} title={s.languages}>
        <dl className="border-t-2 border-ink">
          {profile.languages.map((lang, i) => (
            <div key={i} className="flex items-baseline justify-between gap-4 border-b-2 border-ink py-4">
              <dt className="text-title">{l(lang.name)}</dt>
              <dd className="text-label text-concrete-ink">{l(lang.level)}</dd>
            </div>
          ))}
        </dl>
      </AboutSection>

      <AboutSection id="cv" n={8} title={s.cv}>
        {profile.cvUrl ? (
          <ArrowLink to={profile.cvUrl} download variant="solid">
            {t.about.cvDownload}
          </ArrowLink>
        ) : (
          <p className="border-2 border-dashed border-ink p-5 text-lg">{t.about.cvUnavailable}</p>
        )}
      </AboutSection>
    </>
  )
}
