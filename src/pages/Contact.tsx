import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { ArrowLink } from '../components/ui/ArrowLink'
import { ContactIcon } from '../components/ui/ContactIcon'
import { Breakable, isExternal, useContactRows } from '../components/ui/ContactLinks'
import { Label } from '../components/ui/Label'
import { Lines } from '../components/ui/MultilineHeading'
import { profile } from '../data/profile'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useI18n } from '../i18n/useI18n'

export default function Contact() {
  const { t } = useI18n()
  const rows = useContactRows()
  const email = profile.contact.email
  const [copied, setCopied] = useState(false)
  useDocumentMeta({ title: t.meta.contactTitle, description: t.meta.contactDescription })

  const copy = async () => {
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  }

  return (
    <>
      <header className="bg-orange text-paper">
        <div className="frame grid-12 gap-y-8 pb-14 pt-10 md:pb-20 md:pt-16">
          <div className="col-span-4 md:col-span-12">
            <Label>{t.contact.label}</Label>
          </div>
          <h1 className="text-mega col-span-4 uppercase md:col-span-12">
            <Lines text={t.contact.heading} />
          </h1>
          <p className="text-lead col-span-4 max-w-2xl md:col-span-7">{t.contact.lead}</p>
          <div className="col-span-4 flex items-end md:col-span-5 md:justify-end">
            {email ? (
              <ArrowLink to={`mailto:${email}`} variant="inverse">
                {t.contact.writeCta}
              </ArrowLink>
            ) : (
              <p className="text-label border-2 border-paper p-4 text-[0.72rem]">{t.contact.ctaPending}</p>
            )}
          </div>
        </div>
      </header>

      <section aria-label={t.contact.label} className="frame py-14 md:py-20">
        <dl className="border-t-2 border-ink">
          {rows.map((row) => (
            <div key={row.key} className="grid gap-2 border-b-2 border-ink py-6 md:grid-cols-[14rem_1fr_auto] md:items-center md:gap-8">
              <dt className="text-label flex items-center gap-2.5 text-concrete-ink">
                <ContactIcon kind={row.key} className="size-4 shrink-0 text-ink" />
                {t.contact[row.key]}
              </dt>
              <dd className="min-w-0 break-words">
                {row.href ? (
                  <a
                    href={row.href}
                    className="group inline-flex max-w-full items-center gap-3 text-headline hover:text-orange-deep max-md:text-[clamp(1.1rem,5.4vw,2rem)]"
                    {...(isExternal(row) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {/* Long addresses (e-mail, profile URLs) may wrap instead of overflowing on phones. */}
                    <span className="min-w-0 [overflow-wrap:anywhere]">
                      <Breakable text={row.value} />
                    </span>
                    <ArrowUpRight className="size-[0.7em] shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-headline">{row.value}</span>
                )}
              </dd>
              <dd>
                {row.key === 'email' && email && (
                  <button
                    type="button"
                    onClick={copy}
                    className="text-label flex items-center gap-2 border-2 border-ink px-3 py-2 text-[0.7rem] hover:bg-ink hover:text-paper"
                  >
                    {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                    <span aria-live="polite">{copied ? t.contact.copied : t.contact.copy}</span>
                  </button>
                )}
              </dd>
            </div>
          ))}
          {profile.cvUrl && (
            <div className="grid gap-2 border-b-2 border-ink py-6 md:grid-cols-[14rem_1fr_auto] md:items-center md:gap-8">
              <dt className="text-label text-concrete-ink">{t.contact.cv}</dt>
              <dd>
                <ArrowLink to={profile.cvUrl} download>
                  {t.contact.cvDownload}
                </ArrowLink>
              </dd>
            </div>
          )}
        </dl>
      </section>
    </>
  )
}
