import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Check if user has a portfolio
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id, genre, slug, status, display_name')
    .eq('user_id', user.id)
    .single()

  // No portfolio yet — send to onboarding
  if (!portfolio) {
    redirect('/dashboard/onboarding')
  }

  // Check project count
  const { count: projectCount } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('portfolio_id', portfolio.id)

  // Check subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const isPublished = portfolio.status === 'published'
  const isSubscribed = subscription?.status === 'active'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {portfolio.display_name || 'Your Portfolio'}
        </h1>
        <p className="text-neutral-400 mt-1">
          {portfolio.genre.replace('-', ' ')} portfolio
          {isPublished && portfolio.slug && (
            <>
              {' '}
              &middot;{' '}
              <a
                href={`${appUrl}/${portfolio.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                {portfolio.slug}
                <ExternalLink className="w-3 h-3" />
              </a>
            </>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Edit Profile */}
        <Link
          href="/dashboard/onboarding/profile"
          className="group p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 transition-colors"
        >
          <h3 className="text-white font-medium flex items-center justify-between">
            Edit Profile
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            Update your name, bio, photo, and social links.
          </p>
        </Link>

        {/* Manage Projects */}
        <Link
          href="/dashboard/projects"
          className="group p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 transition-colors"
        >
          <h3 className="text-white font-medium flex items-center justify-between">
            Projects ({projectCount ?? 0}/5)
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            Add, edit, or reorder your portfolio projects.
          </p>
        </Link>

        {/* Publish */}
        <Link
          href="/dashboard/publish"
          className="group p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 transition-colors"
        >
          <h3 className="text-white font-medium flex items-center justify-between">
            {isPublished ? 'Published' : 'Publish'}
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            {isPublished
              ? 'Manage your live portfolio and URL.'
              : isSubscribed
                ? 'Choose your URL and go live.'
                : 'Subscribe to publish your portfolio.'}
          </p>
        </Link>

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className="group p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/50 transition-colors"
        >
          <h3 className="text-white font-medium flex items-center justify-between">
            Settings
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            Manage subscription, account, and billing.
          </p>
        </Link>
      </div>
    </div>
  )
}
