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

/** Prefix mailto: for email keys, pass through otherwise. */
export function socialHref(key: string, value: string): string {
  if (key === 'email' && !value.startsWith('mailto:')) return `mailto:${value}`
  return value
}

export function socialEntries(
  social: Record<string, string> | null | undefined,
): Array<[string, string]> {
  if (!social) return []
  return Object.entries(social).filter(([, v]) => Boolean(v))
}
