# M/E. — Mouna Elqaddar · Architecture Portfolio

Bilingual (EN / FR) architecture portfolio built as an editorial, light-brutalist publication.

**Stack:** React 19 · Vite 8 · TypeScript (strict) · Tailwind CSS v4 · React Router 7 · Motion · Lucide.
Front-end only: no backend, database or authentication.

```bash
npm install
npm run dev        # local development
npm run build      # type-check + production build (also emits sitemap.xml and robots.txt)
npm run preview    # serve the production build
```

---

## ⚠️ Placeholder content

Only the **name** and **role** are real. Everything else is clearly marked template content waiting for real information:

| What | Where | How it shows on the site |
| --- | --- | --- |
| Projects 001–005 | `src/data/projects.ts` | "Placeholder" badge, years shown as `20XX` |
| Concepts C.01–C.06 | `src/data/concepts.ts` | "Placeholder" badge |
| Biography, education, skills, software, languages | `src/data/profile.ts` | "To be added" |
| Email, LinkedIn, Instagram, location, CV | `src/data/profile.ts` → `contact`, `cvUrl` | "To be added" (no dead links) |
| All images | `public/images/**` | SVG drawings stamped **VISUAL PLACEHOLDER** |
| Site domain | `src/config/site.ts` → `SITE_URL` | used in sitemap, canonical and Open Graph URLs |

Remove the `placeholder: true` flag from an entry once its content is real; that also removes its badge.

---

## Editing content

All content lives in typed data files. **No component needs to change** to add, edit or remove work.

### Add a project

Copy the full `project-001` object in `src/data/projects.ts` and change it:

```ts
{
  id: 'project-006',
  slug: 'riverside-library',          // → /works/riverside-library
  number: '006',
  title: { en: 'Riverside Library', fr: 'Bibliothèque des berges' },
  category: 'cultural',               // residential | cultural | public | urban | interior | experimental
  projectType: 'academic',            // academic | personal (the "origin" filter)
  format: 'studio',                   // studio | competition | workshop | thesis | self-initiated
  year: '2025',
  featured: true,                     // shown on the homepage
  order: 6,                           // position in the archive
  gallery: [ /* renders, sketches, diagrams, models, site */ ],
  drawings: [ /* plans, sections, elevations, details */ ],
  // …text fields, each { en, fr }
}
```

The project page builds its sections from the data: **Site analysis, Sketches & diagrams, Technical drawings, Floor plans, Sections & elevations, Physical models, Final visualisations**. Each image goes into a section by its `imageType`. Sections with no text and no images are skipped automatically.

### Images

```
public/images/
  profile/      hero, portrait
  projects/
    project-001/  cover, thumb, site, sketches, models, renders, plans, sections…
  concepts/
  sketches/
  drawings/
```

Use the `image()` helper. For real files, pass the true pixel size so the layout never shifts:

```ts
image('/images/projects/project-006/cover.webp', 'cover', '16:9',
  { en: 'Library seen from the river at dusk', fr: 'La bibliothèque depuis la rivière au crépuscule' },
  { en: 'Final visualisation', fr: 'Visualisation finale' },
  { size: [2400, 1350], placeholder: false })
```

- Prefer **WebP or AVIF**, about 2400 px on the long edge for full-width images. Add a `srcSet` for several sizes.
- `aspectRatio` controls the layout. Drawings are never cropped on project pages.
- Write alt text that describes the image itself, in both languages.

### Contact details and CV

In `src/data/profile.ts`:

```ts
contact: {
  email: 'name@example.com',
  linkedin: 'https://www.linkedin.com/in/…',
  instagram: 'https://www.instagram.com/…',
  location: { en: 'City, Country', fr: 'Ville, Pays' },
},
cvUrl: '/cv/mouna-elqaddar-cv.pdf',   // put the PDF in public/cv/
```

### Interface text

UI strings live in `src/i18n/en.ts` and `src/i18n/fr.ts`. TypeScript enforces that both files have the same keys. A `\n` in a heading marks a deliberate line break.

### Social images

`public/og-image.png` and `public/apple-touch-icon.png` are rendered with the site's fonts:

```bash
node scripts/generate-social.cjs     # needs Playwright + Chromium
npm run placeholders                 # regenerates the SVG placeholders
```

---

## Structure

```
src/
  config/        site URL, navigation
  data/          types.ts · projects.ts · concepts.ts · profile.ts · images.ts
  i18n/          provider, en/fr dictionaries
  hooks/         useDocumentMeta (title/SEO), useLightbox
  components/
    layout/      Header (mobile menu, language switch), Footer, Layout (page transitions)
    home/        Hero, Intro, SelectedWorks, ConceptsTeaser, Closing
    projects/    ProjectCard, FilterGroup, ProjectIndex, ProjectNav
    gallery/     Lightbox, MediaRows
    ui/          Figure, Reveal, Label, ArrowLink, TitleBlock, PlaceholderBadge…
  pages/         Home · Works · ProjectDetail · Concepts · About · Contact · NotFound (lazy-loaded)
```

**Design tokens** (`src/index.css`): paper `#F1EFE8`, ink `#171717`, orange `#F15A24` (large or decorative uses, and on dark backgrounds), orange-deep `#B93F14` (orange text on paper, WCAG AA), concrete `#B8B5AD`. Type: Space Grotesk (display), Inter (body), IBM Plex Mono (annotations).

## Behaviour notes

- The language choice is stored in `localStorage` and applied to `<html lang>`, page titles and meta tags.
- Works filters live in the URL (`/works?category=cultural&origin=academic&view=index`), so filtered views can be shared.
- Gallery: arrow keys, swipe, Esc, focus trap and focus return.
- All animation respects `prefers-reduced-motion`.

## Deployment

It's a single-page app, so the host must send unknown paths to `index.html`. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included. Before going live, set `SITE_URL` in `src/config/site.ts` and the matching URLs in `index.html`.
