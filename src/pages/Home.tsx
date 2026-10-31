import { Closing } from '../components/home/Closing'
import { ConceptsTeaser } from '../components/home/ConceptsTeaser'
import { Hero } from '../components/home/Hero'
import { Intro } from '../components/home/Intro'
import { SelectedWorks } from '../components/home/SelectedWorks'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useI18n } from '../i18n/useI18n'

export default function Home() {
  const { t } = useI18n()
  useDocumentMeta({ description: t.meta.homeDescription })
  return (
    <>
      <Hero />
      <Intro />
      <SelectedWorks />
      <ConceptsTeaser />
      <Closing />
    </>
  )
}
