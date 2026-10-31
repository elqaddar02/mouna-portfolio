import { profile } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import { ArrowLink } from '../ui/ArrowLink'
import { Label } from '../ui/Label'
import { PlaceholderBadge } from '../ui/PlaceholderBadge'
import { Reveal } from '../ui/Reveal'
import { VideoCv } from './VideoCv'

/** Short biography and the video CV; the section is omitted while both are missing. */
export function Intro() {
  const { t, l } = useI18n()
  const bio = profile.placeholder ? '' : l(profile.shortBio)
  const video = profile.cvVideo
  if (!bio && !video) return null
  const caption = video?.caption ? l(video.caption) : ''

  return (
    <section aria-labelledby="intro-title" className="frame grid-12 gap-y-8 py-20 md:py-28">
      <div className="col-span-4 md:col-span-3">
        <Label index={1} as="h2">
          <span id="intro-title">{t.home.introLabel}</span>
        </Label>
      </div>
      <div className="col-span-4 md:col-span-9">
        {bio && (
          <Reveal>
            <p className="text-lead max-w-4xl">{bio}</p>
            <div className="mt-10">
              <ArrowLink to="/about" variant="text">
                {t.home.introLink}
              </ArrowLink>
            </div>
          </Reveal>
        )}
        {video && (
          <Reveal className={bio ? 'mt-16 md:mt-20' : undefined}>
            <figure>
              <figcaption className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-label text-[0.75rem]">{t.home.videoLabel}</span>
                {caption && <span className="text-sm text-concrete-ink">{caption}</span>}
                {video.placeholder && <PlaceholderBadge long />}
              </figcaption>
              <VideoCv video={video} />
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  )
}
