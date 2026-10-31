import { useReducedMotion } from 'motion/react'
import { useI18n } from '../../i18n/useI18n'

/** Slow-scrolling strip of keywords between the slideshow and the projects. */
export function Marquee() {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const items = t.home.marquee
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-display text-[clamp(1.6rem,3.4vw,3rem)] font-bold uppercase leading-none tracking-tight md:px-10">
            {item}
          </span>
          <span aria-hidden="true" className="size-3 shrink-0 bg-orange-light md:size-4" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden border-b-2 border-ink bg-ink py-5 text-paper md:py-7">
      {reduce ? (
        <div className="flex flex-wrap justify-center">{row(false)}</div>
      ) : (
        <div className="animate-marquee flex w-max">
          {row(false)}
          {row(true)}
        </div>
      )}
    </div>
  )
}
