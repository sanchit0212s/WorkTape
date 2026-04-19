import type { Genre } from '@/types/database'
import type { ComponentType } from 'react'
import type { TemplateProps } from './types'

type TemplateLoader = () => Promise<{ default: ComponentType<TemplateProps> }>

/**
 * Template registry — intentionally empty.
 *
 * Templates are designed externally (one genre at a time, 5 variants each)
 * and then dropped into this project like Lego bricks. To wire a new template:
 *
 *   1. Add folder: src/components/templates/<genre>/<VariantName>Template.tsx
 *   2. Default-export a React component of type ComponentType<TemplateProps>
 *   3. Register it below under its Genre key
 *
 * Until templates are registered, the [slug]/page.tsx route falls through
 * to notFound() for that genre — the expected behavior during template design.
 */
export const templateRegistry: Partial<Record<Genre, TemplateLoader>> = {
  // photographer: () => import('./photographer/PhotographerTemplate'),
  // 'graphic-designer': () => import('./graphic-designer/GraphicDesignerTemplate'),
  // 'ui-ux-designer': () => import('./ui-ux-designer/UiUxDesignerTemplate'),
  // writer: () => import('./writer/WriterTemplate'),
  // '3d-artist': () => import('./3d-artist/ThreeDTemplate'),
  // developer: () => import('./developer/DeveloperTemplate'),
}
