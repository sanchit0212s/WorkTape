import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRazorpay } from '@/lib/razorpay/client'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('razorpay_subscription_id')
    .eq('user_id', user.id)
    .single()

  if (!subscription?.razorpay_subscription_id) {
    return NextResponse.json(
      { error: 'No subscription found' },
      { status: 404 }
    )
  }

  try {
    const razorpay = getRazorpay()

    await razorpay.subscriptions.cancel(
      subscription.razorpay_subscription_id,
      false
    )

    await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('user_id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Razorpay cancel error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
