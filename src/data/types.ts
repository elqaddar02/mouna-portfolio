export type Lang = 'en' | 'fr'
export const LANGS: readonly Lang[] = ['en', 'fr']

/** A string supplied in every supported language. */
export type Localized = Record<Lang, string>

export type ProjectCategory = 'residential' | 'cultural' | 'public' | 'urban' | 'interior' | 'experimental'

/** The kind of academic brief the project answered. */
export type ProjectFormat = 'studio' | 'competition' | 'workshop' | 'thesis'

export type ImageType =
  | 'cover'
  | 'render'
  | 'photo'
  | 'site'
  | 'sketch'
  | 'diagram'
  | 'model'
  | 'plan'
  | 'section'
  | 'elevation'
  | 'drawing'

export interface ArchImage {
  src: string
  /** Optional responsive sources, e.g. "img-800.webp 800w, img-1600.webp 1600w". */
  srcSet?: string
  alt: Localized
  caption?: Localized
  imageType: ImageType
  /** Intrinsic pixel size, measured at build time by scripts/content.mjs — prevents layout shift. */
  width: number
  height: number
}

export interface MetaEntry {
  label: Localized
  value: Localized
}

export interface Project {
  id: string
  slug: string
  /** Display number, e.g. "001". */
  number: string
  title: Localized
  subtitle: Localized
  category: ProjectCategory
  year: string
  location: Localized
  format: ProjectFormat
  coverImage: ArchImage
  thumbnailImage: ArchImage
  shortDescription: Localized
  fullDescription: Localized
  architecturalConcept: Localized
  siteAnalysis: Localized
  designProcess: Localized
  /** Renders, photos, site, sketches, diagrams and model images. */
  gallery: ArchImage[]
  /** Plans, sections, elevations and technical details. */
  drawings: ArchImage[]
  /** Extra fact-sheet rows (studio, tutor, programme, area…). */
  meta?: MetaEntry[]
  featured: boolean
  order: number
  /** True while the entry is template content awaiting real information. */
  placeholder?: boolean
}

export interface SoftwareGroup {
  category: Localized
  /** Software names. Leave empty until confirmed. */
  tools: string[]
}

export interface EducationEntry {
  period: Localized
  institution: Localized
  programme: Localized
  note?: Localized
}

export interface LanguageSkill {
  name: Localized
  level: Localized
}

export interface Profile {
  name: string
  role: Localized
  shortBio: Localized
  longBio: Localized[]
  philosophy: Localized[]
  interests: Localized[]
  education: EducationEntry[]
  skills: Localized[]
  software: SoftwareGroup[]
  languages: LanguageSkill[]
  /** Optional portrait for the About page; null shows the name and role instead. */
  portrait: ArchImage | null
  /** Large homepage image (landscape). */
  heroImage: ArchImage
  /** Slug of the project the homepage image opens; null for no link. */
  heroProject: string | null
  contact: {
    /** Set to null until provided — the UI then shows a "to be added" note instead of a dead link. */
    email: string | null
    linkedin: string | null
    instagram: string | null
    location: Localized | null
  }
  /** Path to a PDF in /public, e.g. "/cv/mouna-elqaddar-cv.pdf". Null hides the download link. */
  cvUrl: string | null
  placeholder?: boolean
}
