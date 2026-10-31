import { useI18n } from '../../i18n/useI18n'
import { cn } from '../../lib/cn'

/** Marks template content so it is never mistaken for real work. */
export function PlaceholderBadge({ className, long = false }: { className?: string; long?: boolean }) {
  const { t } = useI18n()
  return (
    <span
      className={cn(
        'text-label inline-flex items-center gap-1.5 border border-dashed border-orange-deep px-2 py-0.5 text-[0.65rem] text-ink',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 bg-orange" />
      {long ? t.common.placeholderContent : t.common.placeholder}
    </span>
  )
}
