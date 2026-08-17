self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
self.addEventListener('push', event => {
  let data = { title: 'Fuel Services', body: 'A followed flight has an update.', url: '/' }
  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch { /* Ignore malformed payloads and show the fallback notification. */ }
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, data: { url: data.url ?? '/' } }))
})
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    const existing = clientList.find(client => 'focus' in client)
    if (existing) return existing.focus()
    return self.clients.openWindow(event.notification.data?.url ?? '/')
  }))
})
