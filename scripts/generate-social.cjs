#!/usr/bin/env node
/**
 * Renders public/og-image.png (1200×630) with the site's fonts and Mouna's logo.
 * (Icons are produced by scripts/brand/build.py.)
 * with the site's own fonts. Requires Playwright with Chromium available:
 *   node scripts/generate-social.cjs
 */
const { chromium } = require('playwright')
const { writeFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join } = require('node:path')
const { pathToFileURL } = require('node:url')

const root = join(__dirname, '..')
const font = (pkg, file) => pathToFileURL(join(root, 'node_modules', pkg, 'files', file)).href

const css = `
@font-face { font-family: SG; src: url(${font('@fontsource-variable/space-grotesk', 'space-grotesk-latin-wght-normal.woff2')}); font-weight: 300 700; }
@font-face { font-family: Mono; src: url(${font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-500-normal.woff2')}); }
* { margin: 0; box-sizing: border-box; }
body { background: #F1EFE8; color: #171717; font-family: SG; }
.mono { font-family: Mono; text-transform: uppercase; letter-spacing: .08em; font-size: 20px; }
`

const og = `<html><head><style>${css}
body { width: 1200px; height: 630px; padding: 56px 64px; display: flex; flex-direction: column;
  background-image: linear-gradient(to right, rgb(23 23 23 / .06) 1px, transparent 1px), linear-gradient(to bottom, rgb(23 23 23 / .06) 1px, transparent 1px); background-size: 48px 48px; }
.top { display: flex; justify-content: space-between; border-bottom: 3px solid #171717; padding-bottom: 14px; }
h1 { font-size: 150px; line-height: .84; letter-spacing: -.055em; font-weight: 700; margin-top: 64px; }
.dot { color: #8A5232; }
.bottom { margin-top: auto; display: flex; justify-content: space-between; align-items: end; }
.tag { font-size: 34px; font-weight: 600; letter-spacing: -.02em; line-height: 1.05; text-transform: uppercase; }
.logo { height: 150px; display: block; }
</style></head><body>
<div class="top mono"><span>(A-000) Portfolio</span><span>Architecture Student</span><span>EN / FR</span></div>
<h1>MOUNA<br>ELQADDAR<span class="dot">.</span></h1>
<div class="bottom"><div class="tag">Designing spaces.<br><span style="color:#5F5C56">Exploring form.</span></div><img class="logo" src="${pathToFileURL(join(root, 'public', 'brand', 'logo-light.png')).href}" alt=""></div>
</body></html>`


;(async () => {
  const browser = await chromium.launch()
  for (const [html, w, h, out] of [
    [og, 1200, 630, 'og-image.png'],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } })
    // Loaded from a file (not setContent) so the file:// font URLs are allowed.
    const tmp = join(tmpdir(), `me-social-${out}.html`)
    writeFileSync(tmp, html)
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: join(root, 'public', out) })
    rmSync(tmp)
    console.log('wrote public/' + out)
  }
  await browser.close()
})()
