import { Play } from 'lucide-react'
import { useState } from 'react'
import type { CvVideo } from '../../data/types'
import { useI18n } from '../../i18n/useI18n'

function embedSrc(v: CvVideo) {
  const e = v.embed
  if (!e) return null
  return e.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${e.id}?autoplay=1&rel=0&playsinline=1`
    : `https://player.vimeo.com/video/${e.id}?autoplay=1&dnt=1${e.hash ? `&h=${e.hash}` : ''}`
}

/**
 * Video CV behind a poster: nothing is downloaded and no third-party player
 * loads until the visitor presses play.
 */
export function VideoCv({ video }: { video: CvVideo }) {
  const { t } = useI18n()
  const [playing, setPlaying] = useState(false)
  const embed = embedSrc(video)
  const poster =
    video.poster?.src ?? (video.embed?.provider === 'youtube' ? `https://i.ytimg.com/vi/${video.embed.id}/hqdefault.jpg` : null)

  return (
    <div className="relative aspect-video w-full overflow-hidden border-2 border-ink bg-ink">
      {playing ? (
        embed ? (
          <iframe
            src={embed}
            title={t.home.videoTitle}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <video
            src={video.file ?? undefined}
            poster={poster ?? undefined}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 size-full bg-ink object-contain"
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex size-full items-end bg-orange text-left text-paper"
        >
          {poster && (
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-arch group-hover:scale-[1.03]"
            />
          )}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-ink text-paper transition-colors duration-200 group-hover:bg-orange md:size-24"
          >
            <Play className="size-6 translate-x-0.5 fill-current md:size-9" strokeWidth={1.5} />
          </span>
          <span className="text-label relative m-3 bg-ink px-3 py-2 text-[0.7rem] text-paper md:m-5">{t.home.videoPlay}</span>
        </button>
      )}
    </div>
  )
}
