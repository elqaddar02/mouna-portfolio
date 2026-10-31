#!/usr/bin/env node
/**
 * Generates public/admin/config.yml, the configuration of the content editor
 * (Sveltia CMS) served at /admin.
 *
 * The choice lists come from the same ENUMS that scripts/content.mjs validates,
 * and the labels from the French UI dictionary, so the editor can never offer
 * a value the build would reject. Editor labels are in French for Mouna.
 *
 * It runs locally (Node ≥ 22.18, which can import the TypeScript sources) and
 * its output is committed, so the deployment build never needs it.
 * Edit the settings below, then run: npm run cms-config
 */
import { writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ENUMS } from './content.mjs'
import { SITE_URL } from '../src/config/site.ts'
import { fr } from '../src/i18n/fr.ts'

/* ── Deployment settings ─────────────────────────────────────────── */
const REPO = 'elqaddar02/mouna-portfolio'
const BRANCH = 'main'
/** URL of the Sveltia CMS Authenticator worker on Cloudflare (see DEPLOY.md, step 3). */
const AUTH_BASE_URL = 'https://sveltia-cms-auth.mouadelqaddar.workers.dev'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'admin', 'config.yml')

/* ── Field helpers ───────────────────────────────────────────────── */

/** A bilingual field, stored as { en, fr } — the shape the site reads. */
const bi = (name, label, { long = false, hint, required = false } = {}) => ({
  name,
  label,
  widget: 'object',
  required,
  ...(hint ? { hint } : {}),
  fields: [
    { name: 'fr', label: 'Français', widget: long ? 'text' : 'string', required },
    { name: 'en', label: 'English', widget: long ? 'text' : 'string', required: false },
  ],
})

const options = (values, labels) => values.map((value) => ({ value, label: labels[value] ?? value }))

const IMAGE_TYPE_LABELS = {
  render: 'Visualisation / rendu → « Visualisations finales »',
  photo: 'Photographie → « Visualisations finales »',
  site: 'Analyse de site → « Analyse de site »',
  sketch: 'Croquis → « Croquis & diagrammes »',
  diagram: 'Diagramme → « Croquis & diagrammes »',
  model: 'Maquette → « Maquettes »',
  plan: 'Plan → « Plans »',
  section: 'Coupe → « Coupes & façades »',
  elevation: 'Façade / élévation → « Coupes & façades »',
  drawing: 'Dessin technique / détail → « Dessins techniques »',
}
const IMAGE_TYPES = ENUMS.imageType.filter((t) => t !== 'cover')

const ALT_HINT = 'Décrire ce que montre l’image, pour les personnes malvoyantes et le référencement.'

/** A single image with its description. */
const imageObject = (name, label, { required = true, hint } = {}) => ({
  name,
  label,
  widget: 'object',
  required,
  ...(hint ? { hint } : {}),
  fields: [
    { name: 'src', label: 'Image', widget: 'image', required, choose_url: false },
    bi('alt', 'Description de l’image', { hint: ALT_HINT }),
  ],
})

/** A list of typed, captioned images. */
const imageList = (name, label, hint) => ({
  name,
  label,
  widget: 'list',
  required: false,
  hint,
  summary: '{{fields.caption.fr}}',
  thumbnail: 'src',
  collapsed: 'auto',
  add_to_top: false,
  fields: [
    { name: 'src', label: 'Image', widget: 'image', choose_url: false },
    { name: 'imageType', label: 'Type d’image (et section où elle apparaît)', widget: 'select', options: options(IMAGE_TYPES, IMAGE_TYPE_LABELS), default: 'render' },
    bi('caption', 'Légende', { hint: 'Affichée sous l’image et dans la galerie, ex. « Plan du rez-de-chaussée — 1:200 ».' }),
    bi('alt', 'Description de l’image', { hint: ALT_HINT }),
  ],
})

const textList = (name, label, itemLabel, { long = false, hint } = {}) => ({
  name,
  label,
  widget: 'list',
  required: false,
  ...(hint ? { hint } : {}),
  summary: '{{fields.fr}}',
  fields: [
    { name: 'fr', label: `${itemLabel} — Français`, widget: long ? 'text' : 'string' },
    { name: 'en', label: `${itemLabel} — English`, widget: long ? 'text' : 'string', required: false },
  ],
})

const slugField = (example) => ({
  name: 'slug',
  label: 'Identifiant (adresse de la page)',
  widget: 'string',
  hint: `Minuscules, chiffres et tirets, ex. « ${example} ». Ne pas modifier après publication : l’adresse changerait.`,
  pattern: ['^[a-z0-9]+(-[a-z0-9]+)*$', 'Uniquement des minuscules, des chiffres et des tirets (sans accents ni espaces).'],
})

const placeholderField = {
  name: 'placeholder',
  label: 'Contenu provisoire',
  widget: 'boolean',
  required: false,
  default: false,
  hint: 'Affiche le badge « Provisoire ». À décocher une fois le contenu réel saisi.',
}

/* ── Collections ─────────────────────────────────────────────────── */

const projects = {
  name: 'projects',
  label: 'Projets académiques',
  label_singular: 'Projet',
  description: 'Projets universitaires affichés dans « Projets ». Le travail personnel va dans « Concepts ».',
  folder: 'content/projects',
  format: 'json',
  extension: 'json',
  create: true,
  delete: true,
  identifier_field: 'slug',
  summary: '{{number}} — {{title.fr}}',
  sortable_fields: ['order', 'number', 'year'],
  media_folder: '/public/images/projects',
  public_folder: '/images/projects',
  fields: [
    slugField('bibliotheque-des-berges'),
    { name: 'number', label: 'Numéro', widget: 'string', hint: 'Affiché sur le site, ex. 001, 002…' },
    { name: 'order', label: 'Ordre d’affichage', widget: 'number', value_type: 'int', required: false, default: 10, hint: 'Les plus petits numéros apparaissent en premier.' },
    { name: 'featured', label: 'Afficher sur la page d’accueil', widget: 'boolean', required: false, default: true },
    placeholderField,
    bi('title', 'Titre', { required: true }),
    bi('subtitle', 'Sous-titre', { hint: 'Une ligne : la commande ou l’idée du projet.' }),
    { name: 'category', label: 'Catégorie', widget: 'select', options: options(ENUMS.category, fr.categories) },
    { name: 'format', label: 'Format', widget: 'select', options: options(ENUMS.format, fr.formats), default: 'studio' },
    { name: 'year', label: 'Année', widget: 'string', required: false, hint: 'ex. 2025 ou 2024–2025' },
    bi('location', 'Lieu'),
    imageObject('cover', 'Image de couverture', { hint: 'Grande image horizontale en haut de la page du projet.' }),
    imageObject('thumbnail', 'Vignette (optionnelle)', { required: false, hint: 'Image verticale pour les grilles. Si vide, la couverture est utilisée.' }),
    bi('shortDescription', 'Résumé court', { long: true, hint: 'Deux lignes, affichées sur les cartes de projet.' }),
    bi('fullDescription', 'Présentation', { long: true }),
    bi('architecturalConcept', 'Concept architectural', { long: true }),
    bi('siteAnalysis', 'Analyse de site', { long: true }),
    bi('designProcess', 'Développement du projet', { long: true }),
    imageList('images', 'Images du projet', 'Le « type » de chaque image décide de la section où elle s’affiche. L’ordre de la liste est l’ordre d’affichage.'),
    {
      name: 'meta',
      label: 'Fiche technique (lignes supplémentaires)',
      widget: 'list',
      required: false,
      hint: 'ex. Atelier, Encadrant(s), Programme, Surface, Durée. Les lignes vides sont masquées.',
      summary: '{{fields.label.fr}} : {{fields.value.fr}}',
      fields: [bi('label', 'Intitulé'), bi('value', 'Valeur')],
    },
  ],
}

const concepts = {
  name: 'concepts',
  label: 'Concepts personnels',
  label_singular: 'Concept',
  description: 'Explorations personnelles, séparées des projets académiques.',
  folder: 'content/concepts',
  format: 'json',
  extension: 'json',
  create: true,
  delete: true,
  identifier_field: 'slug',
  summary: '{{number}} — {{title.fr}}',
  sortable_fields: ['order', 'number'],
  media_folder: '/public/images/concepts',
  public_folder: '/images/concepts',
  fields: [
    slugField('etude-de-lumiere'),
    { name: 'number', label: 'Numéro', widget: 'string', hint: 'ex. C.01' },
    { name: 'order', label: 'Ordre d’affichage', widget: 'number', value_type: 'int', required: false, default: 10 },
    placeholderField,
    bi('title', 'Titre', { required: true }),
    { name: 'kind', label: 'Type d’exploration', widget: 'select', options: options(ENUMS.conceptKind, fr.conceptKinds) },
    { name: 'year', label: 'Année', widget: 'string', required: false },
    bi('medium', 'Médium', { hint: 'ex. Maquette, croquis, dessin numérique' }),
    bi('description', 'Description', { long: true }),
    { ...imageList('images', 'Images', 'Au moins une image. La première est la plus grande ; la deuxième se superpose à elle.'), required: true, min: 1 },
  ],
}

const profile = {
  name: 'settings',
  label: 'Profil & contact',
  files: [
    {
      name: 'profile',
      label: 'Profil, biographie et contact',
      file: 'content/profile.json',
      format: 'json',
      media_folder: '/public/images/profile',
      public_folder: '/images/profile',
      fields: [
        { name: 'name', label: 'Nom', widget: 'string' },
        bi('role', 'Statut', { required: true }),
        placeholderField,
        bi('shortBio', 'Biographie courte (accueil)', { long: true }),
        textList('longBio', 'Biographie (page À propos)', 'Paragraphe', { long: true }),
        textList('interests', 'Intérêts architecturaux', 'Intérêt'),
        {
          name: 'education',
          label: 'Formation',
          widget: 'list',
          required: false,
          summary: '{{fields.period.fr}} — {{fields.institution.fr}}',
          fields: [bi('period', 'Période', { hint: 'ex. 2022 — aujourd’hui' }), bi('institution', 'Établissement'), bi('programme', 'Cursus / diplôme'), bi('note', 'Note (optionnelle)')],
        },
        textList('philosophy', 'Démarche', 'Principe', { long: true }),
        textList('skills', 'Compétences', 'Compétence'),
        {
          name: 'software',
          label: 'Logiciels',
          widget: 'list',
          required: false,
          summary: '{{fields.category.fr}}',
          fields: [
            bi('category', 'Catégorie', { hint: 'ex. DAO & dessin technique, Modélisation 3D, Rendu, Graphisme, BIM' }),
            { name: 'tools', label: 'Logiciels', widget: 'list', required: false, hint: 'Un logiciel par élément.' },
          ],
        },
        {
          name: 'languages',
          label: 'Langues',
          widget: 'list',
          required: false,
          summary: '{{fields.name.fr}} — {{fields.level.fr}}',
          fields: [bi('name', 'Langue'), bi('level', 'Niveau')],
        },
        imageObject('heroImage', 'Image principale (accueil)', { hint: 'Format vertical conseillé (4:5).' }),
        imageObject('heroImageWide', 'Image principale — version horizontale (optionnelle)', { required: false }),
        imageObject('portrait', 'Portrait (page À propos)'),
        {
          name: 'contact',
          label: 'Contact',
          widget: 'object',
          required: false,
          hint: 'Les champs vides s’affichent « À compléter » sur le site.',
          fields: [
            { name: 'email', label: 'E-mail', widget: 'string', required: false, pattern: ['^$|^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$', 'Adresse e-mail invalide'] },
            { name: 'linkedin', label: 'LinkedIn (lien complet)', widget: 'string', required: false, pattern: ['^$|^https://', 'Le lien doit commencer par https://'] },
            { name: 'instagram', label: 'Instagram (lien complet)', widget: 'string', required: false, pattern: ['^$|^https://', 'Le lien doit commencer par https://'] },
            bi('location', 'Ville / pays'),
          ],
        },
        {
          name: 'cvUrl',
          label: 'CV (PDF)',
          widget: 'file',
          required: false,
          accept: 'application/pdf',
          choose_url: false,
          media_folder: '/public/cv',
          public_folder: '/cv',
          hint: 'Si vide, le site indique « CV disponible sur demande ».',
        },
      ],
    },
  ],
}

/* ── Global configuration ────────────────────────────────────────── */

const config = {
  backend: { name: 'github', repo: REPO, branch: BRANCH, base_url: AUTH_BASE_URL },
  site_url: SITE_URL,
  display_url: SITE_URL,
  app_title: 'M/E. — Éditeur du portfolio',
  logo_url: '/favicon.svg',
  media_folder: '/public/images/uploads',
  public_folder: '/images/uploads',
  media_libraries: {
    default: {
      config: {
        max_file_size: 30_000_000,
        slugify_filename: true,
        // Uploaded photos are converted to WebP and scaled down so large renders never slow the site.
        transformations: { raster_image: { format: 'webp', quality: 85, width: 2800, height: 2800 } },
      },
    },
  },
  collections: [projects, concepts, profile],
}

const header = `# GENERATED by scripts/cms-config.mjs — do not edit by hand; run \`npm run cms-config\`.
# Content editor (Sveltia CMS) configuration. JSON is valid YAML.
`
writeFileSync(OUT, header + JSON.stringify(config, null, 2) + '\n')
console.log('cms: public/admin/config.yml')
