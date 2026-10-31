import { Check, Copy } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { profile } from '../../data/profile'
import { useCopy } from '../../hooks/useCopy'
import { useI18n } from '../../i18n/useI18n'
import { ArrowLink } from '../ui/ArrowLink'
import { ContactIcon } from '../ui/ContactIcon'
import { Breakable, isExternal, useContactRows } from '../ui/ContactLinks'
import { Label } from '../ui/Label'
import { SplitReveal } from '../ui/SplitReveal'

const EASE = [0.22, 1, 0.36, 1] as const

/** Homepage closing block: the e-mail as the main element, then every other way to reach Mouna. */
export function Closing() {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const { copied, copy } = useCopy()
  const email = profile.contact.email
  const channels = useContactRows().filter((r) => r.key !== 'email' && r.key !== 'location' && r.href)
  const availability = profile.availability ? l(profile.availability) : ''
  const place = profile.contact.location ? l(profile.contact.location) : ''

  /** Fades an element up once it scrolls into view; `i` staggers siblings. */
  const rise = (i = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.6, ease: EASE, delay: 0.1 + i * 0.08 },
        }

  return (
    <section aria-labelledby="closing-title" className="relative overflow-hidden bg-orange text-paper">
      <div className="frame py-20 md:py-28">
        <Label index={3}>{t.home.closingLabel}</Label>

        <SplitReveal id="closing-title" text={t.home.closingHeading} className="text-mega mt-8 uppercase" />

        <motion.div {...rise(2)} className="text-label mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-[0.75rem]">
          {availability ? (
            <p className="flex items-center gap-3">
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-paper opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-paper" />
              </span>
              {availability}
            </p>
          ) : (
            <span />
          )}
          <p>{place || t.home.closingSchool}</p>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="mt-4 h-0.5 origin-left bg-paper"
          {...(reduce
            ? {}
            : { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: { once: true }, transition: { duration: 1.1, ease: EASE } })}
        />

        {email && (
          <motion.div {...rise(0)} className="mt-10 md:mt-14">
            <p className="text-label text-[0.7rem]">{t.home.closingWrite}</p>
            <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-4">
              <a
                href={`mailto:${email}`}
                className="group relative font-display text-[clamp(1.35rem,4.6vw,4.25rem)] leading-[1.05] tracking-[-0.03em]"
              >
                <Breakable text={email} />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-[0.18] bg-paper transition-transform duration-500 ease-arch group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
              <button
                type="button"
                onClick={() => copy(email)}
                className="text-label mb-1 flex items-center gap-2 border-2 border-paper px-3 py-2 text-[0.7rem] transition-colors hover:bg-paper hover:text-ink"
              >
                {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                <span aria-live="polite">{copied ? t.contact.copied : t.home.closingCopy}</span>
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2 md:items-end">
          <div>
            {channels.length > 0 && (
              <ul className="flex flex-wrap gap-3">
                {channels.map((row, i) => (
                  <motion.li key={row.key} {...rise(i + 1)}>
                    <a
                      href={row.href!}
                      aria-label={row.key === 'phone' ? `${t.contact.phone} ${row.value}` : t.contact[row.key]}
                      className="flex h-12 min-w-12 items-center justify-center gap-3 border-2 border-paper px-3 transition-colors hover:bg-paper hover:text-ink"
                      {...(isExternal(row) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <ContactIcon kind={row.key} className="size-5 shrink-0" />
                      {row.key === 'phone' && <span className="text-label whitespace-nowrap text-[0.75rem]">{row.value}</span>}
                    </a>
                  </motion.li>
                ))}
              </ul>
            )}
            <p className="mt-8 max-w-md text-lg leading-relaxed">{t.home.closingLead}</p>
          </div>
          <div className="md:justify-self-end">
            <ArrowLink to="/contact" variant="text" className="hover:text-ink">
              {t.home.closingCta}
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  )
}
