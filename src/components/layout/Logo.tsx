import { cn } from '../../lib/cn'

/** Brand name as written in Mouna's logo. */
export const BRAND = 'M.ELQADD’ARTchitects'

interface LogoProps {
  /** Light artwork for dark backgrounds. */
  inverse?: boolean
  /** Mark with lettering (footer) instead of the mark alone (header). */
  full?: boolean
  className?: string
}

/**
 * Mouna's logo, redrawn in the site palette by scripts/brand/build.py:
 * concrete M + ink line-work on paper, or dark M + paper line-work on ink.
 */
export function Logo({ inverse = false, full = false, className }: LogoProps) {
  const variant = inverse ? 'dark' : 'light'
  return full ? (
    <img
      src={`/brand/logo-${variant}.webp`}
      alt={BRAND}
      width={760}
      height={625}
      className={cn('h-auto w-56', className)}
    />
  ) : (
    <img
      src={`/brand/mark-${variant}.webp`}
      alt={BRAND}
      width={206}
      height={176}
      className={cn('h-12 w-auto', className)}
    />
  )
}
