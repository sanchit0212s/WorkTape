'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Loader2, CreditCard } from 'lucide-react'
import type { Subscription } from '@/types/database'

export default function SettingsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setSubscription(data as Subscription | null)
      setLoading(false)
    }
    load()
  }, [])

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel your subscription? Your portfolio will be unpublished at the end of the billing period.')) {
      return
    }

    setCanceling(true)
    const res = await fetch('/api/razorpay/portal', { method: 'POST' })
    const data = await res.json()

    if (data.success) {
      setMessage('Subscription will be canceled at the end of your billing period.')
      setSubscription((prev) =>
        prev ? { ...prev, cancel_at_period_end: true } : prev
      )
    } else {
      setMessage('Failed to cancel. Please try again.')
    }
    setCanceling(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    )
  }

  const isActive = subscription?.status === 'active'

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/50">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-neutral-400" />
          <h3 className="text-white font-medium">Billing</h3>
        </div>

        {subscription ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Plan</span>
              <span className="text-sm text-white">Worktape Pro — $10/mo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">Status</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {subscription.status}
              </span>
            </div>
            {subscription.cancel_at_period_end && (
              <p className="text-xs text-amber-400">
                Your subscription will end on{' '}
                {new Date(subscription.current_period_end!).toLocaleDateString()}.
              </p>
            )}

            {message && (
              <p className="text-sm text-neutral-400">{message}</p>
            )}

            {isActive && !subscription.cancel_at_period_end && (
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {canceling ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Cancel Subscription'
                )}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">
            No active subscription. Subscribe to publish your portfolio.
          </p>
        )}
      </div>
    </div>
  )
}
