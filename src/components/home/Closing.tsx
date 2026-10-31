import { profile } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import { ArrowLink } from '../ui/ArrowLink'
import { Label } from '../ui/Label'
import { SplitReveal } from '../ui/SplitReveal'

export function Closing() {
  const { t } = useI18n()
  const email = profile.contact.email
  return (
    <section aria-labelledby="closing-title" className="relative overflow-hidden bg-orange text-paper">
      <div className="frame py-20 md:py-32">
        <Label index={3}>{t.home.closingLabel}</Label>
        <SplitReveal id="closing-title" text={t.home.closingHeading} className="text-mega mt-8 uppercase" />
        <div className="mt-12 grid gap-8 border-t-2 border-paper pt-8 md:grid-cols-2">
          <p className="max-w-md text-lg leading-relaxed">{t.home.closingLead}</p>
          <div className="flex flex-wrap items-start gap-4 md:justify-end">
            {email && (
              <ArrowLink to={`mailto:${email}`} variant="outlineInverse">
                {email}
              </ArrowLink>
            )}
            <ArrowLink to="/contact" variant="inverse">
              {t.home.closingCta}
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  )
}
