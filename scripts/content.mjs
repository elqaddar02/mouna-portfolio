#!/usr/bin/env node
/**
 * CONTENT BUILD
 *
 * Reads the CMS-editable JSON files in /content, validates them, measures every
 * referenced image (so editors never enter pixel sizes) and writes the result
 * to src/data/generated/content.json, which the app imports.
 *
 * Runs automatically before `npm run dev` and `npm run build`, and again in
 * the dev server whenever a content file changes. Invalid content fails the
 * build with a readable list of problems, so a bad edit never reaches the site.
 *
 * Usage: node scripts/content.mjs
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { imageSize } from 'image-size'

/* Allowed values — keep in sync with src/data/types.ts and public/admin/config.yml. */
export const ENUMS = {
  category: ['residential', 'cultural', 'public', 'urban', 'interior', 'experimental'],
  format: ['studio', 'competition', 'workshop', 'thesis'],
  imageType: ['cover', 'render', 'photo', 'site', 'sketch', 'diagram', 'model', 'plan', 'section', 'elevation', 'drawing'],
}

/** Image types shown in the "drawings" part of a project; everything else is gallery. */
const DRAWING_TYPES = new Set(['plan', 'section', 'elevation', 'drawing'])

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const CONTENT_DIR = join(ROOT, 'content')
export const OUTPUT_FILE = join(ROOT, 'src', 'data', 'generated', 'content.json')

export function buildContent(root = ROOT) {
  const errors = []
  const fail = (where, msg) => errors.push(`${where}: ${msg}`)
  const str = (v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim())

  const readJson = (file) => {
    try {
      return JSON.parse(readFileSync(file, 'utf8'))
    } catch (e) {
      fail(file.replace(root + '/', ''), `invalid JSON — ${e.message}`)
      return null
    }
  }
  const listJson = (dir) =>
    existsSync(dir)
      ? readdirSync(dir)
          .filter((f) => f.endsWith('.json'))
          .sort()
          .map((f) => ({ file: `content/${dir.split('/').pop()}/${f}`, data: readJson(join(dir, f)) }))
          .filter((x) => x.data)
      : []

  /** Bilingual value {en, fr}; a plain string is accepted as the English text. */
  const loc = (v, where, required = false) => {
    const out = typeof v === 'object' && v ? { en: str(v.en), fr: str(v.fr) } : { en: str(v), fr: '' }
    if (required && !out.en && !out.fr) fail(where, 'is required (English or French)')
    return out
  }
  const locList = (v, where) => (Array.isArray(v) ? v : []).map((x, i) => loc(x, `${where}[${i + 1}]`)).filter((x) => x.en || x.fr)
  const oneOf = (v, allowed, where) => {
    if (!allowed.includes(v)) fail(where, `"${v ?? ''}" is not one of: ${allowed.join(', ')}`)
    return v
  }

  /** Resolves a /public path, checks the file exists and reads its pixel size. */
  const image = (raw, where, imageType) => {
    const src = str(raw?.src)
    if (!src) {
      fail(where, 'image is missing')
      return null
    }
    if (/^https?:/.test(src) || !src.startsWith('/')) {
      fail(where, `"${src}" must be an uploaded file (a path starting with /)`)
      return null
    }
    const file = join(root, 'public', decodeURI(src))
    if (!existsSync(file)) {
      fail(where, `file not found: public${src}`)
      return null
    }
    let size
    try {
      size = imageSize(readFileSync(file))
    } catch {
      fail(where, `could not read image dimensions of public${src}`)
      return null
    }
    const caption = raw.caption ? loc(raw.caption, `${where}.caption`) : undefined
    return {
      src,
      imageType: oneOf(imageType ?? raw.imageType, ENUMS.imageType, `${where}.imageType`),
      alt: loc(raw.alt, `${where}.alt`),
      ...(caption && (caption.en || caption.fr) ? { caption } : {}),
      width: size.width,
      height: size.height,
    }
  }
  const images = (list, where) => (Array.isArray(list) ? list : []).map((x, i) => image(x, `${where}[${i + 1}]`)).filter(Boolean)

  const slugOf = (v, where, seen) => {
    const slug = str(v)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(where, `slug "${slug}" must use lowercase letters, numbers and hyphens`)
    if (seen.has(slug)) fail(where, `slug "${slug}" is used twice`)
    seen.add(slug)
    return slug
  }

  /* ── Projects ── */
  const projectSlugs = new Set()
  const projects = listJson(join(root, 'content', 'projects')).map(({ file, data: d }) => {
    const all = images(d.images, `${file} images`)
    const cover = image(d.cover, `${file} cover`, 'cover')
    const thumb = d.thumbnail?.src ? image(d.thumbnail, `${file} thumbnail`, 'render') : cover
    const slug = slugOf(d.slug, file, projectSlugs)
    return {
      id: slug,
      slug,
      number: str(d.number),
      title: loc(d.title, `${file} title`, true),
      subtitle: loc(d.subtitle, `${file} subtitle`),
      category: oneOf(d.category, ENUMS.category, `${file} category`),
      format: oneOf(d.format, ENUMS.format, `${file} format`),
      year: str(d.year),
      location: loc(d.location, `${file} location`),
      coverImage: cover,
      thumbnailImage: thumb,
      shortDescription: loc(d.shortDescription, `${file} shortDescription`),
      fullDescription: loc(d.fullDescription, `${file} fullDescription`),
      architecturalConcept: loc(d.architecturalConcept, `${file} architecturalConcept`),
      siteAnalysis: loc(d.siteAnalysis, `${file} siteAnalysis`),
      designProcess: loc(d.designProcess, `${file} designProcess`),
      gallery: all.filter((i) => !DRAWING_TYPES.has(i.imageType)),
      drawings: all.filter((i) => DRAWING_TYPES.has(i.imageType)),
      meta: (Array.isArray(d.meta) ? d.meta : [])
        .map((m, i) => ({ label: loc(m?.label, `${file} meta[${i + 1}].label`), value: loc(m?.value, `${file} meta[${i + 1}].value`) }))
        .filter((m) => (m.label.en || m.label.fr) && (m.value.en || m.value.fr)),
      featured: d.featured === true,
      order: Number.isFinite(Number(d.order)) ? Number(d.order) : 999,
      placeholder: d.placeholder === true,
    }
  })

  /* ── Profile ── */
  const pf = 'content/profile.json'
  const p = readJson(join(root, pf)) ?? {}
  const c = p.contact ?? {}
  const location = loc(c.location, `${pf} contact.location`)
  const cvUrl = str(p.cvUrl) || null
  if (cvUrl && !existsSync(join(root, 'public', decodeURI(cvUrl)))) fail(pf, `CV file not found: public${cvUrl}`)
  const heroImage = image(p.heroImage, `${pf} heroImage`, 'render')
  const profile = {
    name: str(p.name),
    role: loc(p.role, `${pf} role`, true),
    shortBio: loc(p.shortBio, `${pf} shortBio`),
    longBio: locList(p.longBio, `${pf} longBio`),
    philosophy: locList(p.philosophy, `${pf} philosophy`),
    interests: locList(p.interests, `${pf} interests`),
    education: (Array.isArray(p.education) ? p.education : []).map((e, i) => ({
      period: loc(e?.period, `${pf} education[${i + 1}].period`),
      institution: loc(e?.institution, `${pf} education[${i + 1}].institution`),
      programme: loc(e?.programme, `${pf} education[${i + 1}].programme`),
      ...(e?.note && (str(e.note.en) || str(e.note.fr)) ? { note: loc(e.note, `${pf} education[${i + 1}].note`) } : {}),
    })),
    skills: locList(p.skills, `${pf} skills`),
    software: (Array.isArray(p.software) ? p.software : []).map((g, i) => ({
      category: loc(g?.category, `${pf} software[${i + 1}].category`),
      tools: (Array.isArray(g?.tools) ? g.tools : []).map(str).filter(Boolean),
    })),
    languages: (Array.isArray(p.languages) ? p.languages : []).map((l, i) => ({
      name: loc(l?.name, `${pf} languages[${i + 1}].name`),
      level: loc(l?.level, `${pf} languages[${i + 1}].level`),
    })),
    portrait: image(p.portrait, `${pf} portrait`, 'photo'),
    heroImage,
    heroProject: str(p.heroProject) || null,
    contact: {
      email: str(c.email) || null,
      linkedin: str(c.linkedin) || null,
      instagram: str(c.instagram) || null,
      location: location.en || location.fr ? location : null,
    },
    cvUrl,
    placeholder: p.placeholder === true,
  }
  if (!profile.name) fail(pf, 'name is required')
  if (profile.heroProject && !projectSlugs.has(profile.heroProject)) fail(pf, `heroProject "${profile.heroProject}" is not an existing project slug`)

  if (errors.length) {
    const err = new Error(`Content has ${errors.length} problem(s):\n  • ${errors.join('\n  • ')}`)
    err.contentErrors = errors
    throw err
  }
  return { projects, profile }
}

export function writeContent(root = ROOT) {
  const content = buildContent(root)
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true })
  const json = JSON.stringify(content, null, 2) + '\n'
  // Only touch the file when it changes, to avoid needless dev-server reloads.
  if (!existsSync(OUTPUT_FILE) || readFileSync(OUTPUT_FILE, 'utf8') !== json) writeFileSync(OUTPUT_FILE, json)
  return content
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { projects } = writeContent()
    console.log(`content: ${projects.length} projects → src/data/generated/content.json`)
  } catch (e) {
    console.error(`\n✖ ${e.message}\n`)
    process.exit(1)
  }
}
