import { ArrowLink } from '../components/ui/ArrowLink'
import { Label } from '../components/ui/Label'
import { Lines } from '../components/ui/MultilineHeading'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useI18n } from '../i18n/useI18n'

export default function NotFound() {
  const { t } = useI18n()
  useDocumentMeta({ title: t.meta.notFoundTitle, description: t.notFound.lead })
  return (
    <section className="drafting-grid frame flex min-h-[75vh] flex-col justify-center py-20">
      <Label>{t.notFound.label}</Label>
      <h1 className="text-display mt-6 uppercase">
        <Lines text={t.notFound.heading} />
      </h1>
      <p className="mt-6 max-w-md text-lg">{t.notFound.lead}</p>
      <div className="mt-10">
        <ArrowLink to="/" variant="solid">
          {t.notFound.cta}
        </ArrowLink>
      </div>
    </section>
  )
}
