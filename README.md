# M.ELQADD’ARTchitects — Mouna Elqaddar · Architecture Portfolio

Bilingual (EN / FR) architecture portfolio, built as an editorial, light-brutalist publication, with a built-in content editor at `/admin`.

**Stack:** React 19 · Vite 8 · TypeScript (strict) · Tailwind CSS v4 · React Router 7 · Motion · Lucide · Sveltia CMS (editor).
There is no backend or database. Content is stored as JSON files in this repository, and the site is hosted on Cloudflare Pages.

```bash
npm install
npm run dev          # local development; rebuilds content when /content changes
npm run build        # content check + type-check + production build (also sitemap.xml, robots.txt)
npm run preview      # serve the production build
npm run cms-config   # regenerate public/admin/config.yml after changing scripts/cms-config.mjs
```

- **Going live:** see **[DEPLOY.md](DEPLOY.md)** (Cloudflare Pages and editor login, ~20 min, free).
- **Editing content:** Mouna's guide, in French, is **[GUIDE-EDITEUR.md](GUIDE-EDITEUR.md)**.

---

## ⚠️ Placeholder content

Only the **name** and **role** are real. Everything else is clearly marked template content waiting for real information:

| What | Where | How it shows on the site |
| --- | --- | --- |
| Projects 001–005 (academic) | `content/projects/*.json` | "Placeholder" badge, years shown as `20XX` |
| Concepts C.01–C.06 (personal) | `content/concepts/*.json` | "Placeholder" badge |
| Biography, education, skills, software, languages | `content/profile.json` | "To be added" |
| Email, LinkedIn, Instagram, location, CV | `content/profile.json` → `contact`, `cvUrl` | "To be added" (no dead links) |
| All images | `public/images/**` | SVG drawings stamped **VISUAL PLACEHOLDER** |

Unticking **"Contenu provisoire"** in the editor (`placeholder: false`) removes an entry's badge.

---

## How content works

```
content/                      ← edited at /admin, or by hand
  projects/<slug>.json          academic projects only (personal work goes to concepts)
  concepts/<slug>.json
  profile.json
        │
        ▼  scripts/content.mjs  (runs before dev and build)
        │    · validates everything (allowed categories, formats, image types, slugs, files exist)
        │    · measures every image, so editors never enter pixel sizes
        ▼
src/data/generated/content.json  (git-ignored) → src/data/{projects,concepts,profile}.ts → pages
```

- **Invalid content fails the build** with a readable list of problems. On Cloudflare the previous version stays online, so a bad edit never breaks the site.
- **Project pages are built from the data.** An image's `imageType` decides its section (Site analysis, Sketches & diagrams, Technical drawings, Floor plans, Sections & elevations, Physical models, Final visualisations). Empty sections are skipped and the numbering closes up.
- **Bilingual fields are `{ "en": "…", "fr": "…" }`.** If one language is empty, the other is shown.

### The editor (`/admin`)

- `public/admin/index.html` loads Sveltia CMS (pinned version) from a CDN.
- `public/admin/config.yml` is **generated** by `scripts/cms-config.mjs` from the same allowed values the content build checks, with the French labels from `src/i18n/fr.ts`. The editor can't offer a value the build would reject.
- Uploaded photos are converted to WebP and capped at 2800 px.
- Every save in the editor is a commit to `main`, and Cloudflare Pages redeploys automatically.

### Images

```
public/images/
  projects/     project images (editor uploads land here)
  concepts/     concept images
  profile/      hero, portrait
  sketches/  drawings/   spare folders
public/cv/      CV PDF (editor uploads land here)
```

Use original images only. Placeholders can be regenerated with `npm run placeholders`.

### Interface text

UI strings (navigation, buttons, headings) live in `src/i18n/en.ts` and `src/i18n/fr.ts`. TypeScript enforces that both files have the same keys. A `\n` in a heading marks a deliberate line break.

### Adding a category or format

Add the value to `ENUMS` in `scripts/content.mjs`, to the matching type in `src/data/types.ts`, and its labels to `src/i18n/en.ts` and `src/i18n/fr.ts`. Then run `npm run cms-config`.

### Social images

`public/og-image.png` and `public/apple-touch-icon.png` are rendered with the site's fonts by `node scripts/generate-social.cjs` (needs Playwright and Chromium).

---

## Structure

```
content/         CMS-editable JSON (projects, concepts, profile)
scripts/         content.mjs (validate + build content) · cms-config.mjs · generate-placeholders.mjs · generate-social.cjs
public/admin/    editor (index.html + generated config.yml)
src/
  config/        site URL (single source), navigation
  data/          types.ts · projects.ts · concepts.ts · profile.ts (typed views of the generated content)
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
- Works shows academic projects only. Its filters (category, format, grid/index view) live in the URL, e.g. `/works?category=cultural&view=index`.
- Gallery: arrow keys, swipe, Esc, focus trap and focus return.
- All animation respects `prefers-reduced-motion`.

## Deployment

The site is hosted on **Cloudflare Pages**. Build command `npm run build`, output `dist`, Node 22 (see `.node-version`). Cloudflare serves the single-page app natively, so no redirect file is needed. The site address is set once, in `src/config/site.ts`. Full steps, including the editor login, are in **[DEPLOY.md](DEPLOY.md)**.
