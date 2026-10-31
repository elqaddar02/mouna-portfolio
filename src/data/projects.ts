/**
 * PROJECT ARCHIVE — single source of truth for all project pages.
 *
 * Every entry below is TEMPLATE CONTENT (`placeholder: true`). Replace the
 * text and images with Mouna's real projects, then remove the flag.
 * Project 001 is written out in full as a reference; the others reuse the
 * placeholder helpers to stay short. Adding a project = adding an object
 * here. No component needs to change.
 */
import { image } from './images'
import type { ArchImage, Localized, MetaEntry, Project } from './types'

const TBA: Localized = { en: 'To be added', fr: 'À compléter' }

const ph = {
  short: {
    en: 'Placeholder summary. In two lines, describe the brief, the programme and the central architectural idea.',
    fr: 'Résumé provisoire. En deux lignes, décrire le programme, le contexte et l’idée architecturale centrale.',
  },
  full: {
    en: 'Placeholder overview. Introduce the project: the brief, the site, the programme and the question the design sets out to answer. Keep it to one or two short paragraphs.',
    fr: 'Présentation provisoire. Introduire le projet : la commande, le site, le programme et la question à laquelle le projet cherche à répondre. Un ou deux paragraphes courts suffisent.',
  },
  concept: {
    en: 'Placeholder concept. Explain the generating idea — the spatial, material or formal strategy that organises the project — and how it responds to the brief.',
    fr: 'Concept provisoire. Expliquer l’idée génératrice — la stratégie spatiale, matérielle ou formelle qui organise le projet — et sa réponse à la commande.',
  },
  site: {
    en: 'Placeholder site analysis. Summarise the context: orientation, climate, topography, access, urban fabric and the constraints or opportunities identified.',
    fr: 'Analyse de site provisoire. Résumer le contexte : orientation, climat, topographie, accès, tissu urbain, contraintes et potentiels identifiés.',
  },
  process: {
    en: 'Placeholder design development. Describe how the scheme evolved — from first sketches and models to the final proposal — and the key decisions along the way.',
    fr: 'Développement provisoire. Décrire l’évolution du projet — des premières esquisses et maquettes à la proposition finale — et les décisions clés.',
  },
}

const L = (en: string, fr: string): Localized => ({ en, fr })

const standardMeta: MetaEntry[] = [
  { label: L('Studio / Course', 'Atelier / Cours'), value: TBA },
  { label: L('Tutor(s)', 'Encadrant(s)'), value: TBA },
  { label: L('Programme', 'Programme'), value: TBA },
  { label: L('Site area', 'Surface du site'), value: TBA },
  { label: L('Duration', 'Durée'), value: TBA },
]

/** Placeholder gallery with the standard set of image slots. */
function placeholderGallery(dir: string): ArchImage[] {
  const p = `/images/projects/${dir}`
  return [
    image(`${p}/site.svg`, 'site', '3:2', L('Site analysis drawing (placeholder)', 'Analyse de site (provisoire)'), L('Site analysis — contours, access and plot boundary.', 'Analyse de site — courbes de niveau, accès et limite de parcelle.')),
    image(`${p}/concept-diagram.svg`, 'diagram', '1:1', L('Concept diagram (placeholder)', 'Diagramme conceptuel (provisoire)'), L('Concept diagram — programme relationships.', 'Diagramme conceptuel — relations programmatiques.')),
    image(`${p}/sketch-01.svg`, 'sketch', '4:3', L('Perspective sketch (placeholder)', 'Croquis en perspective (provisoire)'), L('Early perspective sketch.', 'Croquis de perspective initial.')),
    image(`${p}/sketch-02.svg`, 'sketch', '3:4', L('Process sketch (placeholder)', 'Croquis de recherche (provisoire)'), L('Process sketch.', 'Croquis de recherche.')),
    image(`${p}/model-01.svg`, 'model', '4:5', L('Physical massing model (placeholder)', 'Maquette de volumétrie (provisoire)'), L('Massing model.', 'Maquette de volumétrie.')),
    image(`${p}/model-02.svg`, 'model', '3:2', L('Physical site model (placeholder)', 'Maquette de site (provisoire)'), L('Site model.', 'Maquette de site.')),
    image(`${p}/render-01.svg`, 'render', '16:9', L('Exterior visualisation (placeholder)', 'Visualisation extérieure (provisoire)'), L('Final exterior visualisation.', 'Visualisation extérieure finale.')),
    image(`${p}/render-02.svg`, 'render', '3:4', L('Interior visualisation (placeholder)', 'Visualisation intérieure (provisoire)'), L('Final interior visualisation.', 'Visualisation intérieure finale.')),
  ]
}

function placeholderDrawings(dir: string): ArchImage[] {
  const p = `/images/projects/${dir}`
  return [
    image(`${p}/plan-ground.svg`, 'plan', '4:3', L('Ground floor plan (placeholder)', 'Plan du rez-de-chaussée (provisoire)'), L('Ground floor plan — 1:200.', 'Plan du rez-de-chaussée — 1:200.')),
    image(`${p}/plan-upper.svg`, 'plan', '4:3', L('Upper floor plan (placeholder)', 'Plan d’étage (provisoire)'), L('Upper floor plan — 1:200.', 'Plan d’étage — 1:200.')),
    image(`${p}/section.svg`, 'section', '21:9', L('Longitudinal section (placeholder)', 'Coupe longitudinale (provisoire)'), L('Longitudinal section AA.', 'Coupe longitudinale AA.')),
    image(`${p}/elevation.svg`, 'elevation', '21:9', L('Main elevation (placeholder)', 'Façade principale (provisoire)'), L('Main elevation.', 'Façade principale.')),
    image(`${p}/detail.svg`, 'drawing', '1:1', L('Construction detail (placeholder)', 'Détail constructif (provisoire)'), L('Wall build-up detail — 1:20.', 'Détail de paroi — 1:20.')),
  ]
}

const cover = (dir: string) =>
  image(`/images/projects/${dir}/cover.svg`, 'cover', '16:9', L('Project cover image (placeholder)', 'Image de couverture (provisoire)'))
const thumb = (dir: string) =>
  image(`/images/projects/${dir}/thumb.svg`, 'render', '4:5', L('Project thumbnail (placeholder)', 'Vignette du projet (provisoire)'))

export const projects: Project[] = [
  /* ── 001 · full reference entry ─────────────────────────────── */
  {
    id: 'project-001',
    slug: 'project-001',
    number: '001',
    title: L('Project 01', 'Projet 01'),
    subtitle: L('Placeholder — replace with the project title and brief', 'Provisoire — remplacer par le titre et la commande du projet'),
    category: 'residential',
    year: '20XX',
    location: TBA,
    projectType: 'academic',
    format: 'studio',
    coverImage: cover('project-001'),
    thumbnailImage: thumb('project-001'),
    shortDescription: ph.short,
    fullDescription: ph.full,
    architecturalConcept: ph.concept,
    siteAnalysis: ph.site,
    designProcess: ph.process,
    gallery: [
      image('/images/projects/project-001/site.svg', 'site', '3:2',
        L('Site analysis drawing (placeholder)', 'Analyse de site (provisoire)'),
        L('Site analysis — contours, access and plot boundary.', 'Analyse de site — courbes de niveau, accès et limite de parcelle.')),
      image('/images/projects/project-001/concept-diagram.svg', 'diagram', '1:1',
        L('Concept diagram (placeholder)', 'Diagramme conceptuel (provisoire)'),
        L('Concept diagram — programme relationships.', 'Diagramme conceptuel — relations programmatiques.')),
      image('/images/projects/project-001/sketch-01.svg', 'sketch', '4:3',
        L('Perspective sketch (placeholder)', 'Croquis en perspective (provisoire)'),
        L('Early perspective sketch.', 'Croquis de perspective initial.')),
      image('/images/projects/project-001/sketch-02.svg', 'sketch', '3:4',
        L('Process sketch (placeholder)', 'Croquis de recherche (provisoire)'),
        L('Process sketch.', 'Croquis de recherche.')),
      image('/images/projects/project-001/model-01.svg', 'model', '4:5',
        L('Physical massing model (placeholder)', 'Maquette de volumétrie (provisoire)'),
        L('Massing model.', 'Maquette de volumétrie.')),
      image('/images/projects/project-001/model-02.svg', 'model', '3:2',
        L('Physical site model (placeholder)', 'Maquette de site (provisoire)'),
        L('Site model.', 'Maquette de site.')),
      image('/images/projects/project-001/render-01.svg', 'render', '16:9',
        L('Exterior visualisation (placeholder)', 'Visualisation extérieure (provisoire)'),
        L('Final exterior visualisation.', 'Visualisation extérieure finale.')),
      image('/images/projects/project-001/render-02.svg', 'render', '3:4',
        L('Interior visualisation (placeholder)', 'Visualisation intérieure (provisoire)'),
        L('Final interior visualisation.', 'Visualisation intérieure finale.')),
    ],
    drawings: placeholderDrawings('project-001'),
    meta: standardMeta,
    featured: true,
    order: 1,
    placeholder: true,
  },

  /* ── 002 ─────────────────────────────────────────────────────── */
  {
    id: 'project-002',
    slug: 'project-002',
    number: '002',
    title: L('Project 02', 'Projet 02'),
    subtitle: L('Placeholder — replace with the project title and brief', 'Provisoire — remplacer par le titre et la commande du projet'),
    category: 'cultural',
    year: '20XX',
    location: TBA,
    projectType: 'academic',
    format: 'studio',
    coverImage: cover('project-002'),
    thumbnailImage: thumb('project-002'),
    shortDescription: ph.short,
    fullDescription: ph.full,
    architecturalConcept: ph.concept,
    siteAnalysis: ph.site,
    designProcess: ph.process,
    gallery: placeholderGallery('project-002'),
    drawings: placeholderDrawings('project-002'),
    meta: standardMeta,
    featured: true,
    order: 2,
    placeholder: true,
  },

  /* ── 003 ─────────────────────────────────────────────────────── */
  {
    id: 'project-003',
    slug: 'project-003',
    number: '003',
    title: L('Project 03', 'Projet 03'),
    subtitle: L('Placeholder — replace with the project title and brief', 'Provisoire — remplacer par le titre et la commande du projet'),
    category: 'urban',
    year: '20XX',
    location: TBA,
    projectType: 'academic',
    format: 'workshop',
    coverImage: cover('project-003'),
    thumbnailImage: thumb('project-003'),
    shortDescription: ph.short,
    fullDescription: ph.full,
    architecturalConcept: ph.concept,
    siteAnalysis: ph.site,
    designProcess: ph.process,
    gallery: placeholderGallery('project-003'),
    drawings: placeholderDrawings('project-003'),
    meta: standardMeta,
    featured: true,
    order: 3,
    placeholder: true,
  },

  /* ── 004 ─────────────────────────────────────────────────────── */
  {
    id: 'project-004',
    slug: 'project-004',
    number: '004',
    title: L('Project 04', 'Projet 04'),
    subtitle: L('Placeholder — replace with the project title and brief', 'Provisoire — remplacer par le titre et la commande du projet'),
    category: 'interior',
    year: '20XX',
    location: TBA,
    projectType: 'personal',
    format: 'self-initiated',
    coverImage: cover('project-004'),
    thumbnailImage: thumb('project-004'),
    shortDescription: ph.short,
    fullDescription: ph.full,
    architecturalConcept: ph.concept,
    siteAnalysis: ph.site,
    designProcess: ph.process,
    gallery: placeholderGallery('project-004'),
    drawings: placeholderDrawings('project-004'),
    meta: standardMeta,
    featured: true,
    order: 4,
    placeholder: true,
  },

  /* ── 005 ─────────────────────────────────────────────────────── */
  {
    id: 'project-005',
    slug: 'project-005',
    number: '005',
    title: L('Project 05', 'Projet 05'),
    subtitle: L('Placeholder — replace with the project title and brief', 'Provisoire — remplacer par le titre et la commande du projet'),
    category: 'public',
    year: '20XX',
    location: TBA,
    projectType: 'personal',
    format: 'competition',
    coverImage: cover('project-005'),
    thumbnailImage: thumb('project-005'),
    shortDescription: ph.short,
    fullDescription: ph.full,
    architecturalConcept: ph.concept,
    siteAnalysis: ph.site,
    designProcess: ph.process,
    gallery: placeholderGallery('project-005'),
    drawings: placeholderDrawings('project-005'),
    meta: standardMeta,
    featured: false,
    order: 5,
    placeholder: true,
  },
]

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order)
export const featuredProjects = sortedProjects.filter((p) => p.featured)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
