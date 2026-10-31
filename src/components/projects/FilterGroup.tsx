import { cn } from '../../lib/cn'

export interface FilterOption {
  value: string
  label: string
  count: number
}

interface FilterGroupProps {
  label: string
  allLabel: string
  options: FilterOption[]
  /** Currently selected value; null means "all". */
  value: string | null
  onChange: (value: string | null) => void
}

/** Single-choice filter row rendered as toggle buttons. */
export function FilterGroup({ label, allLabel, options, value, onChange }: FilterGroupProps) {
  const chip = (active: boolean) =>
    cn(
      'text-label shrink-0 whitespace-nowrap border-2 border-ink px-3 py-1.5 text-[0.7rem] transition-colors',
      active ? 'bg-ink text-paper' : 'bg-paper hover:bg-orange hover:text-paper',
    )

  return (
    <div role="group" aria-label={label} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <span className="text-label w-28 shrink-0 text-[0.68rem] text-concrete-ink" aria-hidden="true">
        {label}
      </span>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0">
        <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={chip(value === null)}>
          {allLabel}
        </button>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(value === o.value ? null : o.value)}
            className={chip(value === o.value)}
          >
            {o.label} <span>({o.count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
