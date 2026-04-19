// Shared helpers for photographer templates.
// Keep these pure; they mirror the data-contract priority rules.
import type { Portfolio, Project } from '@/types/database'

export function bioText(p: Portfolio): string | null {
  if (p.ai_bio) return p.ai_bio
  if (p.bio_bullets && p.bio_bullets.length > 0) return p.bio_bullets.join(' ')
  return null
}

export function projectDescription(pr: Project): string | null {
  return pr.ai_description || pr.description || null
}

export function heroHeadline(p: Portfolio): string {
  return p.custom_headline || p.display_name
}

export const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  dribbble: 'Dribbble',
  behance: 'Behance',
  youtube: 'YouTube',
  website: 'Website',
  email: 'Email',
}

export function socialLabel(key: string): string {
  return SOCIAL_LABELS[key] ?? key
}

/**
 * Build a valid href for a social link.
 *
 * Users may enter either a full URL (https://instagram.com/someone) or just a
 * username ('someone'). This normalises both shapes to a working URL:
 *   - email        → mailto:<value>
 *   - website      → passed through (assume user typed a URL)
 *   - instagram/twitter/linkedin/github/dribbble/behance/youtube → construct
 *     the canonical profile URL from the username, or pass through if the
 *     value already contains a scheme or a domain.
 */
const SOCIAL_URL_PREFIX: Record<string, string> = {
  instagram: 'https://instagram.com/',
  twitter: 'https://x.com/',
  linkedin: 'https://www.linkedin.com/in/',
  github: 'https://github.com/',
  dribbble: 'https://dribbble.com/',
  behance: 'https://www.behance.net/',
  youtube: 'https://www.youtube.com/@',
}

export function socialHref(key: string, value: string): string {
  const v = value.trim()
  if (!v) return '#'

  if (key === 'email') {
    return v.startsWith('mailto:') ? v : `mailto:${v}`
  }

  // If the value already looks like a URL (has scheme or contains a dot that
  // isn't inside a username like "jane.doe"), pass it through.
  if (/^https?:\/\//i.test(v)) return v

  if (key === 'website') {
    // User typed a bare domain — prepend https://
    return `https://${v.replace(/^\/+/, '')}`
  }

  const prefix = SOCIAL_URL_PREFIX[key]
  if (prefix) {
    // Strip any leading @ / slash, then prefix with the canonical base.
    const handle = v.replace(/^[@/]+/, '')
    return `${prefix}${handle}`
  }

  // Unknown key — pass through untouched.
  return v
}

export function socialEntries(
  social: Record<string, string> | null | undefined,
): Array<[string, string]> {
  if (!social) return []
  return Object.entries(social).filter(([, v]) => Boolean(v))
}
