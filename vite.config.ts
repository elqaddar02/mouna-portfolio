import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { projects } from './src/data/projects'
import { SITE_URL } from './src/config/site'

/** Emits sitemap.xml at build time from the typed project data. */
function sitemap(): Plugin {
  return {
    name: 'portfolio-sitemap',
    apply: 'build',
    generateBundle() {
      const paths = ['/', '/works', '/concepts', '/about', '/contact', ...projects.map((p) => `/works/${p.slug}`)]
      const urls = paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap()],
})
