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
  serviceDate?: string
}

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

function etaTimestamp(eta: string) {
  const match = eta.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return Number.isNaN(Date.parse(eta)) ? null : Date.parse(eta)
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Indian/Maldives', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(match[1]), Number(match[2])) - 5 * 60 * 60_000
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
    const serviceDate = String(flight.serviceDate ?? flight.flightDate ?? flight.scheduledDate ?? flight.date ?? '')
    return {
      // The upstream id embeds a positional index that shifts as flights complete; use a stable key instead.
      id: `${isArrival ? 'arrival' : 'departure'}-${flightNo.replace(/\s+/g, '')}-${serviceDate || 'unknown'}`,
      flightNo,
      airline: String(flight.airline ?? flight.airlineCode ?? flight.operator ?? 'UNKNOWN'),
      route,
      eta: String(flight.estimatedTime ?? flight.eta ?? flight.estimatedArrival ?? '--:--'),
      std: isArrival ? '--:--' : String(flight.scheduledTime ?? flight.std ?? flight.scheduledDeparture ?? '--:--'),
      status,
      serviceDate: serviceDate || undefined,
    }
  })
}

function isValidFlight(flight: Flight) {
  return Boolean(flight.id && flight.flightNo && flight.eta && flight.std && flight.status)
}

function getErrorDetails(error: unknown) {
  const value = error as { statusCode?: number; message?: string }
  return { statusCode: value.statusCode, message: value.message ?? String(error) }
}

export default async function handler() {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) {
    console.error('Push notifications are not configured: missing VAPID keys')
    return new Response('Push notifications are not configured', { status: 503 })
  }

  webpush.setVapidDetails(`mailto:${process.env.VAPID_CONTACT_EMAIL ?? 'admin@example.com'}`, publicKey, privateKey)
  const response = await fetch('https://fis.com.mv/api/flights')
  if (!response.ok) throw new Error(`Flight API returned ${response.status}`)
  const flights = normalizeFlights(await response.json())
  if (flights.length === 0 || flights.some(flight => !isValidFlight(flight))) {
    console.error('Flight API returned an invalid payload')
    return Response.json({ ok: false, error: 'Invalid flight API payload' }, { status: 502 })
  }
  const todayParts = new Intl.DateTimeFormat('en-US', { timeZone: 'Indian/Maldives', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const todayValues = Object.fromEntries(todayParts.map(part => [part.type, part.value]))
  const todayKey = `${todayValues.year}-${todayValues.month}-${todayValues.day}`
  const currentDayFlights = flights.filter(flight => !flight.serviceDate || flight.serviceDate.startsWith(todayKey))
  if (currentDayFlights.length === 0) return Response.json({ ok: true, notified: 0 })

  const store = getStore('flight-push-subscriptions')
  const lockKey = 'notification-run-lock'
  const existingLock = await store.get(lockKey, { type: 'json' }) as { expiresAt?: number } | null
  if (existingLock?.expiresAt && existingLock.expiresAt > Date.now()) return Response.json({ ok: true, skipped: 'already-running' })
  await store.setJSON(lockKey, { expiresAt: Date.now() + 50_000 })
  const previous = await store.get('latest-flights', { type: 'json' }) as Flight[] | null
  if (!previous) {
    await store.setJSON('latest-flights', currentDayFlights)
    await store.delete(lockKey)
    return Response.json({ ok: true, notified: 0 })
  }

  const previousById = new Map(previous.map(flight => [flight.id, flight]))
  const changedFlights = currentDayFlights.filter(flight => {
    const old = previousById.get(flight.id)
    return old && (old.status !== flight.status || old.eta !== flight.eta || old.std !== flight.std)
  })
  const { blobs } = await store.list({ prefix: 'subscription:' })
  console.log(`Subscriptions: ${blobs.length}, changed flight ids: ${changedFlights.map(flight => flight.id).join(', ') || 'none'}`)
  let notified = 0
  let failed = 0
  for (const blob of blobs) {
    const record = await store.get(blob.key, { type: 'json' }) as StoredSubscription | null
    if (!record) continue
    if (record.vapidPublicKey && record.vapidPublicKey !== publicKey) {
      await store.delete(blob.key)
      continue
    }
    const firedKeys = new Set(record.firedKeys ?? [])
    const delivery = { ...(record.delivery ?? {}) }
    let subscriptionRemoved = false
    const reminderFlights = currentDayFlights.filter(flight => record.flightIds.includes(flight.id) && record.reminders?.[flight.id] !== undefined && etaTimestamp(flight.eta) !== null && Date.now() >= (etaTimestamp(flight.eta) as number) - Number(record.reminders[flight.id]) * 60_000)
    const matchingFlights = changedFlights.filter(flight => record.flightIds.includes(flight.id))
    const reminderIds = new Set(reminderFlights.map(flight => flight.id))
    const notificationFlights = [...reminderFlights, ...matchingFlights.filter(flight => !reminderIds.has(flight.id))]
    if (changedFlights.length > 0) {
      console.log(`Subscription ${blob.key}: flightIds=${record.flightIds.join(', ') || 'none'}, matching=${matchingFlights.length}, firedKeys=${[...firedKeys].join(', ') || 'none'}`)
    }
    for (const notificationFlight of notificationFlights) {
      let notificationId = `${notificationFlight.id}:notification`
      let reminderKey: string | null = null
      let updateKey: string | null = null
      try {
        const isReminder = reminderIds.has(notificationFlight.id)
        const reminderMinutes = isReminder ? Number(record.reminders?.[notificationFlight.id] ?? 0) : null
        const eta = etaTimestamp(notificationFlight.eta)
        reminderKey = isReminder && eta ? `${notificationFlight.id}:${reminderMinutes}:${new Date(eta).toDateString()}` : null
        updateKey = !isReminder ? `${notificationFlight.id}:update:${notificationFlight.status}:${notificationFlight.eta}:${notificationFlight.std}` : null
        if ((reminderKey && firedKeys.has(reminderKey)) || (updateKey && firedKeys.has(updateKey))) continue
        notificationId = reminderKey ?? updateKey ?? notificationId
        const attemptedAt = new Date().toISOString()
        delivery[notificationId] = { attemptedAt }
        const previousFlight = previousById.get(notificationFlight.id)
        const etaChanged = Boolean(previousFlight && previousFlight.eta !== notificationFlight.eta)
        await webpush.sendNotification(record.subscription, JSON.stringify({
          title: isReminder ? (reminderMinutes === 0 ? `${notificationFlight.flightNo} has arrived` : `${notificationFlight.flightNo} arrives in ${reminderMinutes} minutes`) : etaChanged ? `${notificationFlight.flightNo} ETA changed` : `${notificationFlight.flightNo} updated`,
          body: isReminder ? `${notificationFlight.airline} · ETA ${notificationFlight.eta}` : etaChanged ? `${previousFlight?.eta} → ${notificationFlight.eta}` : `${notificationFlight.status} · ${notificationFlight.eta !== '--:--' ? `ETA ${notificationFlight.eta}` : notificationFlight.route}`,
          url: '/',
        }), { urgency: 'high', TTL: 300 })
        if (reminderKey) firedKeys.add(reminderKey)
        if (updateKey) firedKeys.add(updateKey)
        delivery[notificationId] = { attemptedAt, sentAt: new Date().toISOString() }
        notified += 1
      } catch (error) {
        const { statusCode, message } = getErrorDetails(error)
        const notificationId = reminderKey ?? updateKey ?? `${notificationFlight.id}:notification`
        delivery[notificationId] = { attemptedAt: delivery[notificationId]?.attemptedAt ?? new Date().toISOString(), failedAt: new Date().toISOString(), statusCode, error: message }
        if (statusCode === 404 || statusCode === 410) {
          await store.delete(blob.key)
          subscriptionRemoved = true
          break
        }
        failed += 1
        console.error('Push notification failed', { key: blob.key, statusCode, error })
      }
    }
    if (!subscriptionRemoved) await store.setJSON(blob.key, { ...record, firedKeys: [...firedKeys], delivery, vapidPublicKey: publicKey })
  }
  if (failed === 0) await store.setJSON('latest-flights', currentDayFlights)
  await store.delete(lockKey)
  console.log(`Checked ${currentDayFlights.length} flights, ${changedFlights.length} changed, notified ${notified} subscribers, ${failed} failed`)
  return Response.json({ ok: failed === 0, changedFlights: changedFlights.length, subscriptions: blobs.length, notified, failed })
}
