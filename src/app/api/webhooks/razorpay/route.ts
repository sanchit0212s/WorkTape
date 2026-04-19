import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const isValid = verifyWebhookSignature(
    body,
    signature,
    process.env.RAZORPAY_WEBHOOK_SECRET!
  )

  if (!isValid) {
    console.error('Razorpay webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)
  const supabase = createAdminClient()

  try {
    switch (event.event) {
      case 'subscription.activated': {
        const sub = event.payload.subscription.entity
        const userId = sub.notes?.userId
        if (!userId) break

        await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            razorpay_subscription_id: sub.id,
            razorpay_customer_id: sub.customer_id || '',
            status: 'active',
            current_period_start: sub.current_start
              ? new Date(sub.current_start * 1000).toISOString()
              : null,
            current_period_end: sub.current_end
              ? new Date(sub.current_end * 1000).toISOString()
              : null,
            cancel_at_period_end: false,
          },
          { onConflict: 'user_id' }
        )
        break
      }

      case 'subscription.charged': {
        const sub = event.payload.subscription.entity
        const userId = sub.notes?.userId
        if (!userId) break

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_start: sub.current_start
              ? new Date(sub.current_start * 1000).toISOString()
              : null,
            current_period_end: sub.current_end
              ? new Date(sub.current_end * 1000).toISOString()
              : null,
          })
          .eq('user_id', userId)
        break
      }

      case 'subscription.pending': {
        const sub = event.payload.subscription.entity
        const userId = sub.notes?.userId
        if (!userId) break

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('user_id', userId)
        break
      }

      case 'subscription.halted':
      case 'subscription.cancelled': {
        const sub = event.payload.subscription.entity
        const userId = sub.notes?.userId
        if (!userId) break

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('user_id', userId)

        await supabase
          .from('portfolios')
          .update({ status: 'draft', published_at: null })
          .eq('user_id', userId)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Razorpay webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
