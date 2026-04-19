# Photographer templates

Five drop-in portfolio variants for WorkTape's photographer genre. Each is a
self-contained folder exporting a default `ComponentType<TemplateProps>`.

| # | Folder                        | Personality                             |
| - | ----------------------------- | --------------------------------------- |
| 1 | `variant-1-editorial`         | Magazine-inspired, serif, asymmetric    |
| 2 | `variant-2-gallery`           | Swiss minimal, white cube, hairline     |
| 3 | `variant-3-brutalist`         | Mono + display, catalog index, friction |
| 4 | `variant-4-cinematic`         | Dark, full-bleed, horizontal filmstrips |
| 5 | `variant-5-zine`              | Warm, collage, handwritten + serif      |

Shared helpers live in `_shared/` (pure contract helpers and a lucide
SocialIcon wrapper). Motion sub-components (`Reveal`, `HorizontalTrack`) are
marked `'use client'`; all other rendering is a server component.

## Wiring

In `src/components/templates/registry.ts`, replace the commented line with any
one variant (the app currently accepts one template per genre):

```ts
photographer: () => import('./photographer/variant-1-editorial'),
// or variant-2-gallery / variant-3-brutalist / variant-4-cinematic / variant-5-zine
```

Extend the registry to an array later when the app supports multiple templates
per genre — every variant conforms to the same `TemplateProps` contract, so
selection becomes purely a lookup.
