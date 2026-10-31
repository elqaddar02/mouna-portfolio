import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NAV_ITEMS } from '../../config/nav'
import { profile } from '../../data/profile'
import { fmt, useI18n } from '../../i18n/useI18n'
import { ContactLinks } from '../ui/ContactLinks'
import { Logo } from './Logo'

export function Footer() {
  const { t, l } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-2 border-ink bg-paper">
      <div className="frame grid-12 gap-y-10 py-12 md:py-16">
        <div className="col-span-4 md:col-span-5">
          <Logo full />
          <p className="mt-4 max-w-xs text-sm text-concrete-ink">
            {profile.name} — {l(profile.role)}
          </p>
        </div>

        <nav aria-label={t.nav.footer} className="col-span-2 md:col-span-3">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-label text-[0.78rem] hover:text-orange-deep">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-4">
          <ContactLinks compact />
        </div>
      </div>

      <div className="frame flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink py-5">
        <p className="text-label text-[0.68rem] text-concrete-ink">
          © {year} {profile.name}. {t.common.rights} · {fmt(t.common.madeWith, { year })}
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0 })}
          className="text-label group flex items-center gap-2 text-[0.72rem] hover:text-orange-deep"
        >
          {t.common.backToTop}
          <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
