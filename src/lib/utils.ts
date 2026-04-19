import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

const RESERVED_SLUGS = new Set([
  'dashboard',
  'auth',
  'api',
  'admin',
  'settings',
  'login',
  'signup',
  'about',
  'pricing',
  'blog',
  'help',
  'support',
  'terms',
  'privacy',
  'contact',
])

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase())
}
