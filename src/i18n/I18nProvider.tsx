import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LANGS, type Lang, type Localized } from '../data/types'
import { en, type Dictionary } from './en'
import { fr } from './fr'

const DICTIONARIES: Record<Lang, Dictionary> = { en, fr }
const STORAGE_KEY = 'me-portfolio.lang'
const DEFAULT_LANG: Lang = 'en'

export interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** UI dictionary for the current language. */
  t: Dictionary
  /** Picks the current language from a bilingual content value. */
  l: (value: Localized) => string
}

export const I18nContext = createContext<I18nValue | null>(null)

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (LANGS as readonly string[]).includes(stored)) return stored as Lang
  } catch {
    /* storage unavailable (private mode) — fall back to default */
  }
  return DEFAULT_LANG
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t: DICTIONARIES[lang], l: (v) => v[lang] || v.en }),
    [lang, setLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
