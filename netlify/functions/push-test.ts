import { getStore } from '@netlify/blobs'
import webpush from 'web-push'

interface StoredSubscription {
  subscription: webpush.PushSubscription
  flightIds: string[]
  reminders?: Record<string, number>
  firedKeys?: string[]
  vapidPublicKey?: string
  delivery?: Record<string, DeliveryState>
}

interface DeliveryState {
  attemptedAt: string
  sentAt?: string
  failedAt?: string
  statusCode?: number
  error?: string
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })
  const expectedToken = process.env.PUSH_TEST_TOKEN
  const authorization = request.headers.get('authorization')
  if (!expectedToken || authorization !== `Bearer ${expectedToken}`) return new Response('Unauthorized', { status: 401 })

  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) return new Response('Push notifications are not configured', { status: 503 })

  try {
    const body = await request.json() as { endpoint?: string }
    if (!body.endpoint) return Response.json({ error: 'endpoint is required' }, { status: 400 })
    const key = `subscription:${Buffer.from(body.endpoint).toString('base64url')}`
    const store = getStore('flight-push-subscriptions')
    const record = await store.get(key, { type: 'json' }) as StoredSubscription | null
    if (!record) return Response.json({ error: 'Subscription not found' }, { status: 404 })

    webpush.setVapidDetails(`mailto:${process.env.VAPID_CONTACT_EMAIL ?? 'admin@example.com'}`, publicKey, privateKey)
    const notificationId = `test:${Date.now()}`
    const attemptedAt = new Date().toISOString()
    const delivery = { ...(record.delivery ?? {}) }
    delivery[notificationId] = { attemptedAt }
    try {
      await webpush.sendNotification(record.subscription, JSON.stringify({
        title: 'Fuel Services test notification',
        body: 'Push delivery is working.',
        url: '/',
      }), { urgency: 'high', TTL: 300 })
      delivery[notificationId] = { attemptedAt, sentAt: new Date().toISOString() }
      await store.setJSON(key, { ...record, delivery, vapidPublicKey: publicKey })
      return Response.json({ ok: true, notificationId })
    } catch (error) {
      const value = error as { statusCode?: number; message?: string }
      delivery[notificationId] = { attemptedAt, failedAt: new Date().toISOString(), statusCode: value.statusCode, error: value.message ?? String(error) }
      await store.setJSON(key, { ...record, delivery, vapidPublicKey: publicKey })
      console.error('Push test failed', { key, statusCode: value.statusCode, error })
      if (value.statusCode === 404 || value.statusCode === 410) await store.delete(key)
      return Response.json({ ok: false, notificationId, statusCode: value.statusCode }, { status: 502 })
    }
  } catch (error) {
    console.error('Push test request failed', error)
    return Response.json({ error: 'Invalid test request' }, { status: 400 })
  }
}
