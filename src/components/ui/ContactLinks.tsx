import { Fragment } from 'react'
import { profile } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'

/** Lets long addresses wrap only at natural points: before "@" and after "/". */
export function Breakable({ text }: { text: string }) {
  const parts = text.split(/(?=@)|(?<=\/)/)
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {p}
        </Fragment>
      ))}
    </>
  )
}

export interface ContactRow {
  key: 'email' | 'linkedin' | 'instagram' | 'location'
  value: string
  href: string | null
}

/** Contact rows that have a value; empty ones are left out entirely. */
export function useContactRows(): ContactRow[] {
  const { l } = useI18n()
  const c = profile.contact
  const rows: (Omit<ContactRow, 'value'> & { value: string | null })[] = [
    { key: 'email', value: c.email, href: c.email ? `mailto:${c.email}` : null },
    { key: 'linkedin', value: c.linkedin?.replace(/^https?:\/\/(www\.)?/, '') ?? null, href: c.linkedin },
    { key: 'instagram', value: c.instagram?.replace(/^https?:\/\/(www\.)?/, '') ?? null, href: c.instagram },
    { key: 'location', value: c.location ? l(c.location) : null, href: null },
  ]
  return rows.filter((r): r is ContactRow => Boolean(r.value))
}

export function ContactLinks({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n()
  const rows = useContactRows()
  return (
    <dl className={cn('space-y-2', compact && 'text-sm')}>
      {rows.map((row) => (
        <div key={row.key} className="flex flex-wrap gap-x-3">
          <dt className="text-label w-24 shrink-0 text-[0.7rem] text-concrete-ink">{t.contact[row.key]}</dt>
          <dd className="min-w-0 break-words">
            {row.href ? (
              <a
                href={row.href}
                className="underline decoration-2 underline-offset-4 hover:text-orange-deep"
                {...(row.key !== 'email' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <Breakable text={row.value} />
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
