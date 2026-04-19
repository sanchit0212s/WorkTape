export type Genre =
  | 'photographer'
  | 'graphic-designer'
  | 'ui-ux-designer'
  | 'writer'
  | '3d-artist'
  | 'developer'

export type PortfolioStatus = 'draft' | 'published'

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Portfolio {
  id: string
  user_id: string
  genre: Genre
  slug: string | null
  status: PortfolioStatus
  display_name: string
  tagline: string
  bio_bullets: string[]
  ai_bio: string | null
  profile_photo_url: string | null
  social_links: Record<string, string>
  custom_headline: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  portfolio_id: string
  title: string
  description: string | null
  ai_description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: string
  project_id: string
  storage_path: string
  url: string
  alt_text: string | null
  sort_order: number
  width: number | null
  height: number | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  razorpay_customer_id: string
  razorpay_subscription_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface PortfolioData {
  portfolio: Portfolio
  projects: (Project & { images: ProjectImage[] })[]
  user: User
}
