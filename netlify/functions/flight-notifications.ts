import { getStore } from '@netlify/blobs'
import webpush from 'web-push'

export const config = { schedule: '* * * * *' }

interface Flight {
  id: string
  flightNo: string
  airline: string
  route: string
  eta: string
  std: string
  status: string
}

interface StoredSubscription {
  subscription: webpush.PushSubscription
  flightIds: string[]
  reminders?: Record<string, number>
  firedKeys?: string[]
}

const MLE_OFFSET_MS = 5 * 60 * 60 * 1000 // Malé is UTC+5, no DST

function etaTimestamp(eta: string) {
  const match = eta.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return Number.isNaN(Date.parse(eta)) ? null : Date.parse(eta)
  const now = new Date()
  const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return utcMidnight + (Number(match[1]) * 60 + Number(match[2])) * 60_000 - MLE_OFFSET_MS
}

function normalizeFlights(payload: unknown): Flight[] {
  const value = payload as { flights?: unknown[]; data?: unknown[] } | unknown[]
  const source = Array.isArray(value) ? value : value?.flights ?? value?.data
  if (!Array.isArray(source)) return []
  return source.map((item, index) => {
    const flight = item as Record<string, unknown>
    const flightNo = String(flight.flightNo ?? flight.flightNumber ?? flight.flight_number ?? flight.flight ?? flight.callsign ?? `FLIGHT-${index + 1}`)
    const origin = String(flight.originCode ?? flight.origin ?? '---')
    const destination = String(flight.destinationCode ?? flight.destination ?? '---')
    const route = String(flight.route ?? `${origin}→${destination}`)
    const type = String(flight.type ?? '').toUpperCase()
    const isArrival = type.includes('ARR') || flight.isArrival === true || flight.arrival === true
    const apiStatus = String(flight.status ?? 'PENDING').toUpperCase()
    const status = apiStatus === 'LANDED' || apiStatus === 'ARRIVED' || apiStatus === 'COMPLETED' ? 'COMPLETED' : apiStatus === 'DEPARTED' ? 'DEPARTED' : apiStatus === 'REFUELING' ? 'REFUELING' : 'PENDING'
    return {
      id: String(flight.id ?? flight.flightId ?? flightNo),
      flightNo,
      airline: String(flight.airline ?? flight.airlineCode ?? flight.operator ?? 'UNKNOWN'),
      route,
      eta: String(flight.estimatedTime ?? flight.eta ?? flight.estimatedArrival ?? '--:--'),
      std: isArrival ? '--:--' : String(flight.scheduledTime ?? flight.std ?? flight.scheduledDeparture ?? '--:--'),
      status,
    }
  })
}

export default async function handler(req: Request) {
  const runStart = new Date()
  let nextRun: string | null = null
  try {
    const body = await req.json()
    nextRun = body?.next_run ?? null
  } catch {
    // no body, fine
  }

  console.log(`[flight-check] run started at ${runStart.toISOString()} (next_run reported as: ${nextRun})`)

  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) {
    console.error('[flight-check] Missing VAPID keys — aborting')
    return new Response('Push notifications are not configured', { status: 503 })
  }

  webpush.setVapidDetails(`mailto:${process.env.VAPID_CONTACT_EMAIL ?? 'admin@example.com'}`, publicKey, privateKey)

  const response = await fetch('https://fis.com.mv/api/flights')
  if (!response.ok) {
    console.error(`[flight-check] Flight API returned ${response.status}`)
    throw new Error(`Flight API returned ${response.status}`)
  }
  const flights = normalizeFlights(await response.json())
  console.log(`[flight-check] fetched ${flights.length} flights`)
  if (flights.length === 0) return Response.json({ ok: true, notified: 0 })

  const store = getStore('flight-push-subscriptions')
  const previous = await store.get('latest-flights', { type: 'json' }) as Flight[] | null
  await store.setJSON('latest-flights', flights)
  if (!previous) {
    console.log('[flight-check] no previous snapshot yet — storing baseline, skipping this run')
    return Response.json({ ok: true, notified: 0 })
  }

  const previousById = new Map(previous.map(flight => [flight.id, flight]))
  const changedFlights = flights.filter(flight => {
    const old = previousById.get(flight.id)
    return old && (old.status !== flight.status || old.eta !== flight.eta || old.std !== flight.std)
  })
  if (changedFlights.length > 0) {
    console.log(`[flight-check] ${changedFlights.length} flight(s) changed since last run:`, changedFlights.map(f => `${f.flightNo} (${f.status}, eta ${f.eta})`))
  }

  const { blobs } = await store.list({ prefix: 'subscription:' })
  console.log(`[flight-check] checking ${blobs.length} subscription(s)`)
  let notified = 0

  for (const blob of blobs) {
    const record = await store.get(blob.key, { type: 'json' }) as StoredSubscription | null
    if (!record) continue

    const firedKeys = new Set(record.firedKeys ?? [])

    const reminderFlight = flights.find(flight => {
      if (!record.flightIds.includes(flight.id)) return false
      const reminderMinutes = record.reminders?.[flight.id]
      if (reminderMinutes === undefined) return false
      const eta = etaTimestamp(flight.eta)
      if (eta === null) return false
      const thresholdTime = eta - reminderMinutes * 60_000
      const crossed = Date.now() >= thresholdTime
      console.log(`[flight-check] ${flight.flightNo} eta=${flight.eta} etaUTC=${new Date(eta).toISOString()} reminderMin=${reminderMinutes} thresholdUTC=${new Date(thresholdTime).toISOString()} nowUTC=${new Date().toISOString()} crossed=${crossed}`)
      return crossed
    })

    const matchingFlight = changedFlights.find(flight => record.flightIds.includes(flight.id))
    const notificationFlight = reminderFlight ?? matchingFlight
    if (!notificationFlight) continue

    try {
      const reminderMinutes = reminderFlight ? Number(record.reminders?.[reminderFlight.id] ?? 0) : null
      const eta = etaTimestamp(notificationFlight.eta)
      const reminderKey = reminderFlight && eta ? `${reminderFlight.id}:${reminderMinutes}:${new Date(eta).toDateString()}` : null

      if (reminderKey && firedKeys.has(reminderKey)) {
        console.log(`[flight-check] skipping ${notificationFlight.flightNo} — already fired for key ${reminderKey}`)
        continue
      }

      const title = reminderFlight
        ? (reminderMinutes === 0 ? `${notificationFlight.flightNo} has arrived` : `${notificationFlight.flightNo} arrives in ${reminderMinutes} minutes`)
        : `${notificationFlight.flightNo} updated`
      const bodyText = reminderFlight
        ? `${notificationFlight.airline} · ETA ${notificationFlight.eta}`
        : `${notificationFlight.status} · ${notificationFlight.eta !== '--:--' ? `ETA ${notificationFlight.eta}` : notificationFlight.route}`

      console.log(`[flight-check] SENDING push: "${title}" / "${bodyText}" to subscription ${blob.key} at ${new Date().toISOString()}`)

      await webpush.sendNotification(record.subscription, JSON.stringify({ title, body: bodyText, url: '/' }))

      if (reminderKey) firedKeys.add(reminderKey)
      await store.setJSON(blob.key, { ...record, firedKeys: [...firedKeys] })
      notified += 1
    } catch (error) {
      const statusCode = (error as { statusCode?: number }).statusCode
      console.error(`[flight-check] push failed for ${blob.key}: status=${statusCode}`, error)
      if (statusCode === 404 || statusCode === 410) {
        console.log(`[flight-check] removing expired subscription ${blob.key}`)
        await store.delete(blob.key)
      }
    }
  }

  console.log(`[flight-check] run complete: ${notified} notification(s) sent`)
  return Response.json({ ok: true, notified })
}
