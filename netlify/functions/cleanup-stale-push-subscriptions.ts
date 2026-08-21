import { getStore } from '@netlify/blobs'

function normalizeStoredFlightId(id: string) {
  if (!id) return id
  const legacyMatch = id.match(/^(arrival|departure)-(.+)-([0-9]{4}-[0-9]{2}-[0-9]{2})-\d+$/i)
  if (legacyMatch) {
    return `${legacyMatch[1].toLowerCase()}-${legacyMatch[2].replace(/\s+/g, '')}-${legacyMatch[3]}`
  }
  return id
}

function isLegacyFlightId(id: string) {
  return /^(arrival|departure)-.+-[0-9]{4}-[0-9]{2}-[0-9]{2}-\d+$/i.test(String(id))
}

export default async function handler(request: Request) {
  if (request.method !== 'POST' && request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const cleanupToken = process.env.CLEANUP_TOKEN
  if (!cleanupToken) {
    return Response.json({ ok: false, error: 'Cleanup is not configured' }, { status: 503 })
  }

  const authHeader = request.headers.get('authorization') ?? ''
  const queryToken = new URL(request.url).searchParams.get('token') ?? ''
  const providedToken = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : queryToken
  if (providedToken !== cleanupToken) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const store = getStore('flight-push-subscriptions')
  const { blobs } = await store.list({ prefix: 'subscription:' })
  let deleted = 0
  let normalized = 0
  let kept = 0

  for (const blob of blobs) {
    const record = await store.get(blob.key, { type: 'json' }) as {
      flightIds?: unknown[]
      reminders?: Record<string, unknown>
      vapidPublicKey?: string
      subscription?: unknown
    } | null

    if (!record) {
      await store.delete(blob.key)
      deleted += 1
      continue
    }

    const originalFlightIds = Array.isArray(record.flightIds) ? record.flightIds : []
    const canonicalFlightIds = [...new Set(originalFlightIds.map(id => normalizeStoredFlightId(String(id))).filter(Boolean))]
    const originalReminders = record.reminders ?? {}
    const canonicalReminders = Object.fromEntries(
      Object.entries(originalReminders).map(([flightId, minutes]) => [normalizeStoredFlightId(String(flightId)), Number(minutes)])
    )

    const isOldRecord = originalFlightIds.some(id => typeof id === 'string' && isLegacyFlightId(id))
    const hasNoCanonicalFlights = canonicalFlightIds.length === 0 && originalFlightIds.length > 0

    if (hasNoCanonicalFlights || isOldRecord) {
      await store.delete(blob.key)
      deleted += 1
      continue
    }

    const reminderChanged = JSON.stringify(canonicalReminders) !== JSON.stringify(originalReminders)
    const flightIdsChanged = JSON.stringify(canonicalFlightIds) !== JSON.stringify(originalFlightIds)
    if (flightIdsChanged || reminderChanged) {
      await store.setJSON(blob.key, {
        ...record,
        flightIds: canonicalFlightIds,
        reminders: canonicalReminders,
        vapidPublicKey: record.vapidPublicKey ?? process.env.VAPID_PUBLIC_KEY,
      })
      normalized += 1
    }

    kept += 1
  }

  return Response.json({
    ok: true,
    deleted,
    normalized,
    kept,
    total: blobs.length,
    message: 'Legacy push subscription records were cleaned up and canonical IDs were normalized.',
  })
}
