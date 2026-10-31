import { LANGS } from '../../data/types'
import { fmt, useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'

const NAMES = { en: 'English', fr: 'Français' } as const

export function LanguageSwitcher({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t.nav.language} className={cn('flex border-2', inverse ? 'border-paper' : 'border-ink', className)}>
      {LANGS.map((code) => {
        const active = code === lang
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={active ? NAMES[code] : fmt(t.nav.switchTo, { lang: NAMES[code] })}
            className={cn(
              'text-label min-w-10 px-2.5 py-1.5 text-[0.72rem] transition-colors',
              active
                ? inverse
                  ? 'bg-paper text-ink'
                  : 'bg-ink text-paper'
                : inverse
                  ? 'text-paper hover:bg-orange hover:text-ink'
                  : 'text-ink hover:bg-orange',
            )}
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
