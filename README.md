# WorkTape

AI-assisted portfolio builder for creative professionals. Users pick a genre, upload work, answer a few prompts — the app generates a polished, single-page portfolio at a public slug.

## Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS v4**, **Framer Motion**, **lucide-react**
- **Supabase** — Postgres + Auth + Storage
- **OpenAI-compatible API** — Kimi K2.5 for bio/description generation
- **Razorpay** — subscription payments (India)

## Supported genres

`photographer` · `graphic-designer` · `ui-ux-designer` · `writer` · `3d-artist` · `developer`

## Architecture (Lego-brick templates)

Templates live in `src/components/templates/<genre>/` and are registered in
`src/components/templates/registry.ts`. The route `src/app/[slug]/page.tsx` reads
the user's genre and lazy-loads the corresponding template.

Each template receives a single prop — `{ data: PortfolioData }` — where
`PortfolioData` is:

```ts
{
  portfolio: {
    display_name, tagline, bio_bullets, ai_bio, profile_photo_url,
    social_links, custom_headline, genre, ...
  }
  projects: Array<{
    title, description, ai_description, sort_order,
    images: Array<{ url, alt_text, width, height, sort_order }>
  }>
  user: { email, full_name, avatar_url, ... }
}
```

See `src/types/database.ts` for full type definitions.

**Templates are currently being designed externally.** The registry is intentionally
empty — requests to `/[slug]` for any genre will 404 until templates are wired in.

## Running locally

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase, OpenAI, Razorpay keys
pnpm dev
```

## Adding a template

1. Create `src/components/templates/<genre>/<VariantName>Template.tsx`
2. Default-export a component of type `ComponentType<TemplateProps>`
3. Uncomment (or add) the entry in `registry.ts`
4. Include `<WorktapeBadge />` in the footer

That's it — the route wires up automatically.
