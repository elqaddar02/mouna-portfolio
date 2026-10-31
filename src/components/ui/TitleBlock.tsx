import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'

interface TitleBlockProps {
  sheet: string
  scale?: string
  rev?: string
  className?: string
}

/** Drawing-sheet title block — a technical annotation borrowed from architectural drawings. */
export function TitleBlock({ sheet, scale = '1:1', rev = '01', className }: TitleBlockProps) {
  const { t } = useI18n()
  const cells = [
    [t.sheet.sheet, sheet],
    [t.sheet.scale, scale],
    [t.sheet.drawn, 'M.E.'],
    [t.sheet.rev, rev],
  ] as const
  return (
    <dl className={cn('grid grid-cols-4 border-2 border-ink bg-paper', className)}>
      {cells.map(([k, v], i) => (
        <div key={k} className={cn('px-2.5 py-1.5', i > 0 && 'border-l-2 border-ink')}>
          <dt className="text-label text-[0.6rem] text-concrete-ink">{k}</dt>
          <dd className="font-mono text-[0.78rem] font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  )
}
