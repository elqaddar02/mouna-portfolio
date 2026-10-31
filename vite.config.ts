import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { CONTENT_DIR, writeContent } from './scripts/content.mjs'
import { SITE_URL } from './src/config/site'

/**
 * Compiles /content into src/data/generated/content.json at startup, and again
 * in dev whenever a content file changes (errors show in the browser overlay).
 * Also emits sitemap.xml and robots.txt at build time.
 */
function content(): Plugin {
  let slugs: string[] = []
  return {
    name: 'portfolio-content',
    buildStart() {
      slugs = writeContent().projects.map((p) => p.slug)
    },
    configureServer(server) {
      server.watcher.add(CONTENT_DIR)
      const rebuild = (file: string) => {
        if (!file.startsWith(CONTENT_DIR)) return
        try {
          writeContent()
        } catch (e) {
          server.ws.send({ type: 'error', err: { message: (e as Error).message, stack: '' } })
        }
      }
      server.watcher.on('change', rebuild)
      server.watcher.on('add', rebuild)
      server.watcher.on('unlink', rebuild)
    },
    generateBundle() {
      const paths = ['/', '/works', '/concepts', '/about', '/contact', ...slugs.map((s) => `/works/${s}`)]
      const urls = paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), content()],
})
