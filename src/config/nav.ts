import type { Dictionary } from '../i18n/en'

export interface NavItem {
  to: string
  key: keyof Pick<Dictionary['nav'], 'home' | 'works' | 'concepts' | 'about' | 'contact'>
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', key: 'home' },
  { to: '/works', key: 'works' },
  { to: '/concepts', key: 'concepts' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
]
