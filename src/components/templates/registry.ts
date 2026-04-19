// src/components/templates/registry.ts
//
// Central registry for all WorkTape template components, keyed by Genre.
// Each entry is a lazy loader so the host app code-splits one template
// bundle per visitor — no genre loads anything it doesn't need.
//
// Photographer is the first genre with multiple designed variants (five).
// Other genres remain unregistered; the app is expected to fall through
// to notFound() until their templates land — that's the per-genre rollout
// plan, not a bug.
//
// --------------------------------------------------------------------------
// Extending to multiple templates per genre
// --------------------------------------------------------------------------
// The current app contract is one template per genre, so `templateRegistry`
// still exports a single loader per Genre (whichever photographer variant is
// "live"). When the app grows a picker, swap the consumer to
// `templateVariantRegistry` below — it exposes every variant under a stable
// slug, and `pickTemplate(genre, slug)` returns the loader without the
// caller needing to know the folder layout.

import type { Genre } from '@/types/database'
import type { ComponentType } from 'react'
import type { TemplateProps } from './types'

type TemplateLoader = () => Promise<{ default: ComponentType<TemplateProps> }>

// --------------------------------------------------------------------------
// Photographer variant catalog
// --------------------------------------------------------------------------

export type PhotographerVariantSlug =
  | 'editorial'
  | 'gallery'
  | 'brutalist'
  | 'cinematic'
  | 'zine'

export interface VariantMeta {
  slug: PhotographerVariantSlug
  label: string
  personality: string
  load: TemplateLoader
}

export const photographerVariants: readonly VariantMeta[] = [
  {
    slug: 'editorial',
    label: 'Editorial',
    personality: 'Magazine-inspired, serif, asymmetric',
    load: () => import('./photographer/variant-1-editorial'),
  },
  {
    slug: 'gallery',
    label: 'Gallery',
    personality: 'Swiss minimal, white cube, hairline',
    load: () => import('./photographer/variant-2-gallery'),
  },
  {
    slug: 'brutalist',
    label: 'Brutalist',
    personality: 'Mono + display, catalog index, friction',
    load: () => import('./photographer/variant-3-brutalist'),
  },
  {
    slug: 'cinematic',
    label: 'Cinematic',
    personality: 'Dark, full-bleed, horizontal filmstrips',
    load: () => import('./photographer/variant-4-cinematic'),
  },
  {
    slug: 'zine',
    label: 'Zine',
    personality: 'Warm, collage, handwritten + serif',
    load: () => import('./photographer/variant-5-zine'),
  },
] as const

// Default variant — the one `templateRegistry.photographer` points at today.
// Change this one identifier to swap the live template across the app.
export const DEFAULT_PHOTOGRAPHER_VARIANT: PhotographerVariantSlug = 'editorial'

// --------------------------------------------------------------------------
// Per-genre variant map (future: the app picks one of these at render time)
// --------------------------------------------------------------------------

export const templateVariantRegistry: Partial<
  Record<Genre, Record<string, TemplateLoader>>
> = {
  photographer: Object.fromEntries(
    photographerVariants.map((v) => [v.slug, v.load]),
  ),
  // writer:      { ... },
  // musician:    { ... },
  // illustrator: { ... },
  // filmmaker:   { ... },
  // developer:   { ... },
}

/**
 * Resolve a template loader for a genre + variant slug. Returns `undefined`
 * when the genre has no templates yet, or the slug doesn't match a variant.
 * Callers should treat `undefined` the same as "no template registered" and
 * fall through to notFound().
 */
export function pickTemplate(
  genre: Genre,
  slug?: string,
): TemplateLoader | undefined {
  const variants = templateVariantRegistry[genre]
  if (!variants) return undefined

  if (slug && variants[slug]) return variants[slug]

  // Genre-specific defaults. Add a case per genre as they come online.
  if (genre === 'photographer') {
    return variants[DEFAULT_PHOTOGRAPHER_VARIANT]
  }

  // Fallback: first registered variant for the genre.
  const first = Object.values(variants)[0]
  return first
}

// --------------------------------------------------------------------------
// Legacy single-template-per-genre registry (what the app consumes today)
// --------------------------------------------------------------------------
// Keep the shape the rest of the app already imports — a flat
// `Partial<Record<Genre, TemplateLoader>>`. This stays in sync with the
// variant catalog via `pickTemplate`, so flipping
// `DEFAULT_PHOTOGRAPHER_VARIANT` above is the only edit needed to swap
// which photographer template ships.

export const templateRegistry: Partial<Record<Genre, TemplateLoader>> = {
  photographer: pickTemplate('photographer')!,

  // (other genres still not registered — app falls through to notFound()
  //  until templates are designed, which is the expected per-genre rollout)
}
