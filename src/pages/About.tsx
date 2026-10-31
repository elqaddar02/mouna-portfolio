import type { ReactNode } from 'react'
import { ArrowLink } from '../components/ui/ArrowLink'
import { Figure } from '../components/ui/Figure'
import { Label } from '../components/ui/Label'
import { Reveal } from '../components/ui/Reveal'
import { profile } from '../data/profile'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useI18n } from '../i18n/useI18n'
import { cn } from '../lib/cn'

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
  useDocumentMeta({ title: t.meta.aboutTitle, description: t.meta.aboutDescription, image: profile.portrait?.src })

  // Only sections with real content are shown; numbering closes up around empty ones.
  const bio = l(profile.shortBio)
  const paragraphs = profile.longBio.map(l).filter(Boolean)
  const hasIntro = Boolean(bio || paragraphs.length)
  const software = profile.software.filter((g) => g.tools.length)

  const sections: { id: string; title: string; show: boolean; body: ReactNode }[] = [
    {
      id: 'interests',
      title: s.interests,
      show: profile.interests.length > 0,
      body: (
        <ol className="border-t-2 border-ink">
          {profile.interests.map((item, i) => (
            <li key={i} className="flex items-baseline gap-5 border-b-2 border-ink py-4">
              <span className="font-mono text-sm text-orange-deep">{pad(i + 1)}</span>
              <span className="text-title">{l(item)}</span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: 'education',
      title: s.education,
      show: profile.education.length > 0,
      body: (
        <ul>
          {profile.education.map((e, i) => (
            <li
              key={i}
              className={cn(
                'grid gap-2 border-b-2 border-ink py-5 first:border-t-2 md:gap-6',
                l(e.period) ? 'md:grid-cols-[10rem_1fr_1fr]' : 'md:grid-cols-2',
              )}
            >
              {l(e.period) && <span className="font-mono text-sm">{l(e.period)}</span>}
              <span className="font-display text-xl font-semibold leading-tight">{l(e.institution)}</span>
              <span className="text-concrete-ink">
                {l(e.programme)}
                {e.note && <span className="mt-1 block text-sm">{l(e.note)}</span>}
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'philosophy',
      title: s.philosophy,
      show: profile.philosophy.length > 0,
      body: (
        <div className="grid gap-6 md:grid-cols-3">
          {profile.philosophy.map((p, i) => (
            <blockquote key={i} className="border-t-[6px] border-ink pt-5">
              <p className="text-outline font-display text-5xl font-bold leading-none">{pad(i + 1)}</p>
              <p className="mt-4 font-display text-xl leading-snug">{l(p)}</p>
            </blockquote>
          ))}
        </div>
      ),
    },
    {
      id: 'skills',
      title: s.skills,
      show: profile.skills.length > 0,
      body: (
        <ul className="flex flex-wrap gap-2">
          {profile.skills.map((skill, i) => (
            <li key={i} className="border-2 border-ink px-3 py-2 text-[0.95rem]">
              {l(skill)}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'software',
      title: s.software,
      show: software.length > 0,
      body: (
        <dl className="grid grid-cols-1 border-l-2 border-t-2 border-ink sm:grid-cols-2 lg:grid-cols-3">
          {software.map((group, i) => (
            <div key={i} className="border-b-2 border-r-2 border-ink p-5">
              <dt className="text-label text-[0.68rem] text-concrete-ink">
                {pad(i + 1)} — {l(group.category)}
              </dt>
              <dd className="mt-3">
                <ul className="space-y-1 font-display text-lg font-medium">
                  {group.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'languages',
      title: s.languages,
      show: profile.languages.length > 0,
      body: (
        <dl className="border-t-2 border-ink">
          {profile.languages.map((lang, i) => (
            <div key={i} className="flex items-baseline justify-between gap-4 border-b-2 border-ink py-4">
              <dt className="text-title">{l(lang.name)}</dt>
              <dd className="text-label text-concrete-ink">{l(lang.level)}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'cv',
      title: s.cv,
      show: Boolean(profile.cvUrl),
      body: profile.cvUrl && (
        <ArrowLink to={profile.cvUrl} download variant="solid">
          {t.about.cvDownload}
        </ArrowLink>
      ),
    },
  ].filter((section) => section.show)

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
            {profile.portrait ? (
              <>
                <div className="border-2 border-ink">
                  <Figure image={profile.portrait} priority sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
                <p className="text-label mt-3 text-[0.68rem] text-concrete-ink">
                  {profile.name} — {l(profile.role)}
                </p>
              </>
            ) : (
              // Without a portrait, the name and role carry the column.
              <div className="border-t-2 border-ink pt-5">
                <p className="text-headline">{profile.name}</p>
                <p className="text-label mt-4 flex items-center gap-2.5 text-[0.72rem]">
                  <span aria-hidden="true" className="size-2.5 bg-orange" />
                  {l(profile.role)}
                </p>
              </div>
            )}
          </div>
          {hasIntro && (
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <Label index={1}>{s.intro}</Label>
              {bio && <p className="text-lead mt-6">{bio}</p>}
              {paragraphs.length > 0 && (
                <div className="mt-8 space-y-5 text-lg leading-relaxed">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {sections.map((section, i) => (
        <AboutSection key={section.id} id={section.id} n={(hasIntro ? 2 : 1) + i} title={section.title}>
          {section.body}
        </AboutSection>
      ))}
    </>
  )
}
