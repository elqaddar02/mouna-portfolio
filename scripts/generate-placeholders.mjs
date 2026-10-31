#!/usr/bin/env node
/**
 * Generates clearly-labelled SVG VISUAL PLACEHOLDERS for the portfolio.
 *
 * These are NOT Mouna's work. Every file is stamped "VISUAL PLACEHOLDER" and
 * exists only so the layout can be designed before real images are supplied.
 * Replace each file with an original image (WebP/AVIF/JPG recommended) and
 * update the matching `src` in src/data/*.ts.
 *
 * Usage: npm run placeholders
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')

const C = {
  paper: '#F1EFE8',
  paper2: '#E7E4DB',
  ink: '#171717',
  orange: '#F15A24',
  concrete: '#B8B5AD',
  concreteLight: '#D3D0C8',
  concreteDark: '#8E8B84',
  shadow: '#6F6C66',
}

const RATIOS = {
  '16:9': [1600, 900],
  '21:9': [1680, 720],
  '3:2': [1500, 1000],
  '4:3': [1600, 1200],
  '1:1': [1200, 1200],
  '4:5': [1200, 1500],
  '3:4': [1200, 1600],
  '2:3': [1100, 1650],
}

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7)
const f = (n) => Math.round(n * 10) / 10

/* ---------- shared chrome ---------- */

function frame(w, h, bg, body, label, dark = false) {
  const ink = dark ? C.paper : C.ink
  const fs = Math.max(14, Math.round(w / 85))
  const pad = Math.round(w * 0.03)
  const text = `VISUAL PLACEHOLDER — ${label}`
  const boxW = text.length * fs * 0.68 + fs * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<rect width="${w}" height="${h}" fill="${bg}"/>
${body}
<g font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="${fs}" letter-spacing="1">
<rect x="${pad}" y="${h - pad - fs * 2.2}" width="${f(boxW)}" height="${f(fs * 2.2)}" fill="${dark ? C.ink : C.paper}" stroke="${ink}" stroke-width="2"/>
<rect x="${pad}" y="${h - pad - fs * 2.2}" width="${f(fs * 0.6)}" height="${f(fs * 2.2)}" fill="${C.orange}"/>
<text x="${f(pad + fs * 1.1)}" y="${f(h - pad - fs * 0.75)}" fill="${ink}">${text}</text>
<text x="${w - pad}" y="${pad + fs}" fill="${ink}" text-anchor="end" opacity=".7">${w}×${h} · REPLACE WITH ORIGINAL</text>
</g>
</svg>`
}

/* ---------- isometric massing (render / cover / model) ---------- */

function iso(w, h, r, { model = false } = {}) {
  // fit ground plane (±3.8 units) plus the tallest block (~3.6 units) inside the frame
  const s = Math.min(h / (model ? 15 : 13.5), (w * 0.85) / 13.2)
  const cx = w / 2
  const cy = h / 2 + 1.6 * s
  const P = (x, y, z) => [cx + (x - y) * s * 0.866, cy + (x + y) * s * 0.5 - z * s]
  const pts = (arr) => arr.map((p) => P(...p).map(f).join(',')).join(' ')
  const N = 6
  const boxes = []
  const accent = Math.floor(r() * N * N)
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      if (r() < 0.28) continue
      const hgt = r() < 0.15 ? 0.4 : 0.6 + Math.floor(r() * 5) * 0.75
      boxes.push({ x: i - N / 2, y: j - N / 2, w: 0.92, d: 0.92, h: hgt, accent: i * N + j === accent })
    }
  boxes.sort((a, b) => a.x + a.y - (b.x + b.y))
  const top = model ? '#FBFAF6' : C.concreteLight
  const left = model ? '#E3E0D8' : C.concrete
  const right = model ? '#C9C5BC' : C.concreteDark
  let out = ''
  // ground / base board
  const g = N / 2 + 0.8
  out += `<polygon points="${pts([[-g, -g, 0], [g, -g, 0], [g, g, 0], [-g, g, 0]])}" fill="${model ? '#D9D5CB' : C.paper2}" stroke="${C.ink}" stroke-width="1.5"/>`
  if (model)
    out += `<polygon points="${pts([[-g, g, 0], [g, g, 0], [g, g, -0.5], [-g, g, -0.5]])}" fill="#BDB8AD" stroke="${C.ink}" stroke-width="1"/><polygon points="${pts([[g, -g, 0], [g, g, 0], [g, g, -0.5], [g, -g, -0.5]])}" fill="#A39E93" stroke="${C.ink}" stroke-width="1"/>`
  for (const b of boxes) {
    const { x, y, w: bw, d, h: bh } = b
    // cast shadow
    out += `<polygon points="${pts([[x, y + d, 0], [x + bw, y + d, 0], [x + bw + bh * 0.6, y + d + bh * 0.25, 0], [x + bh * 0.6, y + d + bh * 0.25, 0]])}" fill="${C.shadow}" opacity=".18"/>`
    const t = b.accent && !model ? C.orange : top
    out += `<polygon points="${pts([[x, y + d, 0], [x + bw, y + d, 0], [x + bw, y + d, bh], [x, y + d, bh]])}" fill="${b.accent ? C.orange : left}" stroke="${C.ink}" stroke-width="1.2"/>`
    out += `<polygon points="${pts([[x + bw, y, 0], [x + bw, y + d, 0], [x + bw, y + d, bh], [x + bw, y, bh]])}" fill="${b.accent ? '#C9461A' : right}" stroke="${C.ink}" stroke-width="1.2"/>`
    out += `<polygon points="${pts([[x, y, bh], [x + bw, y, bh], [x + bw, y + d, bh], [x, y + d, bh]])}" fill="${t}" stroke="${C.ink}" stroke-width="1.2"/>`
    // window rhythm on facades
    if (!model && bh > 1)
      for (let z = 0.45; z < bh - 0.2; z += 0.75)
        out += `<line x1="${f(P(x + 0.15, y + d, z)[0])}" y1="${f(P(x + 0.15, y + d, z)[1])}" x2="${f(P(x + bw - 0.15, y + d, z)[0])}" y2="${f(P(x + bw - 0.15, y + d, z)[1])}" stroke="${C.ink}" stroke-width="1" opacity=".55"/>`
  }
  if (!model) {
    // scale figures
    for (let k = 0; k < 4; k++) {
      const [px, py] = P(-g + 0.4 + k * 0.5, g - 0.3, 0)
      out += `<line x1="${f(px)}" y1="${f(py)}" x2="${f(px)}" y2="${f(py - s * 0.35)}" stroke="${C.ink}" stroke-width="2"/><circle cx="${f(px)}" cy="${f(py - s * 0.42)}" r="${f(s * 0.06)}" fill="${C.ink}"/>`
    }
  }
  return out
}

/* ---------- plan ---------- */

function plan(w, h, r) {
  const m = w * 0.14
  const x0 = m, y0 = h * 0.14, W = w - 2 * m, H = h - h * 0.3
  const rooms = []
  const split = (x, y, rw, rh, depth) => {
    if (depth > 3 || (rw < W * 0.22 && rh < H * 0.22) || (depth > 1 && r() < 0.25)) return rooms.push([x, y, rw, rh])
    if (rw > rh) {
      const c = rw * (0.35 + r() * 0.3)
      split(x, y, c, rh, depth + 1); split(x + c, y, rw - c, rh, depth + 1)
    } else {
      const c = rh * (0.35 + r() * 0.3)
      split(x, y, rw, c, depth + 1); split(x, y + c, rw, rh - c, depth + 1)
    }
  }
  split(x0, y0, W, H, 0)
  const wall = Math.max(6, w / 220)
  let out = ''
  // structural grid
  const cols = 5, rows = 4
  for (let i = 0; i <= cols; i++) {
    const x = x0 + (W / cols) * i
    out += `<line x1="${f(x)}" y1="${f(y0 - m * 0.5)}" x2="${f(x)}" y2="${f(y0 + H + m * 0.3)}" stroke="${C.concreteDark}" stroke-width="1" stroke-dasharray="14 6 3 6"/>`
    out += `<circle cx="${f(x)}" cy="${f(y0 - m * 0.62)}" r="${f(w / 90)}" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/><text x="${f(x)}" y="${f(y0 - m * 0.62 + w / 230)}" font-family="monospace" font-size="${f(w / 80)}" text-anchor="middle" fill="${C.ink}">${String.fromCharCode(65 + i)}</text>`
  }
  for (let j = 0; j <= rows; j++) {
    const y = y0 + (H / rows) * j
    out += `<line x1="${f(x0 - m * 0.5)}" y1="${f(y)}" x2="${f(x0 + W + m * 0.3)}" y2="${f(y)}" stroke="${C.concreteDark}" stroke-width="1" stroke-dasharray="14 6 3 6"/>`
    out += `<circle cx="${f(x0 - m * 0.62)}" cy="${f(y)}" r="${f(w / 90)}" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.5"/><text x="${f(x0 - m * 0.62)}" y="${f(y + w / 230)}" font-family="monospace" font-size="${f(w / 80)}" text-anchor="middle" fill="${C.ink}">${j + 1}</text>`
  }
  const hl = Math.floor(r() * rooms.length)
  rooms.forEach(([x, y, rw, rh], i) => {
    if (i === hl) out += `<rect x="${f(x)}" y="${f(y)}" width="${f(rw)}" height="${f(rh)}" fill="${C.orange}" opacity=".85"/>`
    else if (r() < 0.3) out += `<rect x="${f(x)}" y="${f(y)}" width="${f(rw)}" height="${f(rh)}" fill="${C.concreteLight}" opacity=".6"/>`
  })
  rooms.forEach(([x, y, rw, rh]) => {
    out += `<rect x="${f(x)}" y="${f(y)}" width="${f(rw)}" height="${f(rh)}" fill="none" stroke="${C.ink}" stroke-width="${f(wall * 0.6)}"/>`
  })
  out += `<rect x="${f(x0)}" y="${f(y0)}" width="${f(W)}" height="${f(H)}" fill="none" stroke="${C.ink}" stroke-width="${f(wall * 1.6)}"/>`
  // doors
  rooms.forEach(([x, y, rw, rh]) => {
    if (rw < 60 || rh < 60) return
    const dw = Math.min(rw, rh) * 0.22
    const dx = x + rw * (0.2 + r() * 0.4)
    out += `<rect x="${f(dx)}" y="${f(y + rh - wall)}" width="${f(dw)}" height="${f(wall * 2)}" fill="${C.paper}"/>`
    out += `<path d="M${f(dx)} ${f(y + rh)} L${f(dx)} ${f(y + rh - dw)} A${f(dw)} ${f(dw)} 0 0 1 ${f(dx + dw)} ${f(y + rh)}" fill="none" stroke="${C.ink}" stroke-width="1.2"/>`
  })
  // columns
  for (let i = 0; i <= cols; i++)
    for (let j = 0; j <= rows; j++)
      out += `<rect x="${f(x0 + (W / cols) * i - wall)}" y="${f(y0 + (H / rows) * j - wall)}" width="${f(wall * 2)}" height="${f(wall * 2)}" fill="${C.ink}"/>`
  // north arrow + scale bar
  const nx = w - m * 0.55, ny = h * 0.2, nr = w / 40
  out += `<circle cx="${f(nx)}" cy="${f(ny)}" r="${f(nr)}" fill="none" stroke="${C.ink}" stroke-width="1.5"/><polygon points="${f(nx)},${f(ny - nr)} ${f(nx + nr * 0.4)},${f(ny + nr * 0.5)} ${f(nx)},${f(ny + nr * 0.2)}" fill="${C.ink}"/><text x="${f(nx)}" y="${f(ny - nr * 1.3)}" font-family="monospace" font-size="${f(w / 75)}" text-anchor="middle">N</text>`
  const sb = W / 4
  for (let k = 0; k < 4; k++)
    out += `<rect x="${f(x0 + (sb / 4) * k)}" y="${f(h * 0.94 - 16)}" width="${f(sb / 4)}" height="8" fill="${k % 2 ? C.paper : C.ink}" stroke="${C.ink}"/>`
  return out
}

/* ---------- section & elevation ---------- */

function section(w, h, r, { elevation = false } = {}) {
  const ground = h * 0.74
  const bx = w * 0.12, bw = w * 0.72
  const floors = 2 + Math.floor(r() * 3)
  const fh = (ground - h * 0.18) / (floors + 0.6)
  let out = ''
  out += `<defs><pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${C.ink}" stroke-width="1.4"/></pattern></defs>`
  out += `<rect x="0" y="${f(ground)}" width="${w}" height="${f(h - ground)}" fill="url(#hatch)" opacity=".5"/>`
  out += `<line x1="0" y1="${f(ground)}" x2="${w}" y2="${f(ground)}" stroke="${C.ink}" stroke-width="4"/>`
  if (!elevation) out += `<rect x="${f(bx)}" y="${f(ground)}" width="${f(bw * 0.55)}" height="${f(fh * 0.9)}" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>`
  const slab = Math.max(8, h / 70)
  const bays = 6 + Math.floor(r() * 4)
  for (let i = 0; i < floors; i++) {
    const y = ground - fh * (i + 1)
    const inset = i === floors - 1 ? bw * (0.15 + r() * 0.2) : 0
    const x = bx + (i % 2 && r() < 0.5 ? bw * 0.05 : 0)
    const ww = bw - inset
    if (elevation) {
      out += `<rect x="${f(x)}" y="${f(y)}" width="${f(ww)}" height="${f(fh)}" fill="${i === 1 ? C.concreteLight : C.paper}" stroke="${C.ink}" stroke-width="2"/>`
      for (let b = 0; b < bays; b++) {
        const wx = x + (ww / bays) * b + ww / bays * 0.18
        const isOrange = b === 2 && i === 0
        out += `<rect x="${f(wx)}" y="${f(y + fh * 0.22)}" width="${f((ww / bays) * 0.64)}" height="${f(fh * 0.6)}" fill="${isOrange ? C.orange : C.concrete}" stroke="${C.ink}" stroke-width="1.5"/>`
        out += `<line x1="${f(wx + (ww / bays) * 0.32)}" y1="${f(y + fh * 0.22)}" x2="${f(wx + (ww / bays) * 0.32)}" y2="${f(y + fh * 0.82)}" stroke="${C.ink}" stroke-width="1"/>`
      }
    } else {
      out += `<rect x="${f(x)}" y="${f(y)}" width="${f(ww)}" height="${f(slab)}" fill="${C.ink}"/>`
      out += `<rect x="${f(x)}" y="${f(y)}" width="${f(slab * 1.2)}" height="${f(fh)}" fill="${C.ink}"/>`
      out += `<rect x="${f(x + ww - slab * 1.2)}" y="${f(y)}" width="${f(slab * 1.2)}" height="${f(fh)}" fill="${C.ink}"/>`
      if (i === 0) out += `<rect x="${f(x + ww * 0.4)}" y="${f(y + slab)}" width="${f(ww * 0.2)}" height="${f(fh - slab)}" fill="${C.orange}" opacity=".9"/>`
      for (let b = 1; b < 4; b++) out += `<line x1="${f(x + (ww / 4) * b)}" y1="${f(y + slab)}" x2="${f(x + (ww / 4) * b)}" y2="${f(y + fh)}" stroke="${C.concreteDark}" stroke-width="1" stroke-dasharray="6 6"/>`
      // figures
      const px = x + ww * (0.15 + r() * 0.6)
      out += `<line x1="${f(px)}" y1="${f(y + fh)}" x2="${f(px)}" y2="${f(y + fh - fh * 0.42)}" stroke="${C.ink}" stroke-width="3"/><circle cx="${f(px)}" cy="${f(y + fh - fh * 0.48)}" r="${f(fh * 0.06)}" fill="${C.ink}"/>`
    }
    // level marker
    const lx = bx + bw + w * 0.04
    out += `<polygon points="${f(lx)},${f(y + fh)} ${f(lx + 10)},${f(y + fh - 14)} ${f(lx - 10)},${f(y + fh - 14)}" fill="${C.ink}"/><line x1="${f(lx - 30)}" y1="${f(y + fh)}" x2="${f(lx + 60)}" y2="${f(y + fh)}" stroke="${C.ink}" stroke-width="1"/><text x="${f(lx + 16)}" y="${f(y + fh - 6)}" font-family="monospace" font-size="${f(w / 95)}" fill="${C.ink}">+${(i * 3.2).toFixed(2)}</text>`
  }
  if (!elevation) out += `<rect x="${f(bx)}" y="${f(ground - fh * floors)}" width="${f(bw * 0.8)}" height="${f(slab)}" fill="${C.ink}"/>`
  // trees
  for (const tx of [w * 0.05, w * 0.93]) out += `<line x1="${f(tx)}" y1="${f(ground)}" x2="${f(tx)}" y2="${f(ground - fh * 1.1)}" stroke="${C.ink}" stroke-width="2"/><circle cx="${f(tx)}" cy="${f(ground - fh * 1.3)}" r="${f(fh * 0.5)}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`
  return out
}

/* ---------- sketch ---------- */

function sketch(w, h, r) {
  const vx = w * (0.35 + r() * 0.3), vy = h * 0.42
  const j = () => (r() - 0.5) * w * 0.006
  const line = (x1, y1, x2, y2, sw = 1.4, op = 0.85) => {
    const mx = (x1 + x2) / 2 + j() * 3, my = (y1 + y2) / 2 + j() * 3
    return `<path d="M${f(x1 + j())} ${f(y1 + j())} Q${f(mx)} ${f(my)} ${f(x2 + j())} ${f(y2 + j())}" fill="none" stroke="${C.ink}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"/>`
  }
  let out = ''
  out += line(0, vy, w, vy, 1, 0.5)
  for (let k = 0; k < 16; k++) {
    const ex = r() < 0.5 ? r() * w * 0.15 : w - r() * w * 0.15
    const ey = r() * h
    out += line(vx, vy, ex, ey, 0.8, 0.35)
  }
  // box volumes in perspective
  for (let k = 0; k < 4; k++) {
    const left = k % 2 === 0
    const nx = left ? w * (0.05 + k * 0.06) : w * (0.95 - k * 0.06)
    const top = h * (0.12 + r() * 0.2), bot = h * (0.8 + r() * 0.1)
    const t = 0.45 + r() * 0.2
    const fx = nx + (vx - nx) * t
    const ftop = top + (vy - top) * t, fbot = bot + (vy - bot) * t
    out += line(nx, top, nx, bot, 2.2) + line(nx, top, fx, ftop, 1.6) + line(nx, bot, fx, fbot, 1.6) + line(fx, ftop, fx, fbot, 1.6)
    for (let q = 0; q < 7; q++) {
      const tt = 0.05 + q * 0.06
      const xx = nx + (fx - nx) * tt
      out += line(xx, top + (ftop - top) * tt + 8, xx, bot + (fbot - bot) * tt - 8, 0.8, 0.5)
    }
  }
  // scribble hatch
  for (let k = 0; k < 40; k++) {
    const x = w * 0.4 + r() * w * 0.2, y = h * 0.6 + r() * h * 0.2
    out += line(x, y, x + w * 0.02, y - h * 0.03, 0.9, 0.5)
  }
  out += `<circle cx="${f(vx)}" cy="${f(vy)}" r="${f(w / 120)}" fill="${C.orange}"/>`
  out += `<text x="${f(vx + 16)}" y="${f(vy - 12)}" font-family="monospace" font-size="${f(w / 85)}" fill="${C.orange}">VP</text>`
  return out
}

/* ---------- site / contour ---------- */

function site(w, h, r) {
  const cx = w * (0.4 + r() * 0.2), cy = h * (0.4 + r() * 0.2)
  const ph = Array.from({ length: 5 }, () => r() * Math.PI * 2)
  let out = ''
  for (let k = 1; k < 18; k++) {
    const base = k * Math.min(w, h) * 0.055
    const pts = []
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2
      const rr = base * (1 + 0.18 * Math.sin(3 * t + ph[0]) + 0.1 * Math.sin(5 * t + ph[1] + k * 0.1))
      pts.push(`${f(cx + Math.cos(t) * rr * 1.4)},${f(cy + Math.sin(t) * rr)}`)
    }
    out += `<polygon points="${pts.join(' ')}" fill="none" stroke="${C.ink}" stroke-width="${k % 5 === 0 ? 2 : 0.9}" opacity="${k % 5 === 0 ? 0.9 : 0.5}"/>`
  }
  out += `<path d="M0 ${f(h * 0.75)} C ${f(w * 0.3)} ${f(h * 0.6)}, ${f(w * 0.6)} ${f(h * 0.95)}, ${w} ${f(h * 0.7)}" fill="none" stroke="${C.paper}" stroke-width="${f(w / 40)}"/>`
  out += `<path d="M0 ${f(h * 0.75)} C ${f(w * 0.3)} ${f(h * 0.6)}, ${f(w * 0.6)} ${f(h * 0.95)}, ${w} ${f(h * 0.7)}" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-dasharray="20 10"/>`
  const px = cx + w * 0.05, py = cy - h * 0.08
  out += `<polygon points="${f(px)},${f(py)} ${f(px + w * 0.18)},${f(py + h * 0.04)} ${f(px + w * 0.15)},${f(py + h * 0.22)} ${f(px - w * 0.02)},${f(py + h * 0.17)}" fill="${C.orange}" fill-opacity=".25" stroke="${C.orange}" stroke-width="4" stroke-dasharray="16 8"/>`
  out += `<text x="${f(px + w * 0.02)}" y="${f(py + h * 0.12)}" font-family="monospace" font-size="${f(w / 70)}" fill="${C.ink}">SITE</text>`
  return out
}

/* ---------- diagram ---------- */

function diagram(w, h, r) {
  const n = 5 + Math.floor(r() * 3)
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + r() * 0.4
    const d = Math.min(w, h) * (0.22 + r() * 0.12)
    return { x: w / 2 + Math.cos(a) * d * 1.2, y: h / 2 + Math.sin(a) * d, r: Math.min(w, h) * (0.04 + r() * 0.07) }
  })
  let out = `<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${C.orange}"/></marker></defs>`
  nodes.forEach((a, i) => {
    const b = nodes[(i + 2) % n]
    out += `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke="${C.ink}" stroke-width="1" stroke-dasharray="4 6"/>`
  })
  nodes.forEach((a, i) => {
    const b = nodes[(i + 1) % n]
    out += `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x + (a.x - b.x) * 0.25)}" y2="${f(b.y + (a.y - b.y) * 0.25)}" stroke="${C.orange}" stroke-width="3" marker-end="url(#arr)"/>`
  })
  nodes.forEach((a, i) => {
    out += `<circle cx="${f(a.x)}" cy="${f(a.y)}" r="${f(a.r)}" fill="${i === 0 ? C.ink : C.paper}" stroke="${C.ink}" stroke-width="2.5"/>`
    out += `<text x="${f(a.x)}" y="${f(a.y + w / 160)}" font-family="monospace" font-size="${f(w / 60)}" text-anchor="middle" fill="${i === 0 ? C.paper : C.ink}">${String.fromCharCode(65 + i)}</text>`
  })
  out += `<rect x="${f(w / 2 - w * 0.07)}" y="${f(h / 2 - w * 0.07)}" width="${f(w * 0.14)}" height="${f(w * 0.14)}" fill="none" stroke="${C.ink}" stroke-width="4"/>`
  return out
}

/* ---------- construction detail ---------- */

function detail(w, h, r) {
  const layers = [
    { c: C.ink, k: 'solid', t: 0.02 },
    { c: C.concreteLight, k: 'dots', t: 0.22 },
    { c: C.orange, k: 'zig', t: 0.12 },
    { c: C.paper, k: 'air', t: 0.05 },
    { c: C.concrete, k: 'hatch', t: 0.14 },
    { c: C.paper2, k: 'lines', t: 0.04 },
  ]
  let out = `<defs><pattern id="dh" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" stroke="${C.ink}" stroke-width="1.2"/></pattern><pattern id="dd" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.6" fill="${C.ink}"/><circle cx="13" cy="12" r="1" fill="${C.ink}"/><path d="M10 3 l3 2 -3 1z" fill="${C.ink}"/></pattern></defs>`
  let x = w * 0.18
  const y0 = h * 0.12, y1 = h * 0.82
  for (const L of layers) {
    const lw = w * L.t * (0.85 + r() * 0.3)
    out += `<rect x="${f(x)}" y="${f(y0)}" width="${f(lw)}" height="${f(y1 - y0)}" fill="${L.c}" stroke="${C.ink}" stroke-width="2"/>`
    if (L.k === 'dots') out += `<rect x="${f(x)}" y="${f(y0)}" width="${f(lw)}" height="${f(y1 - y0)}" fill="url(#dd)"/>`
    if (L.k === 'hatch') out += `<rect x="${f(x)}" y="${f(y0)}" width="${f(lw)}" height="${f(y1 - y0)}" fill="url(#dh)"/>`
    if (L.k === 'zig') {
      let d = `M${f(x)} ${f(y0)}`
      for (let y = y0, s = 0; y < y1; y += lw * 0.5, s++) d += ` L${f(s % 2 ? x : x + lw)} ${f(y + lw * 0.5)}`
      out += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`
    }
    if (L.k === 'lines') for (let y = y0; y < y1; y += 22) out += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + lw)}" y2="${f(y)}" stroke="${C.ink}" stroke-width=".8"/>`
    x += lw
  }
  // leader annotations
  let lx = w * 0.18
  layers.forEach((L, i) => {
    const ty = h * 0.18 + i * h * 0.1
    const ax = lx + w * L.t * 0.5
    out += `<circle cx="${f(ax)}" cy="${f(ty)}" r="5" fill="${C.ink}"/><line x1="${f(ax)}" y1="${f(ty)}" x2="${f(w * 0.86)}" y2="${f(ty)}" stroke="${C.ink}" stroke-width="1"/><text x="${f(w * 0.87)}" y="${f(ty + 6)}" font-family="monospace" font-size="${f(w / 70)}" fill="${C.ink}">0${i + 1}</text>`
    lx += w * L.t
  })
  return out
}

/* ---------- portrait silhouette placeholder ---------- */

function portrait(w, h) {
  return `<rect x="${f(w * 0.1)}" y="${f(h * 0.08)}" width="${f(w * 0.8)}" height="${f(h * 0.8)}" fill="${C.concreteLight}" stroke="${C.ink}" stroke-width="2"/>
<circle cx="${f(w / 2)}" cy="${f(h * 0.38)}" r="${f(w * 0.16)}" fill="${C.concrete}" stroke="${C.ink}" stroke-width="2"/>
<path d="M${f(w * 0.2)} ${f(h * 0.88)} C ${f(w * 0.22)} ${f(h * 0.6)}, ${f(w * 0.78)} ${f(h * 0.6)}, ${f(w * 0.8)} ${f(h * 0.88)}" fill="${C.concrete}" stroke="${C.ink}" stroke-width="2"/>
<line x1="${f(w * 0.1)}" y1="${f(h * 0.08)}" x2="${f(w * 0.9)}" y2="${f(h * 0.88)}" stroke="${C.ink}" stroke-width="1" opacity=".3"/>
<line x1="${f(w * 0.9)}" y1="${f(h * 0.08)}" x2="${f(w * 0.1)}" y2="${f(h * 0.88)}" stroke="${C.ink}" stroke-width="1" opacity=".3"/>`
}

/* ---------- generation ---------- */

const KINDS = {
  render: (w, h, r) => [C.concreteLight, iso(w, h, r)],
  cover: (w, h, r) => [C.concreteLight, iso(w, h, r)],
  model: (w, h, r) => ['#CFCBC2', iso(w, h, r, { model: true })],
  plan: (w, h, r) => [C.paper, plan(w, h, r)],
  section: (w, h, r) => [C.paper, section(w, h, r)],
  elevation: (w, h, r) => [C.paper, section(w, h, r, { elevation: true })],
  sketch: (w, h, r) => ['#F6F3EA', sketch(w, h, r)],
  site: (w, h, r) => [C.paper2, site(w, h, r)],
  diagram: (w, h, r) => [C.paper, diagram(w, h, r)],
  drawing: (w, h, r) => [C.paper, detail(w, h, r)],
  portrait: (w, h) => [C.paper2, portrait(w, h)],
}

let count = 0
function write(path, kind, ratio, label) {
  const [w, h] = RATIOS[ratio]
  const r = rng(hash(path))
  const [bg, body] = KINDS[kind](w, h, r)
  const file = join(ROOT, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, frame(w, h, bg, body, label))
  count++
}

/* Must stay in sync with src/data/projects.ts and src/data/concepts.ts. */
const PROJECT_SET = [
  ['cover', 'cover', '16:9'],
  ['thumb', 'render', '4:5'],
  ['site', 'site', '3:2'],
  ['concept-diagram', 'diagram', '1:1'],
  ['sketch-01', 'sketch', '4:3'],
  ['sketch-02', 'sketch', '3:4'],
  ['model-01', 'model', '4:5'],
  ['model-02', 'model', '3:2'],
  ['render-01', 'render', '16:9'],
  ['render-02', 'render', '3:4'],
  ['plan-ground', 'plan', '4:3'],
  ['plan-upper', 'plan', '4:3'],
  ['section', 'section', '21:9'],
  ['elevation', 'elevation', '21:9'],
  ['detail', 'drawing', '1:1'],
]
for (let p = 1; p <= 5; p++) {
  const id = `project-00${p}`
  for (const [name, kind, ratio] of PROJECT_SET) write(`projects/${id}/${name}.svg`, kind, ratio, `P-00${p} · ${name.toUpperCase()}`)
}

const CONCEPT_SET = [
  ['concept-01', [['01', 'sketch', '3:4'], ['02', 'diagram', '1:1']]],
  ['concept-02', [['01', 'model', '4:5'], ['02', 'model', '3:2']]],
  ['concept-03', [['01', 'drawing', '1:1'], ['02', 'section', '21:9']]],
  ['concept-04', [['01', 'render', '16:9'], ['02', 'sketch', '4:3']]],
  ['concept-05', [['01', 'diagram', '4:3'], ['02', 'plan', '1:1']]],
  ['concept-06', [['01', 'site', '3:2'], ['02', 'sketch', '2:3']]],
]
for (const [id, imgs] of CONCEPT_SET)
  for (const [n, kind, ratio] of imgs) write(`concepts/${id}/${n}.svg`, kind, ratio, `${id.toUpperCase()} · ${kind.toUpperCase()}`)

write('profile/hero.svg', 'render', '4:5', 'HERO IMAGE')
write('profile/hero-wide.svg', 'render', '16:9', 'HERO IMAGE')
write('profile/portrait.svg', 'portrait', '4:5', 'PORTRAIT')
write('sketches/studio-sketch.svg', 'sketch', '3:2', 'SKETCH')
write('drawings/studio-section.svg', 'section', '21:9', 'DRAWING')

console.log(`Generated ${count} placeholder SVGs in public/images`)
