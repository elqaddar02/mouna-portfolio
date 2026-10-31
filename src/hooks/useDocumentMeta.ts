import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_NAME, SITE_URL } from '../config/site'
import { useI18n } from '../i18n/useI18n'

interface Meta {
  /** Page-specific title; omitted on the home page. */
  title?: string
  description: string
  /** Absolute or root-relative image for social cards. */
  image?: string
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/** Keeps <title>, description, canonical and Open Graph tags in sync with the route and language. */
export function useDocumentMeta({ title, description, image }: Meta) {
  const { pathname } = useLocation()
  const { lang } = useI18n()

  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:locale', lang === 'fr' ? 'fr_FR' : 'en_GB')
    setMeta('property', 'og:locale:alternate', lang === 'fr' ? 'en_GB' : 'fr_FR')
    setMeta('property', 'og:image', image ? new URL(image, SITE_URL).href : `${SITE_URL}/og-image.png`)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, image, pathname, lang])
}
