import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface LabelProps {
  children: ReactNode
  /** Section index shown as "(01)". */
  index?: string | number
  className?: string
  as?: 'span' | 'p' | 'h2' | 'h3' | 'dt'
}

/** Monospaced technical annotation — the site's "drawing label". */
export function Label({ children, index, className, as: Tag = 'span' }: LabelProps) {
  return (
    <Tag className={cn('text-label inline-flex items-baseline gap-2', className)}>
      {index !== undefined && <span aria-hidden="true">({String(index).padStart(2, '0')})</span>}
      <span>{children}</span>
    </Tag>
  )
}
