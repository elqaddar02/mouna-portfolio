import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Figure } from '../components/ui/Figure'
import { Label } from '../components/ui/Label'
import { PlaceholderBadge } from '../components/ui/PlaceholderBadge'
import { Reveal } from '../components/ui/Reveal'
import { sortedConcepts } from '../data/concepts'
import type { ArchImage, Concept } from '../data/types'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useLightbox } from '../hooks/useLightbox'
import { useI18n } from '../i18n/useI18n'
import { cn } from '../lib/cn'

export default function Concepts() {
  const { t } = useI18n()
  const { hash } = useLocation()
  useDocumentMeta({ title: t.meta.conceptsTitle, description: t.meta.conceptsDescription })

  const images = useMemo(() => sortedConcepts.flatMap((c) => c.images), [])
  const owner = useMemo(() => new Map(sortedConcepts.flatMap((c) => c.images.map((img) => [img, c] as const))), [])
  const { open, indexOf, lightbox } = useLightbox(images, (img) => owner.get(img)?.number)

  // Deep links arriving from another page (/concepts#concept-02) jump straight to the spread;
  // in-page anchor clicks keep the browser's smooth scrolling.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [])

  return (
    <>
      <header className="bg-ink text-paper">
        <div className="frame grid-12 gap-y-8 pb-14 pt-10 md:pb-20 md:pt-16">
          <div className="col-span-4 md:col-span-12">
            <Label className="text-paper/70">{t.concepts.label}</Label>
          </div>
          <h1 className="text-mega col-span-4 uppercase md:col-span-12">
            {t.concepts.heading}
            <span className="text-orange">.</span>
          </h1>
          <p className="text-lead col-span-4 max-w-3xl md:col-span-7">{t.concepts.lead}</p>
          <p className="text-label col-span-4 self-end border-2 border-dashed border-orange p-4 text-[0.72rem] leading-relaxed md:col-span-4 md:col-start-9">
            {t.concepts.disclaimer}
          </p>
        </div>

        <nav aria-label={t.concepts.heading} className="border-t border-paper/20">
          <ul className="frame flex gap-x-6 gap-y-2 overflow-x-auto py-4 md:flex-wrap">
            {sortedConcepts.map((c) => (
              <li key={c.id} className="shrink-0">
                <a href={`#${c.slug}`} className="text-label text-[0.7rem] text-paper/80 hover:text-orange">
                  <span className="text-orange">{c.number}</span> {t.conceptKinds[c.kind]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="drafting-grid">
        {sortedConcepts.map((concept, i) => (
          <ConceptSpread key={concept.id} concept={concept} flip={i % 2 === 1} indexOf={indexOf} onOpen={open} />
        ))}
      </div>
      {lightbox}
    </>
  )
}

interface SpreadProps {
  concept: Concept
  flip: boolean
  indexOf: (img: ArchImage) => number
  onOpen: (i: number) => void
}

function ConceptSpread({ concept, flip, indexOf, onOpen }: SpreadProps) {
  const { t, l } = useI18n()
  const [main, second] = concept.images
  if (!main) return null

  return (
    <article id={concept.slug} aria-labelledby={`${concept.slug}-title`} className="frame grid-12 gap-y-10 border-b-2 border-ink py-16 md:py-28">
      {/* Image composition — the second image overlaps the first */}
      <div className={cn('relative col-span-4 md:col-span-7', flip && 'md:order-2 md:col-start-6')}>
        <div className={cn('border-2 border-ink', second && 'md:w-[82%]', flip && 'md:ml-auto')}>
          <Figure image={main} index={indexOf(main)} onOpen={() => onOpen(indexOf(main))} sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        {second && (
          <div
            className={cn(
              'mt-6 w-[72%] border-2 border-ink bg-paper p-2 md:absolute md:-bottom-14 md:mt-0 md:w-[46%]',
              flip ? 'md:left-0 ml-0' : 'ml-auto md:right-0',
            )}
          >
            <Figure image={second} index={indexOf(second)} onOpen={() => onOpen(indexOf(second))} sizes="(min-width: 768px) 25vw, 70vw" />
          </div>
        )}
      </div>

      {/* Text column */}
      <Reveal className={cn('col-span-4 flex flex-col md:col-span-4', flip ? 'md:order-1 md:col-start-1' : 'md:col-start-9')}>
        <p className="text-outline font-display text-[clamp(4.5rem,11vw,10rem)] font-bold leading-[0.8] tracking-tight">
          {concept.number}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-label bg-orange px-2 py-1 text-[0.65rem]">{t.concepts.selfInitiated}</span>
          <span className="text-label border-2 border-ink px-2 py-0.5 text-[0.65rem]">{t.conceptKinds[concept.kind]}</span>
        </div>
        <h2 id={`${concept.slug}-title`} className="text-headline mt-5">
          {l(concept.title)}
        </h2>
        <dl className="mt-6 grid grid-cols-2 border-y-2 border-ink">
          <div className="py-2.5">
            <dt className="text-label text-[0.62rem] text-concrete-ink">{t.concepts.medium}</dt>
            <dd className="text-sm">{l(concept.medium)}</dd>
          </div>
          <div className="border-l-2 border-ink py-2.5 pl-3">
            <dt className="text-label text-[0.62rem] text-concrete-ink">{t.common.year}</dt>
            <dd className="font-mono text-sm">{concept.year}</dd>
          </div>
        </dl>
        <p className="mt-6 text-[1.05rem] leading-relaxed">{l(concept.description)}</p>
        {concept.placeholder && <PlaceholderBadge className="mt-5 self-start" />}
      </Reveal>
    </article>
  )
}
