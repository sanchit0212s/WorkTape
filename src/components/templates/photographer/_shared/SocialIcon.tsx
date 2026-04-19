// Social icon wrapper — renders the correct icon per social_links key.
//
// Brand marks come from the project's custom SVG set (src/components/icons.tsx)
// because lucide-react dropped brand icons for trademark reasons. Generic
// icons (Globe, Mail, ExternalLink) still come from lucide. Dribbble and
// YouTube use inline SVGs since the project's custom set doesn't have them yet.
import type { SVGProps, ReactElement } from 'react'
import { Globe, Mail, ExternalLink } from 'lucide-react'
import {
  IconInstagram,
  IconTwitter,
  IconLinkedin,
  IconGithub,
} from '@/components/icons'

type IconComponent = (props: { className?: string }) => ReactElement

function IconDribbble({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
    </svg>
  )
}

function IconYoutube({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

// Small wrappers so lucide icons match the brand-icon signature (className-only).
function LucideGlobe({ className }: { className?: string }) {
  return <Globe className={className} aria-hidden />
}
function LucideMail({ className }: { className?: string }) {
  return <Mail className={className} aria-hidden />
}
function LucideExternal({ className }: { className?: string }) {
  return <ExternalLink className={className} aria-hidden />
}

const ICONS: Record<string, IconComponent> = {
  instagram: IconInstagram,
  twitter: IconTwitter,
  linkedin: IconLinkedin,
  github: IconGithub,
  dribbble: IconDribbble,
  behance: LucideExternal, // project has no Behance mark yet; generic link icon
  youtube: IconYoutube,
  website: LucideGlobe,
  email: LucideMail,
}

interface Props {
  k: string
  size?: number
  className?: string
}

export function SocialIcon({ k, size = 16, className }: Props) {
  const Icon = ICONS[k] ?? LucideExternal
  const style = { width: size, height: size } as SVGProps<SVGSVGElement>['style']
  return (
    <span
      style={style}
      className={`inline-flex items-center justify-center ${className ?? ''}`}
    >
      <Icon className="w-full h-full" />
    </span>
  )
}
