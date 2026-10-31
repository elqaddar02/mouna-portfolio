import { Mail, MapPin } from 'lucide-react'
import type { SVGProps } from 'react'
import type { ContactRow } from './ContactLinks'

type IconProps = SVGProps<SVGSVGElement>

/** Line glyphs in the same 24px / 2px-stroke style as the Lucide icons (Lucide ships no brand marks). */
function LinkedInGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="2" />
      <path d="M7.5 10.5v6" />
      <circle cx="7.5" cy="7.3" r="0.6" fill="currentColor" />
      <path d="M11.5 16.5v-6M11.5 13.3c0-1.7 1.1-2.8 2.5-2.8s2.5 1.1 2.5 2.8v3.2" />
    </svg>
  )
}

function InstagramGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </svg>
  )
}

const ICONS = { email: Mail, location: MapPin, linkedin: LinkedInGlyph, instagram: InstagramGlyph } as const

export function ContactIcon({ kind, className }: { kind: ContactRow['key']; className?: string }) {
  const Icon = ICONS[kind]
  return <Icon aria-hidden="true" className={className} />
}
