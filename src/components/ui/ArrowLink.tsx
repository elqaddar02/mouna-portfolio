import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

interface ArrowLinkProps {
  to: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'text' | 'inverse'
  external?: boolean
  download?: boolean
  className?: string
}

const styles = {
  solid: 'border-2 border-ink bg-ink text-paper hover:bg-orange hover:text-ink hover:border-ink px-5 py-3.5',
  outline: 'border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-paper px-5 py-3.5',
  inverse: 'border-2 border-paper bg-paper text-ink hover:bg-orange hover:border-orange px-5 py-3.5',
  text: 'border-b-2 border-current pb-1 hover:text-orange-deep',
}

/** Brutalist call-to-action. Internal paths use the router; external URLs open normally. */
export function ArrowLink({ to, children, variant = 'outline', external, download, className }: ArrowLinkProps) {
  const Icon = external ? ArrowUpRight : ArrowRight
  const classes = cn(
    'group text-label inline-flex items-center gap-3 text-[0.8rem] transition-colors duration-200',
    styles[variant],
    className,
  )
  const content = (
    <>
      <span>{children}</span>
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform duration-300 ease-arch group-hover:translate-x-1"
        strokeWidth={2.25}
      />
    </>
  )
  if (external || download || /^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a
        href={to}
        className={classes}
        {...(download ? { download: '' } : {})}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }
  return (
    <Link to={to} className={classes}>
      {content}
    </Link>
  )
}
