import { cn } from '../../lib/cn'

/** M/E. wordmark — the orange full stop is the identity's single accent. */
export function Logo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'font-display text-[1.6rem] font-bold leading-none tracking-[-0.06em]',
        inverse ? 'text-paper' : 'text-ink',
        className,
      )}
    >
      M<span className="mx-[0.04em] font-medium">/</span>E<span className="text-orange">.</span>
    </span>
  )
}
