import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { pickTemplate } from '@/components/templates/registry'
import type { Genre, PortfolioData } from '@/types/database'
import type { Metadata } from 'next'

// Always fetch fresh portfolio data — template / content edits should appear
// on the published URL immediately, not after a cache tick. Supabase reads
// are fast enough that a cold fetch per request is fine at our scale.
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPortfolioData(slug: string): Promise<PortfolioData | null> {
  const supabase = await createClient()

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select(`
      *,
      users!inner(id, email, full_name, avatar_url, created_at, updated_at)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!portfolio) return null

  const { data: projects } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('portfolio_id', portfolio.id)
    .order('sort_order', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projectsWithImages = (projects || []).map((p: any) => ({
    id: p.id,
    portfolio_id: p.portfolio_id,
    title: p.title,
    description: p.description,
    ai_description: p.ai_description,
    sort_order: p.sort_order,
    created_at: p.created_at,
    updated_at: p.updated_at,
    images: (p.project_images || []).sort(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any, b: any) => a.sort_order - b.sort_order
    ),
  }))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = portfolio.users as any

  return {
    portfolio: {
      id: portfolio.id,
      user_id: portfolio.user_id,
      genre: portfolio.genre,
      slug: portfolio.slug,
      status: portfolio.status,
      display_name: portfolio.display_name,
      tagline: portfolio.tagline,
      bio_bullets: portfolio.bio_bullets,
      ai_bio: portfolio.ai_bio,
      profile_photo_url: portfolio.profile_photo_url,
      social_links: portfolio.social_links,
      custom_headline: portfolio.custom_headline,
      published_at: portfolio.published_at,
      created_at: portfolio.created_at,
      updated_at: portfolio.updated_at,
    },
    projects: projectsWithImages,
    user,
  } as PortfolioData
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getPortfolioData(slug)

  if (!data) {
    return { title: 'Not Found' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://worktape.com'

  return {
    title: `${data.portfolio.display_name} — Portfolio`,
    description:
      data.portfolio.ai_bio ||
      data.portfolio.tagline ||
      `${data.portfolio.display_name}'s portfolio`,
    openGraph: {
      title: `${data.portfolio.display_name} — Portfolio`,
      description:
        data.portfolio.tagline || `${data.portfolio.display_name}'s portfolio`,
      images: data.portfolio.profile_photo_url
        ? [{ url: data.portfolio.profile_photo_url }]
        : [],
      url: `${appUrl}/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.portfolio.display_name} — Portfolio`,
      description:
        data.portfolio.tagline || `${data.portfolio.display_name}'s portfolio`,
    },
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getPortfolioData(slug)

  if (!data) {
    notFound()
  }

  const genre = data.portfolio.genre as Genre
  const loader = pickTemplate(genre, data.portfolio.template_variant ?? undefined)

  if (!loader) {
    notFound()
  }

  const { default: TemplateComponent } = await loader()

  return <TemplateComponent data={data} />
}
