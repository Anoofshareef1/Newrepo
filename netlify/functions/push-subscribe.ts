import { getStore } from '@netlify/blobs'

interface PushSubscriptionRecord {
  subscription: PushSubscriptionJSON
  flightIds: string[]
  reminders?: Record<string, number>
  vapidPublicKey?: string
}

interface PushSubscriptionJSON {
  endpoint: string
  expirationTime?: number | null
  keys?: { p256dh: string; auth: string }
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })
  try {
    const body = await request.json() as PushSubscriptionRecord
    if (!body.subscription?.endpoint || !body.subscription.keys?.p256dh || !body.subscription.keys.auth) {
      return Response.json({ error: 'Invalid push subscription' }, { status: 400 })
    }
    const key = `subscription:${Buffer.from(body.subscription.endpoint).toString('base64url')}`
    const store = getStore('flight-push-subscriptions')
    const previous = await store.get(key, { type: 'json' }) as { firedKeys?: string[]; delivery?: Record<string, unknown>; vapidPublicKey?: string } | null
    const keyChanged = Boolean(previous?.vapidPublicKey && body.vapidPublicKey && previous.vapidPublicKey !== body.vapidPublicKey)
    await store.setJSON(key, {
      subscription: body.subscription,
      flightIds: body.flightIds ?? [],
      reminders: body.reminders ?? {},
      vapidPublicKey: body.vapidPublicKey,
      firedKeys: keyChanged ? [] : previous?.firedKeys ?? [],
      delivery: keyChanged ? {} : previous?.delivery ?? {},
    })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Unable to save push subscription' }, { status: 400 })
  }
}
