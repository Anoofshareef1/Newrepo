self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('push', event => {
  let data = { title: 'Fuel Services', body: 'A followed flight has an update.', url: '/' }
  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch { /* Ignore malformed payloads and show the fallback notification. */ }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag ?? 'flight-update',
    renotify: true,
    data: { url: data.url ?? '/' },
  }))
})
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    const existing = clientList.find(client => 'focus' in client)
    if (existing) return existing.focus()
    return self.clients.openWindow(event.notification.data?.url ?? '/')
  }))
})

// Browsers can invalidate a push subscription in the background; resubscribe without needing the app open.
self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open('push-subscription-meta')
      const metaResponse = await cache.match('/push-subscription-meta')
      const meta = metaResponse ? await metaResponse.json() : null
      const applicationServerKey = event.oldSubscription?.options?.applicationServerKey ?? meta?.applicationServerKey
      const subscription = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey })
      await fetch('/.netlify/functions/push-subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          flightIds: meta?.flightIds ?? [],
          reminders: meta?.reminders ?? {},
          vapidPublicKey: meta?.vapidPublicKey,
        }),
      })
    } catch { /* Nothing else to do until the app is reopened and resyncs. */ }
  })())
})
