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
}

function etaTimestamp(eta: string) {
  const match = eta.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return Number.isNaN(Date.parse(eta)) ? null : Date.parse(eta)
  const date = new Date()
  date.setHours(Number(match[1]), Number(match[2]), 0, 0)
  return date.getTime()
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
      id: String(flight.id ?? flight.flightId ?? flightNo),
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

export default async function handler() {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) return new Response('Push notifications are not configured', { status: 503 })

  webpush.setVapidDetails(`mailto:${process.env.VAPID_CONTACT_EMAIL ?? 'admin@example.com'}`, publicKey, privateKey)
  const response = await fetch('https://fis.com.mv/api/flights')
  if (!response.ok) throw new Error(`Flight API returned ${response.status}`)
  const flights = normalizeFlights(await response.json())
  const todayKey = new Date().toISOString().slice(0, 10)
  const currentDayFlights = flights.filter(flight => !flight.serviceDate || flight.serviceDate.startsWith(todayKey))
  if (currentDayFlights.length === 0) return Response.json({ ok: true, notified: 0 })

  const store = getStore('flight-push-subscriptions')
  const previous = await store.get('latest-flights', { type: 'json' }) as Flight[] | null
  await store.setJSON('latest-flights', currentDayFlights)
  if (!previous) return Response.json({ ok: true, notified: 0 })

  const previousById = new Map(previous.map(flight => [flight.id, flight]))
  const changedFlights = currentDayFlights.filter(flight => {
    const old = previousById.get(flight.id)
    return old && (old.status !== flight.status || old.eta !== flight.eta || old.std !== flight.std)
  })
  const { blobs } = await store.list({ prefix: 'subscription:' })
  let notified = 0
  for (const blob of blobs) {
    const record = await store.get(blob.key, { type: 'json' }) as StoredSubscription | null
    if (!record) continue
    const firedKeys = new Set(record.firedKeys ?? [])
    let subscriptionRemoved = false
    const reminderFlight = currentDayFlights.find(flight => record.flightIds.includes(flight.id) && record.reminders?.[flight.id] !== undefined && etaTimestamp(flight.eta) !== null && Date.now() >= (etaTimestamp(flight.eta) as number) - Number(record.reminders[flight.id]) * 60_000)
    const matchingFlights = changedFlights.filter(flight => record.flightIds.includes(flight.id))
    const notificationFlights = reminderFlight ? [reminderFlight] : matchingFlights
    for (const notificationFlight of notificationFlights) {
      try {
        const isReminder = reminderFlight?.id === notificationFlight.id
        const reminderMinutes = isReminder ? Number(record.reminders?.[notificationFlight.id] ?? 0) : null
        const eta = etaTimestamp(notificationFlight.eta)
        const reminderKey = isReminder && eta ? `${notificationFlight.id}:${reminderMinutes}:${new Date(eta).toDateString()}` : null
        const updateKey = !isReminder ? `${notificationFlight.id}:update:${notificationFlight.status}:${notificationFlight.eta}:${notificationFlight.std}` : null
        if ((reminderKey && firedKeys.has(reminderKey)) || (updateKey && firedKeys.has(updateKey))) continue
        const previousFlight = previousById.get(notificationFlight.id)
        const etaChanged = Boolean(previousFlight && previousFlight.eta !== notificationFlight.eta)
        await webpush.sendNotification(record.subscription, JSON.stringify({
          title: isReminder ? (reminderMinutes === 0 ? `${notificationFlight.flightNo} has arrived` : `${notificationFlight.flightNo} arrives in ${reminderMinutes} minutes`) : etaChanged ? `${notificationFlight.flightNo} ETA changed` : `${notificationFlight.flightNo} updated`,
          body: isReminder ? `${notificationFlight.airline} · ETA ${notificationFlight.eta}` : etaChanged ? `${previousFlight?.eta} → ${notificationFlight.eta}` : `${notificationFlight.status} · ${notificationFlight.eta !== '--:--' ? `ETA ${notificationFlight.eta}` : notificationFlight.route}`,
          url: '/',
        }))
        if (reminderKey) firedKeys.add(reminderKey)
        if (updateKey) firedKeys.add(updateKey)
        notified += 1
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode
        if (statusCode === 404 || statusCode === 410) {
          await store.delete(blob.key)
          subscriptionRemoved = true
          break
        }
      }
    }
    if (notificationFlights.length > 0 && !subscriptionRemoved) await store.setJSON(blob.key, { ...record, firedKeys: [...firedKeys] })
  }
  return Response.json({ ok: true, notified })
}
