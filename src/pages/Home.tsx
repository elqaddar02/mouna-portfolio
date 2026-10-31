import { Closing } from '../components/home/Closing'
import { Hero } from '../components/home/Hero'
import { Intro } from '../components/home/Intro'
import { Marquee } from '../components/home/Marquee'
import { SelectedWorks } from '../components/home/SelectedWorks'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useI18n } from '../i18n/useI18n'
import { ScrollProgress } from '../components/ui/ScrollProgress'

export default function Home() {
  const { t } = useI18n()
  useDocumentMeta({ description: t.meta.homeDescription })
  return (
    <>
      <ScrollProgress />
      <Hero />
      <Marquee />
      <Intro />
      <SelectedWorks />
      <Closing />
    </>
  )
}
