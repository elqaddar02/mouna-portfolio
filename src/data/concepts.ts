/**
 * PERSONAL CONCEPTS — self-initiated explorations, kept apart from the
 * project archive so their origin is always clear.
 *
 * All entries are TEMPLATE CONTENT (`placeholder: true`): each one marks a
 * slot for a kind of exploration, not a finished piece of work.
 */
import { image } from './images'
import type { Concept, Localized } from './types'

const L = (en: string, fr: string): Localized => ({ en, fr })

const desc = L(
  'Placeholder. Describe the question behind this exploration, the medium used and what it revealed. Two or three sentences.',
  'Provisoire. Décrire la question à l’origine de cette exploration, le médium employé et ce qu’elle a révélé. Deux ou trois phrases.',
)

const c = (id: string) => `/images/concepts/${id}`

export const concepts: Concept[] = [
  {
    id: 'concept-01',
    slug: 'concept-01',
    number: 'C.01',
    title: L('Spatial Experiment', 'Expérimentation spatiale'),
    kind: 'space',
    year: '20XX',
    medium: L('Sketch & diagram', 'Croquis & diagramme'),
    description: desc,
    images: [
      image(`${c('concept-01')}/01.svg`, 'sketch', '3:4', L('Spatial study sketch (placeholder)', 'Croquis d’étude spatiale (provisoire)'), L('Spatial study.', 'Étude spatiale.')),
      image(`${c('concept-01')}/02.svg`, 'diagram', '1:1', L('Sequence diagram (placeholder)', 'Diagramme de séquence (provisoire)'), L('Sequence diagram.', 'Diagramme de séquence.')),
    ],
    order: 1,
    placeholder: true,
  },
  {
    id: 'concept-02',
    slug: 'concept-02',
    number: 'C.02',
    title: L('Abstract Form', 'Forme abstraite'),
    kind: 'form',
    year: '20XX',
    medium: L('Physical model', 'Maquette physique'),
    description: desc,
    images: [
      image(`${c('concept-02')}/01.svg`, 'model', '4:5', L('Form study model (placeholder)', 'Maquette d’étude formelle (provisoire)'), L('Form study.', 'Étude formelle.')),
      image(`${c('concept-02')}/02.svg`, 'model', '3:2', L('Form study model, second view (placeholder)', 'Maquette d’étude formelle, seconde vue (provisoire)'), L('Second view.', 'Seconde vue.')),
    ],
    order: 2,
    placeholder: true,
  },
  {
    id: 'concept-03',
    slug: 'concept-03',
    number: 'C.03',
    title: L('Material Study', 'Étude de matière'),
    kind: 'material',
    year: '20XX',
    medium: L('Detail drawing', 'Dessin de détail'),
    description: desc,
    images: [
      image(`${c('concept-03')}/01.svg`, 'drawing', '1:1', L('Material layering drawing (placeholder)', 'Dessin de stratification (provisoire)'), L('Material layering.', 'Stratification des matériaux.')),
      image(`${c('concept-03')}/02.svg`, 'section', '21:9', L('Section study (placeholder)', 'Étude en coupe (provisoire)'), L('Section study.', 'Étude en coupe.')),
    ],
    order: 3,
    placeholder: true,
  },
  {
    id: 'concept-04',
    slug: 'concept-04',
    number: 'C.04',
    title: L('Unbuilt Proposal', 'Proposition non construite'),
    kind: 'proposal',
    year: '20XX',
    medium: L('Visualisation', 'Visualisation'),
    description: desc,
    images: [
      image(`${c('concept-04')}/01.svg`, 'render', '16:9', L('Proposal visualisation (placeholder)', 'Visualisation de la proposition (provisoire)'), L('Proposal visualisation.', 'Visualisation de la proposition.')),
      image(`${c('concept-04')}/02.svg`, 'sketch', '4:3', L('Proposal sketch (placeholder)', 'Croquis de la proposition (provisoire)'), L('Early sketch.', 'Croquis initial.')),
    ],
    order: 4,
    placeholder: true,
  },
  {
    id: 'concept-05',
    slug: 'concept-05',
    number: 'C.05',
    title: L('Experimental Diagram', 'Diagramme expérimental'),
    kind: 'diagram',
    year: '20XX',
    medium: L('Diagram & plan', 'Diagramme & plan'),
    description: desc,
    images: [
      image(`${c('concept-05')}/01.svg`, 'diagram', '4:3', L('Experimental diagram (placeholder)', 'Diagramme expérimental (provisoire)'), L('Relational diagram.', 'Diagramme relationnel.')),
      image(`${c('concept-05')}/02.svg`, 'plan', '1:1', L('Plan study (placeholder)', 'Étude en plan (provisoire)'), L('Plan study.', 'Étude en plan.')),
    ],
    order: 5,
    placeholder: true,
  },
  {
    id: 'concept-06',
    slug: 'concept-06',
    number: 'C.06',
    title: L('Sketchbook', 'Carnet de croquis'),
    kind: 'sketch',
    year: '20XX',
    medium: L('Hand drawing', 'Dessin à la main'),
    description: desc,
    images: [
      image(`${c('concept-06')}/01.svg`, 'site', '3:2', L('Landscape observation drawing (placeholder)', 'Relevé de paysage (provisoire)'), L('Landscape observation.', 'Observation du paysage.')),
      image(`${c('concept-06')}/02.svg`, 'sketch', '2:3', L('Sketchbook page (placeholder)', 'Page de carnet (provisoire)'), L('Sketchbook page.', 'Page de carnet.')),
    ],
    order: 6,
    placeholder: true,
  },
]

export const sortedConcepts = [...concepts].sort((a, b) => a.order - b.order)
