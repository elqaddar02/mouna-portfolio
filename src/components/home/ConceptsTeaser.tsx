import { Link } from 'react-router-dom'
import { sortedConcepts } from '../../data/concepts'
import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'
import { ArrowLink } from '../ui/ArrowLink'
import { Figure } from '../ui/Figure'
import { Label } from '../ui/Label'
import { Lines } from '../ui/MultilineHeading'
import { Reveal } from '../ui/Reveal'

const OFFSETS = ['md:mt-0', 'md:mt-24', 'md:mt-10']

export function ConceptsTeaser() {
  const { t, l } = useI18n()
  const items = sortedConcepts.slice(0, 3)

  return (
    <section aria-labelledby="concepts-title" className="bg-ink py-20 text-paper md:py-28">
      <div className="frame grid-12 gap-y-8">
        <div className="col-span-4 md:col-span-7">
          <Label index={3} className="text-paper/70">
            {t.home.conceptsLabel}
          </Label>
          <h2 id="concepts-title" className="text-display mt-6 uppercase">
            <Lines text={t.home.conceptsHeading} />
          </h2>
        </div>
        <div className="col-span-4 flex flex-col justify-end gap-8 md:col-span-4 md:col-start-9">
          <p className="text-lg leading-relaxed text-paper/85">{t.home.conceptsLead}</p>
          <div>
            <ArrowLink to="/concepts" variant="inverse">
              {t.home.conceptsCta}
            </ArrowLink>
          </div>
        </div>
      </div>

      <ul className="frame grid-12 mt-16 gap-y-12 md:mt-24">
        {items.map((concept, i) => (
          <Reveal as="li" key={concept.id} delay={i * 0.08} className={cn('col-span-4', OFFSETS[i])}>
            <Link to={`/concepts#${concept.slug}`} className="group block">
              <div className="border-2 border-paper">
                <Figure
                  image={concept.images[0]!}
                  aspect="4 / 5"
                  imgClassName="transition-transform duration-[900ms] ease-arch group-hover:scale-[1.045]"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <span className="text-label text-[0.7rem] text-orange">{concept.number}</span>
                <span className="text-label text-[0.65rem] text-paper/60">{t.concepts.selfInitiated}</span>
              </div>
              <h3 className="text-title mt-2 transition-colors group-hover:text-orange">{l(concept.title)}</h3>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
