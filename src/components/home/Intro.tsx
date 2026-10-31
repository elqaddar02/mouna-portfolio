import { profile } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import { ArrowLink } from '../ui/ArrowLink'
import { Label } from '../ui/Label'
import { Reveal } from '../ui/Reveal'

/** Short biography; the section is omitted while there is none. */
export function Intro() {
  const { t, l } = useI18n()
  const bio = profile.placeholder ? '' : l(profile.shortBio)
  if (!bio) return null

  return (
    <section aria-labelledby="intro-title" className="frame grid-12 gap-y-8 py-20 md:py-28">
      <div className="col-span-4 md:col-span-3">
        <Label index={1} as="h2">
          <span id="intro-title">{t.home.introLabel}</span>
        </Label>
      </div>
      <Reveal className="col-span-4 md:col-span-9">
        <p className="text-lead max-w-4xl">{bio}</p>
        <div className="mt-10">
          <ArrowLink to="/about" variant="text">
            {t.home.introLink}
          </ArrowLink>
        </div>
      </Reveal>
    </section>
  )
}
