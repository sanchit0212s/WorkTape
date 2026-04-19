'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Loader2, Check, ExternalLink } from 'lucide-react'
import { slugify, isReservedSlug } from '@/lib/utils'
import type { Portfolio, Subscription } from '@/types/database'
import Script from 'next/script'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

export default function PublishPage() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [slug, setSlug] = useState('')
  const [slugError, setSlugError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: pf } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!pf) {
      router.push('/dashboard/onboarding')
      return
    }

    setPortfolio(pf as Portfolio)
    setSlug(pf.slug || '')

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    setSubscription(sub as Subscription | null)
    setLoading(false)
  }, [router])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function validateSlug(value: string) {
    const cleaned = slugify(value)
    setSlug(cleaned)

    if (!cleaned) {
      setSlugError('Please enter a URL slug.')
      return
    }
    if (cleaned.length < 3) {
      setSlugError('Slug must be at least 3 characters.')
      return
    }
    if (isReservedSlug(cleaned)) {
      setSlugError('This slug is reserved.')
      return
    }

    const supabase = createClient()
    const { data: existing } = await supabase
      .from('portfolios')
      .select('id')
      .eq('slug', cleaned)
      .neq('id', portfolio?.id || '')
      .single()

    if (existing) {
      setSlugError('This slug is already taken.')
      return
    }

    setSlugError(null)
  }

  async function handleCheckout() {
    setCheckingOut(true)

    try {
      const res = await fetch('/api/razorpay/checkout', { method: 'POST' })
      const { subscriptionId, keyId, error } = await res.json()

      if (error) {
        setCheckingOut(false)
        return
      }

      const options = {
        key: keyId,
        subscription_id: subscriptionId,
        name: 'Worktape',
        description: 'Worktape Pro — Monthly Subscription',
        handler: async () => {
          setSuccessMessage('Payment successful! You can now publish your portfolio.')
          // Reload subscription data
          await loadData()
        },
        modal: {
          ondismiss: () => {
            setCheckingOut(false)
          },
        },
        theme: {
          color: '#ffffff',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch {
      setCheckingOut(false)
    }
  }

  async function handlePublish() {
    if (!portfolio || !slug || slugError) return
    setPublishing(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('portfolios')
      .update({
        slug,
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', portfolio.id)

    if (error) {
      setPublishing(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function handleUnpublish() {
    if (!portfolio) return
    setPublishing(true)

    const supabase = createClient()
    await supabase
      .from('portfolios')
      .update({ status: 'draft', published_at: null })
      .eq('id', portfolio.id)

    setPortfolio({ ...portfolio, status: 'draft', published_at: null })
    setPublishing(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    )
  }

  // TODO: Re-enable subscription check when Razorpay is set up
  const isSubscribed = true // subscription?.status === 'active'
  const isPublished = portfolio?.status === 'published'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="max-w-xl mx-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <h1 className="text-2xl font-bold text-white mb-2">Publish</h1>
      <p className="text-neutral-400 mb-8">
        {isPublished
          ? 'Your portfolio is live.'
          : 'Subscribe and choose your URL to go live.'}
      </p>

      {successMessage && (
        <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Step 1: Subscription */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium">Subscription</h3>
          {isSubscribed && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              Active
            </span>
          )}
        </div>
        {isSubscribed ? (
          <p className="text-sm text-neutral-400">
            Worktape Pro — $10/month
          </p>
        ) : (
          <>
            <p className="text-sm text-neutral-400 mb-4">
              Worktape Pro — $10/month. Includes your portfolio, all templates,
              and up to 5 projects.
            </p>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full px-4 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50"
            >
              {checkingOut ? 'Opening payment...' : 'Subscribe — $10/month'}
            </button>
          </>
        )}
      </div>

      {/* Step 2: URL Slug */}
      <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 mb-4">
        <h3 className="text-white font-medium mb-3">Portfolio URL</h3>
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 text-sm shrink-0">
            worktape.com/
          </span>
          <input
            value={slug}
            onChange={(e) => validateSlug(e.target.value)}
            placeholder="yourname"
            className="flex-1 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors text-sm"
            disabled={!isSubscribed}
          />
        </div>
        {slugError && (
          <p className="text-red-400 text-xs mt-2">{slugError}</p>
        )}
      </div>

      {/* Publish / Unpublish */}
      {isPublished ? (
        <div className="space-y-3">
          <a
            href={`${appUrl}/${portfolio?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors"
          >
            View Portfolio
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleUnpublish}
            disabled={publishing}
            className="w-full px-4 py-3 rounded-lg border border-neutral-700 text-neutral-300 font-medium hover:bg-neutral-800 transition-colors"
          >
            {publishing ? 'Unpublishing...' : 'Unpublish'}
          </button>
        </div>
      ) : (
        <button
          onClick={handlePublish}
          disabled={!isSubscribed || !slug || !!slugError || publishing}
          className="w-full px-4 py-3 rounded-lg bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {publishing ? 'Publishing...' : 'Publish Portfolio'}
        </button>
      )}
    </div>
  )
}
