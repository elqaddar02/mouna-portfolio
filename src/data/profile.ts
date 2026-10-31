/**
 * PROFILE — personal information shown on Home, About and Contact.
 *
 * Only the name and role are confirmed. Everything else is a labelled
 * placeholder: replace it with real information, never with guesses.
 * Contact fields set to `null` render as "to be added" (no dead links).
 */
import { image } from './images'
import type { Localized, Profile } from './types'

const L = (en: string, fr: string): Localized => ({ en, fr })
const TBA = L('To be added', 'À compléter')

export const profile: Profile = {
  name: 'Mouna Elqaddar',
  role: L('Architecture Student', 'Élève architecte'),

  shortBio: L(
    'Placeholder biography. One or two sentences on how Mouna approaches architecture — the questions, places and materials that drive the work.',
    'Biographie provisoire. Une ou deux phrases sur l’approche de Mouna — les questions, les lieux et les matières qui animent son travail.',
  ),
  longBio: [
    L(
      'Placeholder. Introduce Mouna’s path into architecture and the current place of study. Keep it factual and short.',
      'Provisoire. Présenter le parcours de Mouna vers l’architecture et son école actuelle. Rester factuel et concis.',
    ),
    L(
      'Placeholder. Describe what Mouna looks for in a project: the relationship between space, material, light and the people who use it.',
      'Provisoire. Décrire ce qu’elle recherche dans un projet : la relation entre espace, matière, lumière et usagers.',
    ),
  ],
  philosophy: [
    L(
      'Placeholder statement. A short design principle in Mouna’s own words.',
      'Énoncé provisoire. Un principe de conception court, avec les mots de Mouna.',
    ),
    L(
      'Placeholder statement. A second principle — for example about context, material or the human scale.',
      'Énoncé provisoire. Un second principe — par exemple sur le contexte, la matière ou l’échelle humaine.',
    ),
    L(
      'Placeholder statement. A third principle about process: drawing, model-making or research.',
      'Énoncé provisoire. Un troisième principe sur le processus : dessin, maquette ou recherche.',
    ),
  ],
  interests: [
    L('Interest 01 — to be defined', 'Intérêt 01 — à définir'),
    L('Interest 02 — to be defined', 'Intérêt 02 — à définir'),
    L('Interest 03 — to be defined', 'Intérêt 03 — à définir'),
    L('Interest 04 — to be defined', 'Intérêt 04 — à définir'),
  ],
  education: [
    {
      period: '20XX — present',
      institution: L('School of architecture — to be added', 'École d’architecture — à compléter'),
      programme: L('Architecture degree — programme to be added', 'Diplôme d’architecture — cursus à compléter'),
    },
    {
      period: '20XX',
      institution: TBA,
      programme: L('Previous studies / diploma — to be added', 'Études / diplôme précédents — à compléter'),
    },
  ],
  skills: [
    L('Skill — to be added', 'Compétence — à compléter'),
    L('Skill — to be added', 'Compétence — à compléter'),
    L('Skill — to be added', 'Compétence — à compléter'),
    L('Skill — to be added', 'Compétence — à compléter'),
  ],
  /* Fill `tools` with software names once confirmed (e.g. a CAD tool under CAD). */
  software: [
    { category: L('CAD & technical drawing', 'DAO & dessin technique'), tools: [] },
    { category: L('3D modelling', 'Modélisation 3D'), tools: [] },
    { category: L('Rendering', 'Rendu'), tools: [] },
    { category: L('Graphic design', 'Graphisme'), tools: [] },
    { category: L('BIM', 'BIM'), tools: [] },
  ],
  languages: [
    { name: L('English', 'Anglais'), level: TBA },
    { name: L('French', 'Français'), level: TBA },
  ],

  portrait: image('/images/profile/portrait.svg', 'photo', '4:5', L('Portrait of Mouna Elqaddar (placeholder)', 'Portrait de Mouna Elqaddar (provisoire)')),
  heroImage: image('/images/profile/hero.svg', 'render', '4:5', L('Featured architectural image (placeholder)', 'Image architecturale principale (provisoire)')),
  heroImageWide: image('/images/profile/hero-wide.svg', 'render', '16:9', L('Featured architectural image (placeholder)', 'Image architecturale principale (provisoire)')),

  contact: {
    email: null,
    linkedin: null,
    instagram: null,
    location: null,
  },
  cvUrl: null,
  placeholder: true,
}
