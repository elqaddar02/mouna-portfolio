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
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { imageSize } from 'image-size'

/* Allowed values — keep in sync with src/data/types.ts and public/admin/config.yml. */
export const ENUMS = {
  category: ['residential', 'cultural', 'public', 'urban', 'interior', 'experimental'],
  format: ['studio', 'competition', 'workshop', 'thesis'],
  slideFit: ['cover', 'contain'],
  imageType: ['cover', 'render', 'photo', 'site', 'sketch', 'diagram', 'model', 'plan', 'section', 'elevation', 'drawing'],
}

/** Cloudflare Pages refuses any single file above 25 MiB. */
const MAX_FILE_BYTES = 25 * 1024 * 1024

/** Reads a YouTube or Vimeo address; null when it is neither. */
export function parseVideoUrl(raw) {
  let u
  try {
    u = new URL(raw)
  } catch {
    return null
  }
  const host = u.hostname.replace(/^(www\.|m\.)/, '')
  const parts = u.pathname.split('/').filter(Boolean)
  if (host === 'youtu.be' && parts[0]) return { provider: 'youtube', id: parts[0] }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = u.searchParams.get('v') || (['shorts', 'embed', 'live'].includes(parts[0]) ? parts[1] : null)
    return id && /^[\w-]{6,}$/.test(id) ? { provider: 'youtube', id } : null
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const nums = parts.filter((x) => /^\d+$/.test(x))
    if (!nums[0]) return null
    const after = parts[parts.indexOf(nums[0]) + 1]
    const hash = u.searchParams.get('h') || (after && /^[0-9a-f]+$/i.test(after) ? after : undefined)
    return { provider: 'vimeo', id: nums[0], ...(hash ? { hash } : {}) }
  }
  return null
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
      slide: d.slide === true,
      slideImage: d.slideImage?.src ? image(d.slideImage, `${file} slideImage`, 'render') : cover,
      slideFit: oneOf(d.slideFit ?? 'cover', ENUMS.slideFit, `${file} slideFit`),
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
  const availability = loc(p.availability, `${pf} availability`)
  const v = p.cvVideo ?? {}
  const vFile = str(v.file)
  const vUrl = str(v.url)
  let cvVideo = null
  if (vFile || vUrl) {
    const embed = vUrl ? parseVideoUrl(vUrl) : null
    if (vUrl && !embed) fail(`${pf} cvVideo.url`, `"${vUrl}" is not a YouTube or Vimeo link`)
    if (vFile && !vUrl) {
      const file = join(root, 'public', decodeURI(vFile))
      if (!/\.(mp4|webm|m4v|mov)$/i.test(vFile)) fail(`${pf} cvVideo.file`, `"${vFile}" must be an MP4 or WebM video`)
      else if (!existsSync(file)) fail(`${pf} cvVideo.file`, `file not found: public${vFile}`)
      else if (statSync(file).size > MAX_FILE_BYTES)
        fail(`${pf} cvVideo.file`, `video is ${(statSync(file).size / 1048576).toFixed(1)} MB — the host accepts 25 MB at most. Compress it, or use a YouTube / Vimeo link instead`)
    }
    const caption = loc(v.caption, `${pf} cvVideo.caption`)
    cvVideo = {
      file: vUrl ? null : vFile,
      embed,
      poster: str(v.poster) ? image({ src: v.poster }, `${pf} cvVideo.poster`, 'photo') : null,
      caption: caption.en || caption.fr ? caption : null,
      placeholder: v.placeholder === true,
    }
  }
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
    portrait: p.portrait?.src ? image(p.portrait, `${pf} portrait`, 'photo') : null,
    heroImage,
    heroProject: str(p.heroProject) || null,
    availability: availability.en || availability.fr ? availability : null,
    contact: {
      email: str(c.email) || null,
      phone: str(c.phone) || null,
      linkedin: str(c.linkedin) || null,
      instagram: str(c.instagram) || null,
      location: location.en || location.fr ? location : null,
    },
    cvUrl,
    cvVideo,
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
