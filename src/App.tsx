import { useState, useEffect, useRef } from 'react'

// ── Icons ─────────────────────────────────────────────────────────────────────

function HexLogo({ size = 40, animated = false }: { size?: number; animated?: boolean }) {
  const animId = useRef(`hex-${Math.random().toString(36).slice(2)}`)
  const id = animId.current

  if (!animated) {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <polygon points="20,2 35,10 35,26 20,34 5,26 5,10" stroke="#3b9edd" strokeWidth="2" fill="rgba(59,158,221,0.12)" />
        <polygon points="20,6 32,13 32,27 20,34 8,27 8,13" stroke="#3b9edd" strokeWidth="1" fill="rgba(59,158,221,0.08)" opacity="0.5" />
        <path d="M20 13 C18 13 16 15 16 17.5 C16 21 20 26 20 26 C20 26 24 21 24 17.5 C24 15 22 13 20 13Z" fill="#3b9edd" />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b9edd" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3b9edd" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <style>{`
          @keyframes ${id}-pulse {
            0%, 100% { opacity: 0.15; r: 34; }
            50% { opacity: 0.35; r: 38; }
          }
          @keyframes ${id}-spin-slow {
            from { transform: rotate(0deg); transform-origin: 40px 40px; }
            to   { transform: rotate(360deg); transform-origin: 40px 40px; }
          }
          @keyframes ${id}-spin-rev {
            from { transform: rotate(0deg); transform-origin: 40px 40px; }
            to   { transform: rotate(-360deg); transform-origin: 40px 40px; }
          }
          @keyframes ${id}-drop {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-3px); }
          }
          @keyframes ${id}-ripple {
            0%   { opacity: 0.5; stroke-width: 1.5; r: 26; }
            100% { opacity: 0;   stroke-width: 0.5; r: 42; }
          }
          .${id}-outer { animation: ${id}-spin-slow 12s linear infinite; }
          .${id}-inner { animation: ${id}-spin-rev  8s linear infinite; }
          .${id}-drop  { animation: ${id}-drop 2.4s ease-in-out infinite; }
          .${id}-ripple1 { animation: ${id}-ripple 2.4s ease-out infinite; }
          .${id}-ripple2 { animation: ${id}-ripple 2.4s ease-out infinite 0.8s; }
        `}</style>
      </defs>

      {/* Glow background */}
      <circle cx="40" cy="40" r="38" fill={`url(#${id}-glow)`} />

      {/* Ripple rings */}
      <circle className={`${id}-ripple1`} cx="40" cy="40" r="26" fill="none" stroke="#3b9edd" strokeWidth="1.5" />
      <circle className={`${id}-ripple2`} cx="40" cy="40" r="26" fill="none" stroke="#3b9edd" strokeWidth="1.5" />

      {/* Outer hex rotates */}
      <polygon
        className={`${id}-outer`}
        points="40,4 69,20 69,52 40,68 11,52 11,20"
        stroke="#3b9edd"
        strokeWidth="1.5"
        fill="rgba(59,158,221,0.08)"
        strokeDasharray="4 3"
      />

      {/* Inner hex counter-rotates */}
      <polygon
        className={`${id}-inner`}
        points="40,12 62,24 62,48 40,60 18,48 18,24"
        stroke="#3b9edd"
        strokeWidth="1.2"
        fill="rgba(59,158,221,0.12)"
        opacity="0.7"
      />

      {/* Static filled hex */}
      <polygon
        points="40,17 58,27 58,47 40,57 22,47 22,27"
        stroke="#3b9edd"
        strokeWidth="1.5"
        fill="rgba(59,158,221,0.18)"
      />

      {/* Drop icon floats */}
      <g className={`${id}-drop`}>
        <path
          d="M40 26 C37 26 32 31 32 35.5 C32 40.5 40 48 40 48 C40 48 48 40.5 48 35.5 C48 31 43 26 40 26Z"
          fill="#3b9edd"
          opacity="0.95"
        />
        <path
          d="M40 30 C38.5 30 36 33 36 35.5 C36 38.2 40 44 40 44 C40 44 44 38.2 44 35.5 C44 33 41.5 30 40 30Z"
          fill="rgba(255,255,255,0.25)"
        />
      </g>
    </svg>
  )
}

function IconDashboard({ active }: { active?: boolean }) {
  const c = active ? '#3b9edd' : '#4a5a72'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.5" />
    </svg>
  )
}

function IconPlane({ active }: { active?: boolean }) {
  const c = active ? '#3b9edd' : '#4a5a72'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  )
}

function IconBook({ active }: { active?: boolean }) {
  const c = active ? '#3b9edd' : '#4a5a72'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function IconTruck({ active }: { active?: boolean }) {
  const c = active ? '#3b9edd' : '#4a5a72'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 4v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconHistory({ active }: { active?: boolean }) {
  const c = active ? '#3b9edd' : '#4a5a72'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

function IconSliders({ active }: { active?: boolean }) {
  const c = active ? '#3b9edd' : '#4a5a72'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" fill="#0b1120" stroke={c} strokeWidth="1.5" />
      <circle cx="15" cy="12" r="2" fill="#0b1120" stroke={c} strokeWidth="1.5" />
      <circle cx="9" cy="18" r="2" fill="#0b1120" stroke={c} strokeWidth="1.5" />
    </svg>
  )
}

function IconDensity({ active }: { active?: boolean }) {
  const c = active ? '#3b9edd' : '#4a5a72'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" /><path d="M6 20V9" /><path d="M10 20V4" /><path d="M14 20v-7" /><path d="M18 20V7" />
    </svg>
  )
}

function IconBell({ size = 20, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconFollowed({ active }: { active?: boolean }) {
  return <IconBell size={20} color={active ? '#3b9edd' : '#4a5a72'} />
}

function IconSettings({ size = 20, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconHelp({ size = 20, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconLogout({ size = 20, color = '#ef4444' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconMoon({ size = 20, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function IconSpark({ size = 20, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  )
}

function IconCheck({ size = 20, color = '#22c55e' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconX({ size = 16, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconChevronDown({ size = 14, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconUser({ size = 16, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconCard({ size = 16, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  )
}

function IconPin({ size = 14, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function IconDeparture({ size = 16, color = '#3b9edd' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 7.91" />
      <line x1="2" y1="22" x2="22" y2="2" />
    </svg>
  )
}

function IconRefresh({ size = 20, color = '#8899bb' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-5.1" />
    </svg>
  )
}

// ── Types ────────────────────────────────────────────────────────────────────

type Screen = 'login' | 'app'
type Tab = 'refueling' | 'followed' | 'density' | 'more'
type FlightTab = 'INT' | 'DOM' | 'ADHOC'
type FlightDirection = 'ARRIVAL' | 'DEPARTURE'
type ReminderMinutes = 20 | 15 | 10 | 5 | 0
type Theme = 'dark' | 'black' | 'light'
type DutyTime = 'morning' | 'evening' | 'night'

const THEME_COLORS: Record<Theme, { bg: string; surface: string; text: string; textMuted: string; border: string; sidebar: string }> = {
  dark: {
    bg: '#0b1120',
    surface: '#131c2e',
    text: '#fff',
    textMuted: '#8899bb',
    border: 'rgba(255,255,255,0.06)',
    sidebar: '#111827',
  },
  light: {
    bg: '#f5f7fa',
    surface: '#ffffff',
    text: '#0b1120',
    textMuted: '#4a5a72',
    border: 'rgba(0,0,0,0.08)',
    sidebar: '#f0f3f7',
  },
  black: {
    bg: '#000000',
    surface: '#0a0a0a',
    text: '#fff',
    textMuted: '#a0a8b8',
    border: 'rgba(255,255,255,0.04)',
    sidebar: '#000000',
  },
}

interface Flight {
  id: string
  flightNo: string
  airline: string
  aircraftType: string
  registration: string
  route: string
  sta: string
  eta: string
  std: string
  operator: string
  status: 'DEPARTED' | 'REFUELING' | 'PENDING' | 'COMPLETED'
  paymentType?: string
  flightType?: FlightTab
  direction?: FlightDirection
}

const FLIGHTS_ENDPOINT = import.meta.env.PROD ? '/.netlify/functions/flights' : 'https://fis.com.mv/api/flights'

function normalizeFlights(payload: unknown): Flight[] {
  const source = Array.isArray(payload) ? payload : (payload as { flights?: unknown[]; data?: unknown[] } | null)?.flights ?? (payload as { data?: unknown[] } | null)?.data
  if (!Array.isArray(source)) return []

  return source.map((item, index) => {
    const flight = item as Record<string, unknown>
    const flightNo = String(flight.flightNo ?? flight.flightNumber ?? flight.flight_number ?? flight.flight ?? flight.callsign ?? `FLIGHT-${index + 1}`)
    const origin = String(flight.originCode ?? flight.origin ?? '---')
    const destination = String(flight.destinationCode ?? flight.destination ?? '---')
    const route = String(flight.route ?? `${origin}→${destination}`)
    const directionValue = String(flight.direction ?? flight.type ?? flight.arrivalDeparture ?? flight.operation ?? flight.flightType ?? '').toUpperCase()
    const isArrival = flight.isArrival === true || flight.arrival === true || directionValue.includes('ARR') || directionValue === 'A'
    const direction: FlightDirection = isArrival ? 'ARRIVAL' : 'DEPARTURE'
    const categoryValue = String(flight.category ?? '').toUpperCase()
    const flightType: FlightTab = categoryValue.includes('DOMESTIC') ? 'DOM' : categoryValue.includes('ADHOC') ? 'ADHOC' : 'INT'
    const apiStatus = String(flight.status ?? 'PENDING').toUpperCase()
    const status = apiStatus === 'LANDED' || apiStatus === 'ARRIVED' || apiStatus === 'COMPLETED' ? 'COMPLETED' : apiStatus === 'DEPARTED' ? 'DEPARTED' : apiStatus === 'REFUELING' ? 'REFUELING' : 'PENDING'
    return {
      id: String(flight.id ?? flight.flightId ?? flightNo),
      flightNo,
      airline: String(flight.airline ?? flight.airlineCode ?? flight.operator ?? 'UNKNOWN'),
      aircraftType: String(flight.aircraftType ?? flight.aircraft_type ?? flight.aircraft ?? '---'),
      registration: String(flight.registration ?? flight.reg ?? flight.aircraftRegistration ?? '---'),
      route,
      sta: isArrival ? String(flight.scheduledTime ?? flight.sta ?? '--:--') : '--:--',
      eta: String(flight.estimatedTime ?? flight.eta ?? flight.estimatedArrival ?? '--:--'),
      std: isArrival ? '--:--' : String(flight.scheduledTime ?? flight.std ?? flight.scheduledDeparture ?? '--:--'),
      operator: String(flight.assignedOperator ?? flight.operator ?? 'UNASSIGNED'),
      status,
      flightType,
      direction,
    }
  })
}

function requestFlightNotifications(flight: Flight) {
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(`Following ${flight.flightNo}`, { body: `${flight.airline} · ${flight.route}` })
  }
}

function notifyFlightUpdate(flight: Flight) {
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(`${flight.flightNo} updated`, { body: `${flight.status} · ${flight.eta !== '--:--' ? `ETA ${flight.eta}` : flight.route}` })
  }
}

function notifyFlightReminder(flight: Flight, minutes: ReminderMinutes) {
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(minutes === 0 ? `${flight.flightNo} has arrived` : `${flight.flightNo} arrives in ${minutes} minutes`, { body: `${flight.airline} · ETA ${flight.eta}` })
  }
}

function etaTimestamp(eta: string) {
  const match = eta.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return Number.isNaN(Date.parse(eta)) ? null : Date.parse(eta)
  const date = new Date()
  date.setHours(Number(match[1]), Number(match[2]), 0, 0)
  return date.getTime()
}

function openFlightRadar(flightNo: string) {
  const searchTerm = flightNo.replace(/\s+/g, '')
  window.open(`https://www.flightradar24.com/data/flights/${encodeURIComponent(searchTerm)}`, '_blank', 'noopener,noreferrer')
}

function decodeVapidKey(value: string) {
  const padding = '='.repeat((4 - value.length % 4) % 4)
  const normalized = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(normalized)
  return Uint8Array.from(raw, character => character.charCodeAt(0)).buffer
}

async function syncPushSubscription(flightIds: Set<string>, reminders: Record<string, ReminderMinutes> = {}) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || typeof Notification === 'undefined' || Notification.permission !== 'granted') return

  try {
    const keyResponse = await fetch('/.netlify/functions/push-public-key')
    if (!keyResponse.ok) return
    const { publicKey } = await keyResponse.json() as { publicKey?: string }
    if (!publicKey) return
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(publicKey),
    })
    await fetch('/.netlify/functions/push-subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subscription: subscription.toJSON(), flightIds: [...flightIds], reminders }),
    })
  } catch (error) {
    console.warn('Push notifications could not be enabled.', error)
  }
}

function filterFlightsByDutyTime(flights: Flight[], dutyTime: DutyTime): Flight[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 86400000)

  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/)
    if (!match) return -1
    return Number(match[1]) * 60 + Number(match[2])
  }

  return flights.filter(flight => {
    const etaMinutes = parseTime(flight.eta) || parseTime(flight.sta) || -1
    const stdMinutes = parseTime(flight.std) || -1

    if (dutyTime === 'morning') {
      return (etaMinutes >= 7 * 60 && etaMinutes <= 16 * 60 + 30) || (stdMinutes >= 7 * 60 && stdMinutes <= 16 * 60 + 30)
    } else if (dutyTime === 'evening') {
      return (etaMinutes >= 15 * 60 && etaMinutes <= 23 * 60 + 30) || (stdMinutes >= 15 * 60 && stdMinutes <= 23 * 60 + 30)
    } else {
      return (etaMinutes >= 22 * 60 + 30 || etaMinutes <= 8 * 60 + 30) || (stdMinutes >= 22 * 60 + 30 || stdMinutes <= 8 * 60 + 30)
    }
  })
}

// ── Data ─────────────────────────────────────────────────────────────────────

const FLIGHTS_INT: Flight[] = [
  { id: '1', flightNo: '6E 1128', airline: 'INDIGO', aircraftType: 'A320', registration: '8Q-TBA', route: 'MLE→BLR', sta: '--:--', eta: '--:--', std: '15:15', operator: 'UNASSIGNED', status: 'DEPARTED' },
  { id: '2', flightNo: 'UL 116', airline: 'SRILANKAN AIRLINES', aircraftType: 'A330', registration: '8Q-TBA', route: 'MLE→CMB', sta: '--:--', eta: '--:--', std: '16:40', operator: 'UNASSIGNED', status: 'DEPARTED' },
  { id: '3', flightNo: 'EK 653', airline: 'EMIRATES', aircraftType: 'B777', registration: 'A6-EFG', route: 'MLE→DXB', sta: '14:20', eta: '14:35', std: '17:00', operator: 'AS', status: 'PENDING' },
  { id: '4', flightNo: 'QR 671', airline: 'QATAR AIRWAYS', aircraftType: 'A350', registration: 'A7-AMH', route: 'MLE→DOH', sta: '15:10', eta: '15:10', std: '17:45', operator: 'MH', status: 'PENDING' },
  { id: '5', flightNo: 'TK 790', airline: 'TURKISH AIRLINES', aircraftType: 'B737', registration: 'TC-JVZ', route: 'MLE→IST', sta: '18:00', eta: '18:15', std: '20:30', operator: 'UNASSIGNED', status: 'PENDING' },
]

const FLIGHTS_DOM: Flight[] = [
  { id: 'd1', flightNo: 'Q2 501', airline: 'MALDIVIAN', aircraftType: 'ATR72', registration: '8Q-IAB', route: 'MLE→GAN', sta: '09:00', eta: '09:05', std: '10:30', operator: 'FK', status: 'COMPLETED' },
  { id: 'd2', flightNo: 'VQ 112', airline: 'VILLA AIR', aircraftType: 'ATR42', registration: '8Q-MXC', route: 'MLE→HDK', sta: '11:00', eta: '--:--', std: '12:15', operator: 'UNASSIGNED', status: 'PENDING' },
]

const FLIGHTS_ADHOC: Flight[] = [
  { id: 'a1', flightNo: 'PVTJET01', airline: 'PRIVATE CHARTER', aircraftType: 'G650', registration: 'M-LVIP', route: 'MLE→DXB', sta: '--:--', eta: '13:00', std: '14:30', operator: 'AS', status: 'REFUELING' },
]

interface StaffUser {
  rcNumber: string
  name: string
}

interface StaffUserWithPassword extends StaffUser {
  password: string
}

const STAFF_USERS: StaffUserWithPassword[] = [
  { rcNumber: 'A-10608', name: 'Moosa Aiman', password: 'Welcome123' },
  { rcNumber: 'A-10609', name: 'Mohamed Shamikh Ahmed', password: 'Welcome123' },
  { rcNumber: 'A-10721', name: 'Abdul Qadir', password: 'Welcome123' },
  { rcNumber: 'A-10785', name: 'Hassan Sammah', password: 'Welcome123' },
  { rcNumber: 'A-2708', name: 'Mohamed Ameez', password: 'Welcome123' },
  { rcNumber: 'A-3036', name: 'Ahmed Jumail', password: 'Welcome123' },
  { rcNumber: 'A-3046', name: 'Mohamed Ashhad', password: 'Welcome123' },
  { rcNumber: 'A-3047', name: 'Ali Ibrahim', password: 'Welcome123' },
  { rcNumber: 'A-3162', name: 'Sam aan Moosa', password: 'Welcome123' },
  { rcNumber: 'A-3166', name: 'Tholal Mohamed', password: 'Welcome123' },
  { rcNumber: 'A-3287', name: 'Nafiu Jameel', password: 'Welcome123' },
  { rcNumber: 'A-3292', name: 'Ali Shihaan', password: 'Welcome123' },
  { rcNumber: 'A-3639', name: 'Hussain Asir', password: 'Welcome123' },
  { rcNumber: 'A-3968', name: 'Moosa Reehan', password: 'Welcome123' },
  { rcNumber: 'A-4707', name: 'Mohamed Naveez', password: 'Welcome123' },
  { rcNumber: 'A-4716', name: 'Mohamed Munawwaru', password: 'Welcome123' },
  { rcNumber: 'A-4718', name: 'Mohamed Naseem', password: 'Welcome123' },
  { rcNumber: 'A-5055', name: 'Ahmed Aslam', password: 'Welcome123' },
  { rcNumber: 'A-5384', name: 'Jazleen Jaufar', password: 'Welcome123' },
  { rcNumber: 'A-5438', name: 'Ahmed Ashfaq', password: 'Welcome123' },
  { rcNumber: 'A-5582', name: 'Abdulla Mushfiq', password: 'Welcome123' },
  { rcNumber: 'A-5811', name: 'Mohamed Maadhih', password: 'Welcome123' },
  { rcNumber: 'A-5989', name: 'Ahmed Jinaan', password: 'Welcome123' },
  { rcNumber: 'A-6102', name: 'Hussain Shinaan', password: 'Welcome123' },
  { rcNumber: 'A-6155', name: 'Afsah Abdulla Adam', password: 'Welcome123' },
  { rcNumber: 'A-6252', name: 'Hassan Shahum', password: 'Welcome123' },
  { rcNumber: 'A-6422', name: 'Hassan Naajee', password: 'Welcome123' },
  { rcNumber: 'A-6600', name: 'Ibrahim Hamdhan', password: 'Welcome123' },
  { rcNumber: 'A-6606', name: 'Ahmed Azhan', password: 'Welcome123' },
  { rcNumber: 'A-6780', name: 'Hassan Abdulla', password: 'Welcome123' },
  { rcNumber: 'A-7000', name: 'Ahmed Alaf', password: 'Welcome123' },
  { rcNumber: 'A-7265', name: 'Rajwan Ibrahim', password: 'Welcome123' },
  { rcNumber: 'A-7271', name: 'Anoof Shareef', password: 'Welcome123' },
  { rcNumber: 'A-7282', name: 'Ahusan Abdulla', password: 'Welcome123' },
  { rcNumber: 'A-7302', name: 'Saif Mohamed', password: 'Welcome123' },
  { rcNumber: 'A-7323', name: 'Abdul Qadir Ibrahim', password: 'Welcome123' },
  { rcNumber: 'A-7449', name: 'Ismail Zabeeh', password: 'Welcome123' },
  { rcNumber: 'A-7483', name: 'Mauman Aslam', password: 'Welcome123' },
  { rcNumber: 'A-7523', name: 'Ahmed Naushad', password: 'Welcome123' },
  { rcNumber: 'A-7708', name: 'Mohamed Risaal Rasheed', password: 'Welcome123' },
  { rcNumber: 'A-7881', name: 'Ahmed Humaam', password: 'Welcome123' },
  { rcNumber: 'A-8026', name: 'Mohamed Jumaan', password: 'Welcome123' },
  { rcNumber: 'A-8027', name: 'Ali Razzan Hassan Rasheed', password: 'Welcome123' },
  { rcNumber: 'A-8276', name: 'Hassan Ashfag Mohamed', password: 'Welcome123' },
  { rcNumber: 'A-8288', name: 'Mohamed Shaikhan Shiham', password: 'Welcome123' },
  { rcNumber: 'A-8369', name: 'Ahmed Ibrahim', password: 'Welcome123' },
  { rcNumber: 'A-8581', name: 'Ali Muneef', password: 'Welcome123' },
  { rcNumber: 'A-8724', name: 'Ali Aleef', password: 'Welcome123' },
  { rcNumber: 'A-9043', name: 'Nishan Shakir', password: 'Welcome123' },
  { rcNumber: 'A-9117', name: 'Ahmed Tholaal', password: 'Welcome123' },
  { rcNumber: 'A-9168', name: 'Ali Sinaan', password: 'Welcome123' },
  { rcNumber: 'A-10017', name: 'Ahunaf Shareef', password: 'Welcome123' },
  { rcNumber: 'A-10985', name: 'Ibrahim Sabooh Salah', password: 'Welcome123' },
  { rcNumber: 'A-10984', name: "Iz'aan Shaukath", password: 'Welcome123' },
]

// ── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (user: StaffUser) => void }) {
  const [rcNumber, setRcNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [dutyTime, setDutyTime] = useState<'morning' | 'evening' | 'night'>('morning')

  const submitLogin = () => {
    const normalizedRc = rcNumber.trim().toUpperCase()
    const user = STAFF_USERS.find(u => u.rcNumber === normalizedRc && u.password === password)
    if (!user) {
      setError('Invalid RC number or password.')
      return
    }
    setError('')
    localStorage.setItem('selected-duty-time', dutyTime)
    onLogin({ rcNumber: user.rcNumber, name: user.name })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0b1120' }}>
      <div
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-5">
            <HexLogo size={96} animated />
          </div>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: '2rem', letterSpacing: '0.05em', color: '#fff' }}>
            FUEL SERVICES
          </h1>
          <p style={{ fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.25em', color: '#4a5a72', marginTop: '4px' }}>
            FUEL MANAGEMENT SYSTEM
          </p>
        </div>

        {/* RC Number Input */}
        <div className="mb-4">
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#8899bb', letterSpacing: '0.1em', marginBottom: '8px' }}>RC NUMBER</label>
          <div
            className="flex items-center px-4 py-3.5 rounded-xl"
            style={{ background: '#1a2540', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <input
              type="text"
              placeholder="Enter RC number"
              value={rcNumber}
              onChange={e => setRcNumber(e.target.value)}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: '0.9rem', width: '100%',
              }}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#8899bb', letterSpacing: '0.1em', marginBottom: '8px' }}>PASSWORD</label>
          <div
            className="flex items-center px-4 py-3.5 rounded-xl"
            style={{ background: '#1a2540', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitLogin()}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: '0.9rem', width: '100%',
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              {showPassword ? '👁' : '👁‍🗨'}
            </button>
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '8px' }}>{error}</p>}
        </div>

        {/* Duty Time Selection */}
        <div className="mb-6">
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#8899bb', letterSpacing: '0.1em', marginBottom: '8px' }}>DUTY TIME</label>
          <div className="flex rounded-xl p-1" style={{ background: '#1a2540' }}>
            {(['morning', 'evening', 'night'] as const).map(time => (
              <button
                key={time}
                onClick={() => setDutyTime(time)}
                className="flex-1 py-2.5 rounded-lg"
                style={{
                  background: dutyTime === time ? '#2a3a52' : 'transparent',
                  border: dutyTime === time ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                  color: dutyTime === time ? '#fff' : '#4a5a72',
                  fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                {time.toUpperCase()}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: '#4a5a72', marginTop: '8px' }}>
            {dutyTime === 'morning' && 'Morning: 07:00 - 16:30'}
            {dutyTime === 'evening' && 'Evening: 15:00 - 23:30'}
            {dutyTime === 'night' && 'Night: 22:30 - 08:30 (next day)'}
          </p>
        </div>

        {/* Primary button */}
        <button
          onClick={submitLogin}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl mb-6"
          style={{
            background: 'linear-gradient(135deg, #2980c4, #3b9edd)',
            fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', color: '#fff',
            border: 'none', cursor: 'pointer',
          }}
        >
          SIGN IN WITH STAFF ACCOUNT
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.2em', color: '#2a3a52', marginTop: '24px' }}>
          MACL AVIATION & MARITIME SERVICES
        </p>
      </div>
    </div>
  )
}

// ── Dashboard Screen ──────────────────────────────────────────────────────────

function DashboardScreen() {
  const stats = [
    { label: 'TOTAL FLIGHTS', value: '24', sub: 'Today', color: '#3b9edd' },
    { label: 'REFUELED', value: '11', sub: 'Completed', color: '#22c55e' },
    { label: 'PENDING', value: '8', sub: 'Awaiting', color: '#f59e0b' },
    { label: 'FUEL ISSUED', value: '84.2KL', sub: 'Volume', color: '#a78bfa' },
  ]

  const recent = [
    { flight: 'EK 653', airline: 'Emirates', time: '14:35', vol: '18.5 KL', status: 'COMPLETED' },
    { flight: '6E 1128', airline: 'IndiGo', time: '15:15', vol: '12.1 KL', status: 'DEPARTED' },
    { flight: 'UL 116', airline: 'SriLankan', time: '16:40', vol: '22.3 KL', status: 'DEPARTED' },
    { flight: 'QR 671', airline: 'Qatar', time: '17:45', vol: '31.0 KL', status: 'PENDING' },
  ]

  const statusColor = (s: string) => s === 'COMPLETED' ? '#22c55e' : s === 'DEPARTED' ? '#3b9edd' : '#f59e0b'

  return (
    <div className="p-4 pb-2 overflow-y-auto" style={{ height: '100%' }}>
      <div className="mb-5">
        <p style={{ color: '#4a5a72', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em' }}>MONDAY, AUGUST 10</p>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', marginTop: '2px' }}>Operations Overview</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: '#4a5a72', marginTop: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '0.7rem', color: '#8899bb', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden mb-4" style={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: '#8899bb' }}>RECENT OPERATIONS</span>
          <span style={{ fontSize: '0.65rem', color: '#3b9edd', fontWeight: 600 }}>View All</span>
        </div>
        {recent.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{r.flight}</div>
              <div style={{ fontSize: '0.7rem', color: '#4a5a72' }}>{r.airline} · {r.time}</div>
            </div>
            <div className="text-right">
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8899bb' }}>{r.vol}</div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', color: statusColor(r.status), marginTop: '2px' }}>{r.status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment quick status */}
      <div className="rounded-xl p-4" style={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: '#8899bb', marginBottom: '12px' }}>HYDRANT DISPENSERS</div>
        <div className="flex gap-2 flex-wrap">
          {['HD-01', 'HD-02', 'HD-03', 'HD-04', 'HD-05'].map((unit, i) => (
            <div key={unit} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#1a2540', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 1 ? '#f59e0b' : '#22c55e' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#d0ddf0' }}>{unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Flight Card ───────────────────────────────────────────────────────────────

function FlightCard({ flight, followed, reminder, onFollow, onReminder, theme = 'dark' }: { flight: Flight; followed: boolean; reminder?: ReminderMinutes; onFollow: () => void; onReminder?: (minutes: ReminderMinutes) => void; theme?: Theme }) {
  const colors = THEME_COLORS[theme]
  return (
    <div className="rounded-2xl mb-3 overflow-hidden" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-3">
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: colors.text, letterSpacing: '-0.02em' }}>{flight.flightNo}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', color: colors.textMuted }}>{flight.airline}</span>
          </div>
          <button
            aria-label={followed ? `Stop following ${flight.flightNo}` : `Follow ${flight.flightNo}`}
            onClick={onFollow}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 34, height: 34, background: followed ? 'rgba(59,158,221,0.14)' : colors.surface, border: `1px solid ${colors.border}`, cursor: 'pointer' }}
          >
            <IconBell size={16} color={followed ? '#3b9edd' : colors.textMuted} />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <IconPin size={12} color={colors.textMuted} />
            <span style={{ fontSize: '0.7rem', color: colors.textMuted }}>---</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: colors.textMuted }}>|</span>
          <span style={{ fontWeight: 600, fontSize: '0.75rem', color: colors.textMuted }}>{flight.aircraftType}</span>
          <span style={{ fontSize: '0.7rem', color: colors.textMuted }}>|</span>
          <span
            className="px-2 py-0.5 rounded-md"
            style={{ background: 'rgba(59,158,221,0.1)', color: '#3b9edd', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', border: '1px solid rgba(59,158,221,0.25)' }}
          >
            {flight.registration}
          </span>
          <span style={{ fontSize: '0.7rem', color: colors.textMuted }}>|</span>
          <span style={{ fontWeight: 600, fontSize: '0.75rem', color: colors.textMuted }}>{flight.route}</span>
        </div>
      </div>
      <div style={{ height: '1px', background: colors.border }} />
      <div className="grid grid-cols-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
        {[
          { label: 'STA', value: flight.sta },
          { label: 'ETA', value: flight.eta },
          { label: 'STD', value: flight.std, highlight: flight.std !== '--:--' },
        ].map((t, i) => (
          <div key={t.label} className="flex flex-col items-center py-3" style={{ borderRight: i < 2 ? `1px solid ${colors.border}` : 'none' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', color: colors.textMuted }}>{t.label}</span>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: t.highlight ? '#f59e0b' : colors.textMuted, marginTop: '2px' }}>{t.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div />
        <div className="flex items-center gap-2">
          {followed && onReminder && (
            <select
              aria-label={`Reminder for ${flight.flightNo}`}
              value={reminder ?? 0}
              onChange={event => onReminder(Number(event.target.value) as ReminderMinutes)}
              className="px-2 py-1.5 rounded-lg"
              style={{ background: colors.surface, color: colors.textMuted, border: `1px solid ${colors.border}`, fontSize: '0.65rem', outline: 'none' }}
            >
              <option value={20}>20 min</option>
              <option value={15}>15 min</option>
              <option value={10}>10 min</option>
              <option value={5}>5 min</option>
              <option value={0}>On arrival</option>
            </select>
          )}
          <button
            onClick={() => openFlightRadar(flight.flightNo)}
            aria-label={`Track ${flight.flightNo} on Flightradar24`}
            className="px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(59,158,221,0.12)', color: '#5bb8f5', border: '1px solid rgba(59,158,221,0.3)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer' }}
          >
            TRACK
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Flight Refueling Screen ───────────────────────────────────────────────────

function RefuelingScreen({ flights, followedFlights, reminders, onFollow, onReminder, dutyTime, theme, hideLanded, hideDeparted }: { flights: Flight[]; followedFlights: Set<string>; reminders: Record<string, ReminderMinutes>; onFollow: (flight: Flight) => void; onReminder: (flightId: string, minutes: ReminderMinutes) => void; dutyTime: DutyTime; theme: Theme; hideLanded?: boolean; hideDeparted?: boolean }) {
  const [flightTab, setFlightTab] = useState<FlightTab>('INT')
  const [direction, setDirection] = useState<FlightDirection>('ARRIVAL')
  const colors = THEME_COLORS[theme]

  const filteredByTab = flights.filter(f => {
    const inferredType = f.flightType ?? (f.id.startsWith('d') ? 'DOM' : f.id.startsWith('a') ? 'ADHOC' : 'INT')
    return inferredType === flightTab
  })
  const filteredByDirection = filteredByTab.filter(flight => (flight.direction ?? 'DEPARTURE') === direction)
  const filteredByDuty = filterFlightsByDutyTime(filteredByDirection, dutyTime)
  const visibleFlights = filteredByDuty.filter(f => {
    if (hideLanded && f.status === 'COMPLETED') return false
    if (hideDeparted && f.status === 'DEPARTED') return false
    return true
  })

  const tabs: { tab: FlightTab; label: string }[] = [
    { tab: 'INT', label: 'INTERNATIONAL' },
    { tab: 'DOM', label: 'DOMESTIC' },
    { tab: 'ADHOC', label: 'AD-HOC' },
  ]

  const sectionLabel = flightTab === 'INT' ? 'International Flights' : flightTab === 'DOM' ? 'Domestic Flights' : 'Ad-Hoc Charters'

  return (
    <div className="flex flex-col h-full" style={{ background: colors.bg }}>
      {/* Tab selector */}
      <div
        className="flex items-center px-4 pt-4"
        style={{
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: '12px',
          overflowX: 'auto',
        }}
      >
        {tabs.map(t => {
          const active = flightTab === t.tab
          return (
            <button
              key={t.tab}
              onClick={() => setFlightTab(t.tab)}
              className="px-4 py-2 whitespace-nowrap"
              style={{
                background: active ? `rgba(59,158,221,0.1)` : 'transparent',
                border: active ? '1px solid rgba(59,158,221,0.3)' : '1px solid transparent',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: active ? '#3b9edd' : colors.textMuted,
                cursor: 'pointer',
                marginRight: '8px',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Arrival and departure selector */}
      <div className="px-4 pt-3" style={{ background: colors.bg }}>
        <div className="flex rounded-xl p-1 gap-1" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
          {(['ARRIVAL', 'DEPARTURE'] as FlightDirection[]).map(option => {
            const active = direction === option
            return (
              <button
                key={option}
                onClick={() => setDirection(option)}
                className="flex-1 py-2 rounded-lg"
                style={{
                  background: active ? 'rgba(59,158,221,0.16)' : 'transparent',
                  border: active ? '1px solid rgba(59,158,221,0.35)' : '1px solid transparent',
                  color: active ? '#5bb8f5' : colors.textMuted,
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                {option === 'ARRIVAL' ? 'ARRIVALS' : 'DEPARTURES'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Flights list */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', color: '#3b9edd' }}>{sectionLabel}</span>
          <span
            className="px-3 py-1 rounded-full"
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, fontSize: '0.7rem', fontWeight: 700, color: colors.textMuted }}
          >
            {visibleFlights.length} Flights
          </span>
        </div>
        {visibleFlights.length === 0 && <div className="rounded-xl p-5 text-center" style={{ background: colors.surface, color: colors.textMuted }}>No flights available in this category.</div>}
        {visibleFlights.map(f => <FlightCard key={f.id} flight={f} followed={followedFlights.has(f.id)} reminder={reminders[f.id]} onFollow={() => onFollow(f)} onReminder={minutes => onReminder(f.id, minutes)} theme={theme} />)}
      </div>
    </div>
  )
}

function FollowedFlightsScreen({ flights, followedFlights, reminders, onFollow, onReminder, theme = 'dark' }: { flights: Flight[]; followedFlights: Set<string>; reminders: Record<string, ReminderMinutes>; onFollow: (flight: Flight) => void; onReminder: (flightId: string, minutes: ReminderMinutes) => void; theme?: Theme }) {
  const colors = THEME_COLORS[theme]
  const followed = flights.filter(flight => followedFlights.has(flight.id))

  return (
    <div className="p-4 overflow-y-auto" style={{ height: '100%', background: colors.bg }}>
      <div className="flex items-end justify-between mb-5">
        <div>
          <p style={{ color: colors.textMuted, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em' }}>PERSONAL WATCHLIST</p>
          <h2 style={{ color: colors.text, fontWeight: 800, fontSize: '1.3rem', marginTop: '2px' }}>Followed Flights</h2>
        </div>
        <span className="px-3 py-1 rounded-full" style={{ background: colors.surface, border: `1px solid ${colors.border}`, fontSize: '0.7rem', fontWeight: 700, color: colors.textMuted }}>
          {followed.length}
        </span>
      </div>
      {followed.length === 0 ? (
        <div className="rounded-2xl p-6 text-center" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
          <IconBell size={30} color={colors.textMuted} />
          <p style={{ color: colors.text, fontWeight: 700, marginTop: '12px' }}>No followed flights</p>
          <p style={{ color: colors.textMuted, fontSize: '0.78rem', marginTop: '6px', lineHeight: 1.5 }}>Tap the bell on any flight to add it to your watchlist.</p>
        </div>
      ) : (
        followed.map(flight => <FlightCard key={flight.id} flight={flight} followed reminder={reminders[flight.id]} onFollow={() => onFollow(flight)} onReminder={minutes => onReminder(flight.id, minutes)} theme={theme} />)
      )}
    </div>
  )
}

function DensityMeasureScreen() {
  const [onboardFuel, setOnboardFuel] = useState('')
  const [setFuel, setSetFuel] = useState('')
  const [density, setDensity] = useState('')
  const fuelDifference = Number(setFuel) - Number(onboardFuel)
  const densityResult = Number(density) > 0 ? fuelDifference / Number(density) : 0

  const inputStyle = { background: '#1a2540', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none', width: '100%', padding: '14px', borderRadius: '10px', fontSize: '1rem' }

  return (
    <div className="p-4 overflow-y-auto" style={{ height: '100%' }}>
      <div className="mb-5">
        <p style={{ color: '#4a5a72', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em' }}>FUEL QUALITY TOOL</p>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', marginTop: '2px' }}>Density Measure</h2>
      </div>
      <div className="rounded-2xl p-4" style={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.07)' }}>
        {[
          ['Onboard fuel', onboardFuel, setOnboardFuel],
          ['Set fuel', setFuel, setSetFuel],
          ['Density value', density, setDensity],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="block mb-4">
            <span style={{ display: 'block', color: '#8899bb', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>{label as string}</span>
            <input type="number" inputMode="decimal" min="0" step="any" value={value as string} onChange={event => (setter as (value: string) => void)(event.target.value)} style={inputStyle} />
          </label>
        ))}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="rounded-xl p-3" style={{ background: '#1a2540' }}>
            <div style={{ color: '#4a5a72', fontSize: '0.65rem', fontWeight: 700 }}>FUEL DIFFERENCE</div>
            <div style={{ color: '#f59e0b', fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>{Number.isFinite(fuelDifference) ? fuelDifference.toFixed(3) : '0.000'}</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div style={{ color: '#4a5a72', fontSize: '0.65rem', fontWeight: 700 }}>DENSITY RESULT</div>
            <div style={{ color: '#22c55e', fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>{Number.isFinite(densityResult) ? densityResult.toFixed(3) : '0.000'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Shift Briefing Screen ─────────────────────────────────────────────────────

function BriefingScreen() {
  const items = [
    { time: '06:00', title: 'Shift Handover', detail: 'HD-03 refueled and checked. All equipment operational.', author: 'NK', read: true },
    { time: '08:30', title: 'Safety Briefing', detail: 'Spill containment drill scheduled at 09:00 apron 2.', author: 'AS', read: true },
    { time: '11:00', title: 'NOTAM Update', detail: 'Taxiway B partial closure 14:00–16:00 UTC. Coordinate with ATC.', author: 'AS', read: false },
    { time: '13:45', title: 'Fuel Quality Check', detail: 'Jet A-1 density 0.800 g/ml. Microbial check clear.', author: 'MH', read: false },
  ]

  return (
    <div className="p-4 overflow-y-auto" style={{ height: '100%' }}>
      <div className="mb-5">
        <p style={{ color: '#4a5a72', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em' }}>SHIFT 2 · 06:00–18:00</p>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', marginTop: '2px' }}>Shift Briefing</h2>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: '#131c2e', border: `1px solid ${item.read ? 'rgba(255,255,255,0.05)' : 'rgba(59,158,221,0.2)'}` }}>
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4a5a72', letterSpacing: '0.08em' }}>{item.time}</span>
                {!item.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b9edd' }} />}
              </div>
              <div className="flex items-center justify-center rounded-md text-xs font-bold" style={{ width: 24, height: 24, background: '#1a2540', color: '#8899bb', fontSize: '0.65rem' }}>
                {item.author}
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}>{item.title}</div>
            <div style={{ fontSize: '0.78rem', color: '#8899bb', lineHeight: 1.5 }}>{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Equipment Status Screen ───────────────────────────────────────────────────

function EquipmentScreen() {
  const units = [
    { id: 'HD-01', type: 'Hydrant Dispenser', capacity: '30,000L', status: 'OPERATIONAL', lastService: '2026-07-15', driver: 'NK' },
    { id: 'HD-02', type: 'Hydrant Dispenser', capacity: '30,000L', status: 'MAINTENANCE', lastService: '2026-08-09', driver: '---' },
    { id: 'HD-03', type: 'Hydrant Dispenser', capacity: '30,000L', status: 'OPERATIONAL', lastService: '2026-07-28', driver: 'AS' },
    { id: 'HD-04', type: 'Hydrant Dispenser', capacity: '30,000L', status: 'OPERATIONAL', lastService: '2026-08-01', driver: 'FK' },
    { id: 'HD-05', type: 'Hydrant Dispenser', capacity: '30,000L', status: 'OPERATIONAL', lastService: '2026-08-03', driver: 'MH' },
    { id: 'FT-01', type: 'Fuel Tanker', capacity: '15,000L', status: 'STANDBY', lastService: '2026-07-20', driver: '---' },
  ]

  const statusInfo = (s: string) => {
    if (s === 'OPERATIONAL') return { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' }
    if (s === 'MAINTENANCE') return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }
    return { color: '#8899bb', bg: 'rgba(136,153,187,0.1)' }
  }

  return (
    <div className="p-4 overflow-y-auto" style={{ height: '100%' }}>
      <div className="mb-5">
        <p style={{ color: '#4a5a72', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em' }}>6 UNITS TRACKED</p>
        <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', marginTop: '2px' }}>Equipment Status</h2>
      </div>
      <div className="space-y-3">
        {units.map(u => {
          const si = statusInfo(u.status)
          return (
            <div key={u.id} className="rounded-xl p-4" style={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{u.id}</div>
                  <div style={{ fontSize: '0.72rem', color: '#4a5a72' }}>{u.type}</div>
                </div>
                <span className="px-2 py-1 rounded-lg" style={{ ...si, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                  {u.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#4a5a72', fontWeight: 600, letterSpacing: '0.08em' }}>CAPACITY</div>
                  <div style={{ fontSize: '0.78rem', color: '#8899bb', fontWeight: 600, marginTop: '2px' }}>{u.capacity}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#4a5a72', fontWeight: 600, letterSpacing: '0.08em' }}>LAST SERVICE</div>
                  <div style={{ fontSize: '0.78rem', color: '#8899bb', fontWeight: 600, marginTop: '2px' }}>{u.lastService}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#4a5a72', fontWeight: 600, letterSpacing: '0.08em' }}>OPERATOR</div>
                  <div style={{ fontSize: '0.78rem', color: u.driver === '---' ? '#4a5a72' : '#8899bb', fontWeight: 600, marginTop: '2px' }}>{u.driver}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Log History Screen ────────────────────────────────────────────────────────

function LogHistoryScreen() {
  const [search, setSearch] = useState('')

  const logs = [
    { id: 'OP-2408-001', flight: 'EK 653', route: 'MLE→DXB', unit: 'HD-03', vol: '18,500L', time: '14:35', op: 'AS', date: 'Today' },
    { id: 'OP-2408-002', flight: '6E 1128', route: 'MLE→BLR', unit: 'HD-01', vol: '12,100L', time: '15:15', op: 'NK', date: 'Today' },
    { id: 'OP-2408-003', flight: 'UL 116', route: 'MLE→CMB', unit: 'HD-04', vol: '22,300L', time: '16:40', op: 'FK', date: 'Today' },
    { id: 'OP-2407-041', flight: 'QR 671', route: 'MLE→DOH', unit: 'HD-03', vol: '31,000L', time: '17:45', op: 'AS', date: '2026-08-09' },
    { id: 'OP-2407-040', flight: 'TK 790', route: 'MLE→IST', unit: 'HD-02', vol: '28,200L', time: '20:30', op: 'MH', date: '2026-08-09' },
  ]

  const filtered = logs.filter(l =>
    l.flight.toLowerCase().includes(search.toLowerCase()) ||
    l.id.toLowerCase().includes(search.toLowerCase()) ||
    l.route.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="p-4 pb-2">
        <div className="mb-4">
          <p style={{ color: '#4a5a72', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em' }}>OPERATION ARCHIVE</p>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem', marginTop: '2px' }}>Log History</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-2" style={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5a72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search log entries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem', flex: 1 }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        {filtered.map((log, i) => (
          <div key={log.id} className="rounded-xl p-4 mb-3" style={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{log.flight}</div>
                <div style={{ fontSize: '0.7rem', color: '#4a5a72' }}>{log.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#8899bb' }}>{log.date === 'Today' ? 'Today' : log.date}</div>
                <div style={{ fontSize: '0.75rem', color: '#3b9edd', fontWeight: 700 }}>{log.time}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <div style={{ fontSize: '0.6rem', color: '#4a5a72', fontWeight: 600, letterSpacing: '0.08em' }}>ROUTE</div>
                <div style={{ fontSize: '0.75rem', color: '#8899bb', fontWeight: 600 }}>{log.route}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#4a5a72', fontWeight: 600, letterSpacing: '0.08em' }}>UNIT</div>
                <div style={{ fontSize: '0.75rem', color: '#8899bb', fontWeight: 600 }}>{log.unit}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#4a5a72', fontWeight: 600, letterSpacing: '0.08em' }}>VOLUME</div>
                <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 700 }}>{log.vol}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#4a5a72', fontWeight: 600, letterSpacing: '0.08em' }}>OP</div>
                <div style={{ fontSize: '0.75rem', color: '#8899bb', fontWeight: 600 }}>{log.op}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Side Drawer ───────────────────────────────────────────────────────────────

function SideDrawer({ open, onClose, activeTab, onNav, onSignOut, theme = 'dark' }: {
  open: boolean
  onClose: () => void
  activeTab: Tab
  onNav: (t: Tab) => void
  onSignOut: () => void
  theme?: Theme
}) {
  const colors = THEME_COLORS[theme]
  const navItems: { label: string; tab: Tab; Icon: React.FC<{ active?: boolean }> }[] = [
    { label: 'Flights', tab: 'refueling', Icon: IconPlane },
    { label: 'Followed Flights', tab: 'followed', Icon: IconFollowed },
    { label: 'Density Measure', tab: 'density', Icon: IconDensity },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '72%', maxWidth: '300px',
          background: colors.sidebar,
          borderRight: `1px solid ${colors.border}`,
          zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Logo header */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <HexLogo size={36} />
          <span style={{ fontWeight: 900, fontSize: '1.6rem', fontStyle: 'italic', color: '#3b9edd', letterSpacing: '-0.03em' }}>FMS</span>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          {navItems.map(item => {
            const active = activeTab === item.tab
            return (
              <button
                key={item.tab}
                onClick={() => { onNav(item.tab); onClose() }}
                className="flex items-center gap-3 w-full px-3 py-3.5 rounded-xl mb-1"
                style={{
                  background: active ? 'rgba(59,158,221,0.1)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <item.Icon active={active} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? '#3b9edd' : colors.textMuted }}>{item.label}</span>
                {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#3b9edd' }} />}
              </button>
            )
          })}
        </div>

        {/* Bottom section */}
        <div className="px-3 pb-6" style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '12px' }}>
          <a href="https://macl-itp.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-3 py-3 rounded-xl mb-1" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
            <IconHelp color={colors.textMuted} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>ITP</span>
          </a>
          <a href="https://itp-logentry.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-3 py-3 rounded-xl mb-1" style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
            <IconSettings color={colors.textMuted} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: colors.textMuted }}>LOG ENTRY</span>
          </a>
          <button
            onClick={() => { onClose(); onSignOut() }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <IconLogout />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ef4444' }}>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}

// ── Tactical Updates Panel ────────────────────────────────────────────────────

function TacticalUpdatesPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('tactical-update-dismissed') === 'true')

  const dismissUpdate = () => {
    setDismissed(true)
    localStorage.setItem('tactical-update-dismissed', 'true')
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      />
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: '#131c2e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: 'none',
          borderRadius: '0 0 20px 20px',
          zIndex: 50,
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          padding: '16px 16px 24px',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconBell size={18} color="#3b9edd" />
            <span style={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.15em', color: '#fff' }}>TACTICAL UPDATES</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <IconX size={18} color="#4a5a72" />
          </button>
        </div>
        {dismissed ? (
          <div className="flex flex-col items-center justify-center py-8 rounded-xl" style={{ background: '#1a2540' }}>
            <IconCheck size={40} color="rgba(34,197,94,0.7)" />
            <p style={{ fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.2em', color: '#4a5a72', marginTop: '12px' }}>NO NEW UPDATES</p>
          </div>
        ) : (
          <div className="rounded-xl p-4" style={{ background: '#1a2540', border: '1px solid rgba(59,158,221,0.22)' }}>
            <div style={{ color: '#3b9edd', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '8px' }}>OPERATIONS NOTICE</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Flight operations are being monitored</div>
            <div style={{ color: '#8899bb', fontSize: '0.76rem', lineHeight: 1.5, marginTop: '6px' }}>Followed-flight changes and duty updates will appear here.</div>
            <button onClick={dismissUpdate} className="w-full mt-4 py-2 rounded-lg" style={{ background: 'rgba(59,158,221,0.14)', border: '1px solid rgba(59,158,221,0.3)', color: '#5bb8f5', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', cursor: 'pointer' }}>DISMISS UPDATE</button>
          </div>
        )}
      </div>
    </>
  )
}

// ── System Settings Panel ─────────────────────────────────────────────────────

function SystemSettingsPanel({ open, onClose, theme, setTheme, user, dutyTime, setDutyTime, hideLanded, setHideLanded, hideDeparted, setHideDeparted, onSignOut }: {
  open: boolean; onClose: () => void
  theme: Theme; setTheme: (t: Theme) => void
  user: StaffUser
  dutyTime: DutyTime; setDutyTime: (d: DutyTime) => void
  hideLanded: boolean; setHideLanded: (h: boolean) => void
  hideDeparted: boolean; setHideDeparted: (h: boolean) => void
  onSignOut: () => void
}) {
  const [haptic, setHaptic] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const colors = THEME_COLORS[theme]

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '20px 20px 0 0',
          zIndex: 50,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          padding: '16px 20px 40px',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <IconUser size={18} color="#3b9edd" />
            <span style={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.15em', color: colors.text }}>SYSTEM SETTINGS</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <IconX size={18} color={colors.textMuted} />
          </button>
        </div>

        {/* Appearance */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <IconMoon size={18} color="#3b9edd" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: colors.text }}>APPEARANCE</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginBottom: '12px' }}>Select application theme</p>
          <div className="flex rounded-xl p-1" style={{ background: colors.bg }}>
            {(['light', 'dark', 'black'] as Theme[]).map(t => (
              <button
                key={t}
                onClick={() => { setTheme(t); localStorage.setItem('app-theme', t) }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg"
                style={{
                  background: theme === t ? colors.sidebar : 'transparent',
                  border: theme === t ? `1px solid ${colors.border}` : '1px solid transparent',
                  color: theme === t ? '#fff' : colors.textMuted,
                  fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                {t === 'light' && '☀'}
                {t === 'dark' && '🌙'}
                {t === 'black' && '⏰'}
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Duty Time */}
        <div className="mb-6" style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '16px' }}>
          <div className="flex items-center gap-2 mb-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b9edd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: colors.text }}>DUTY TIME</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: colors.textMuted, marginBottom: '12px' }}>Select your shift</p>
          <div className="flex rounded-xl p-1 gap-1" style={{ background: colors.bg }}>
            {(['morning', 'evening', 'night'] as DutyTime[]).map(time => (
              <button
                key={time}
                onClick={() => { setDutyTime(time); localStorage.setItem('selected-duty-time', time) }}
                className="flex-1 py-2.5 rounded-lg"
                style={{
                  background: dutyTime === time ? colors.sidebar : 'transparent',
                  border: dutyTime === time ? `1px solid ${colors.border}` : '1px solid transparent',
                  color: dutyTime === time ? '#fff' : colors.textMuted,
                  fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                {time.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Flight visibility settings */}
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '12px' }}>
          {/* Hide Landed */}
          <div className="flex items-center py-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 7.91"/></svg>
            <div className="ml-3 flex-1">
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: colors.text }}>HIDE LANDED FLIGHTS</div>
              <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>Don't show completed flights</div>
            </div>
            <button onClick={() => setHideLanded(!hideLanded)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 26, borderRadius: 13, background: hideLanded ? '#22c55e' : colors.bg, transition: 'background 0.2s', position: 'relative', border: `1px solid ${colors.border}` }}>
                <div style={{ position: 'absolute', top: 2, left: hideLanded ? 24 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </div>
            </button>
          </div>

          {/* Hide Departed */}
          <div className="flex items-center py-4" style={{ borderTop: `1px solid ${colors.border}` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 7.91"/></svg>
            <div className="ml-3 flex-1">
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: colors.text }}>HIDE DEPARTED FLIGHTS</div>
              <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>Don't show departed flights</div>
            </div>
            <button onClick={() => setHideDeparted(!hideDeparted)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 26, borderRadius: 13, background: hideDeparted ? '#22c55e' : colors.bg, transition: 'background 0.2s', position: 'relative', border: `1px solid ${colors.border}` }}>
                <div style={{ position: 'absolute', top: 2, left: hideDeparted ? 24 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </div>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center py-4" style={{ borderTop: `1px solid ${colors.border}` }}>
          <IconBell size={20} color="#22c55e" />
          <div className="ml-3 flex-1">
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: colors.text }}>NOTIFICATIONS</div>
            <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>Enabled for updates</div>
          </div>
          <div className="flex items-center gap-1" style={{ color: '#22c55e', fontSize: '0.7rem', fontWeight: 700 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            ACTIVE
          </div>
        </div>

        {/* Haptic */}
        <div className="flex items-center py-4" style={{ borderTop: `1px solid ${colors.border}` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /></svg>
          <div className="ml-3 flex-1">
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: colors.text }}>HAPTIC FEEDBACK</div>
            <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>Vibration active</div>
          </div>
          <button onClick={() => setHaptic(!haptic)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 48, height: 26, borderRadius: 13, background: haptic ? '#22c55e' : colors.bg, transition: 'background 0.2s', position: 'relative', border: `1px solid ${colors.border}` }}>
              <div style={{ position: 'absolute', top: 2, left: haptic ? 24 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </div>
          </button>
        </div>

        {/* Reduced motion */}
        <div className="flex items-center py-4" style={{ borderTop: `1px solid ${colors.border}` }}>
          <IconRefresh size={20} color="#3b9edd" />
          <div className="ml-3 flex-1">
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: colors.text }}>REDUCED MOTION</div>
            <div style={{ fontSize: '0.72rem', color: colors.textMuted }}>Full animations</div>
          </div>
          <button onClick={() => setReducedMotion(!reducedMotion)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 48, height: 26, borderRadius: 13, background: reducedMotion ? '#22c55e' : colors.bg, transition: 'background 0.2s', position: 'relative', border: `1px solid ${colors.border}` }}>
              <div style={{ position: 'absolute', top: 2, left: reducedMotion ? 24 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </div>
          </button>
        </div>

        {/* User */}
        <div className="flex items-center py-4 mb-4" style={{ borderTop: `1px solid ${colors.border}` }}>
          <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: colors.bg, border: `1px solid ${colors.border}`, fontWeight: 800, fontSize: '0.85rem', color: colors.text }}>
            {user.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
          </div>
          <div className="ml-3">
            <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', color: colors.textMuted }}>AUTHENTICATED USER</div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: colors.text }}>{user.name.toUpperCase()}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3b9edd' }}>{user.rcNumber} · STAFF ACCOUNT</div>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="w-full py-3.5 rounded-xl"
          style={{ background: colors.bg, border: `1px solid ${colors.border}`, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', color: colors.text, cursor: 'pointer' }}
        >
          SECURE LOGOUT
        </button>
      </div>
    </>
  )
}

// ── More Options Bottom Sheet ─────────────────────────────────────────────────

function MoreOptionsSheet({ open, onClose, onSettings, onSignOut, theme = 'dark' }: {
  open: boolean; onClose: () => void
  onSettings: () => void; onSignOut: () => void
  theme?: Theme
}) {
  const colors = THEME_COLORS[theme]

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 40, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      />
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '20px 20px 0 0',
          zIndex: 50,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          padding: '20px 0 40px',
        }}
      >
        <div className="px-5 mb-4">
          <span style={{ fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.15em', color: colors.text }}>MORE OPTIONS</span>
        </div>
        <div style={{ height: '1px', background: colors.border, marginBottom: '8px' }} />
        <div className="px-5 pb-2 pt-3">
          <p style={{ fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.15em', color: colors.textMuted, marginBottom: '4px' }}>PREFERENCES & SYSTEM</p>
        </div>
        {[
          { icon: <IconSettings size={20} color={colors.textMuted} />, label: 'Settings', action: () => { onClose(); onSettings() } },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex items-center gap-4 w-full px-5 py-4"
            style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${colors.border}` }}
          >
            {item.icon}
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: colors.text }}>{item.label}</span>
          </button>
        ))}
        <a href="https://macl-itp.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-5 py-4" style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${colors.border}`, textDecoration: 'none', color: 'inherit', display: 'flex' }}>
          <IconHelp size={20} color={colors.textMuted} />
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: colors.text }}>ITP</span>
        </a>
        <a href="https://itp-logentry.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-5 py-4" style={{ background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${colors.border}`, textDecoration: 'none', color: 'inherit', display: 'flex' }}>
          <IconSettings size={20} color={colors.textMuted} />
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: colors.text }}>LOG ENTRY</span>
        </a>
        <div style={{ height: '1px', background: colors.border, margin: '4px 0' }} />
        <button
          onClick={() => { onClose(); onSignOut() }}
          className="flex items-center gap-4 w-full px-5 py-4"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <IconLogout size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ef4444' }}>Sign Out</span>
        </button>
      </div>
    </>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ show, message, onDismiss }: { show: boolean; message: string; onDismiss: () => void }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onDismiss, 3500)
      return () => clearTimeout(t)
    }
  }, [show, onDismiss])

  return (
    <div
      style={{
        position: 'fixed', bottom: '90px', left: '16px', right: '16px',
        background: '#131c2e',
        border: '1px solid rgba(34,197,94,0.5)',
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
        zIndex: 100,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        opacity: show ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: show ? 'auto' : 'none',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: 'rgba(34,197,94,0.15)', flexShrink: 0 }}>
        <IconCheck size={16} />
      </div>
      <div className="flex-1">
        <div style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#22c55e' }}>SUCCESS</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{message}</div>
      </div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
        <IconX size={16} color="#4a5a72" />
      </button>
    </div>
  )
}

// ── Main App Shell ────────────────────────────────────────────────────────────

function AppShell({ onSignOut, user }: { onSignOut: () => void; user: StaffUser }) {
  const [activeTab, setActiveTab] = useState<Tab>('refueling')
  const [flights, setFlights] = useState<Flight[]>([...FLIGHTS_INT, ...FLIGHTS_DOM, ...FLIGHTS_ADHOC])
  const [followedFlights, setFollowedFlights] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('followed-flight-ids') ?? '[]')) }
    catch { return new Set() }
  })
  const [reminders, setReminders] = useState<Record<string, ReminderMinutes>>(() => {
    try { return JSON.parse(localStorage.getItem('flight-reminders') ?? '{}') }
    catch { return {} }
  })
  const followedFlightsRef = useRef(followedFlights)
  const flightsRef = useRef(flights)
  const previousFlightsRef = useRef<Flight[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tacticalOpen, setTacticalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem('app-theme') as Theme) || 'dark' }
    catch { return 'dark' }
  })
  const [dutyTime, setDutyTime] = useState<DutyTime>(() => {
    try { return (localStorage.getItem('selected-duty-time') as DutyTime) || 'morning' }
    catch { return 'morning' }
  })
  const [hideLanded, setHideLanded] = useState(() => {
    try { return localStorage.getItem('hide-landed-flights') === 'true' }
    catch { return false }
  })
  const [hideDeparted, setHideDeparted] = useState(() => {
    try { return localStorage.getItem('hide-departed-flights') === 'true' }
    catch { return false }
  })
  const [toast, setToast] = useState({ show: true, message: `Welcome back, ${user.name}!` })
  const colors = THEME_COLORS[theme]

  useEffect(() => { followedFlightsRef.current = followedFlights }, [followedFlights])
  useEffect(() => { flightsRef.current = flights }, [flights])

  useEffect(() => {
    localStorage.setItem('followed-flight-ids', JSON.stringify([...followedFlights]))
    localStorage.setItem('flight-reminders', JSON.stringify(reminders))
    localStorage.setItem('app-theme', theme)
    localStorage.setItem('selected-duty-time', dutyTime)
    localStorage.setItem('hide-landed-flights', String(hideLanded))
    localStorage.setItem('hide-departed-flights', String(hideDeparted))
    void syncPushSubscription(followedFlights, reminders)
  }, [followedFlights, reminders, theme, dutyTime, hideLanded, hideDeparted])

  useEffect(() => {
    const checkReminders = () => {
      const now = Date.now()
      const fired = JSON.parse(localStorage.getItem('fired-flight-reminders') ?? '{}') as Record<string, boolean>
      let changed = false
      flights.forEach(flight => {
        if (!followedFlights.has(flight.id)) return
        const eta = etaTimestamp(flight.eta)
        if (!eta) return
        const minutes = reminders[flight.id] ?? 0
        const due = minutes === 0 ? now >= eta : now >= eta - minutes * 60_000
        const key = `${flight.id}:${minutes}:${new Date(eta).toDateString()}`
        if (due && !fired[key]) {
          notifyFlightReminder(flight, minutes)
          fired[key] = true
          changed = true
        }
      })
      if (changed) localStorage.setItem('fired-flight-reminders', JSON.stringify(fired))
    }
    checkReminders()
    const timer = window.setInterval(checkReminders, 60_000)
    return () => window.clearInterval(timer)
  }, [flights, followedFlights, reminders])

  useEffect(() => {
    let cancelled = false
    const loadFlights = async () => {
      try {
        const response = await fetch(FLIGHTS_ENDPOINT)
        if (!response.ok) throw new Error(`Flight API returned ${response.status}`)
        const liveFlights = normalizeFlights(await response.json())
        if (!cancelled && liveFlights.length > 0) {
          const previousById = new Map(previousFlightsRef.current.map(flight => [flight.id, flight]))
          liveFlights.forEach(flight => {
            const previous = previousById.get(flight.id)
            if (previous && followedFlightsRef.current.has(flight.id) && (previous.status !== flight.status || previous.eta !== flight.eta || previous.std !== flight.std)) notifyFlightUpdate(flight)
          })
          const liveIds = new Set(liveFlights.map(flight => flight.id))
          const preservedFollowed = flightsRef.current.filter(flight => followedFlightsRef.current.has(flight.id) && !liveIds.has(flight.id))
          const nextFlights = [...liveFlights, ...preservedFollowed]
          previousFlightsRef.current = liveFlights
          setFlights(nextFlights)
        }
      } catch (error) {
        console.warn('Unable to load live flights; using the last available list.', error)
      }
    }
    loadFlights()
    const timer = window.setInterval(loadFlights, 60_000)
    return () => { cancelled = true; window.clearInterval(timer) }
  }, [])

  const handleFollow = async (flight: Flight) => {
    const isFollowed = followedFlights.has(flight.id)
    if (!isFollowed && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
    const nextFollowedFlights = new Set(followedFlights)
    if (isFollowed) nextFollowedFlights.delete(flight.id)
    else nextFollowedFlights.add(flight.id)
    if (isFollowed) {
      setReminders(current => {
        const next = { ...current }
        delete next[flight.id]
        return next
      })
    }
    setFollowedFlights(nextFollowedFlights)
    if (!isFollowed) requestFlightNotifications(flight)
    await syncPushSubscription(nextFollowedFlights)
  }

  const handleReminder = (flightId: string, minutes: ReminderMinutes) => {
    setReminders(current => ({ ...current, [flightId]: minutes }))
  }

  const tabs: { tab: Tab; Icon: React.FC<{ active?: boolean }>; label: string }[] = [
    { tab: 'refueling', Icon: IconPlane, label: 'Flights' },
    { tab: 'followed', Icon: IconFollowed, label: 'Followed' },
    { tab: 'density', Icon: IconDensity, label: 'Density' },
    { tab: 'more', Icon: IconSliders, label: 'More' },
  ]

  const handleTabClick = (tab: Tab) => {
    if (tab === 'more') { setMoreOpen(true); return }
    setActiveTab(tab)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: colors.bg, maxWidth: '480px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: colors.bg, borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
        <button onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
          <HexLogo size={32} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTacticalOpen(true)}
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: colors.surface, border: `1px solid ${colors.border}`, cursor: 'pointer' }}
          >
            <IconBell size={17} color={colors.textMuted} />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: colors.surface, border: `1px solid ${colors.border}`, cursor: 'pointer', fontWeight: 800, fontSize: '0.75rem', color: colors.text }}
          >
            {user.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', background: colors.bg }}>
        {activeTab === 'refueling' && <RefuelingScreen flights={flights} followedFlights={followedFlights} reminders={reminders} onFollow={handleFollow} onReminder={handleReminder} dutyTime={dutyTime} theme={theme} hideLanded={hideLanded} hideDeparted={hideDeparted} />}
        {activeTab === 'followed' && <FollowedFlightsScreen flights={flights} followedFlights={followedFlights} reminders={reminders} onFollow={handleFollow} onReminder={handleReminder} theme={theme} />}
        {activeTab === 'density' && <DensityMeasureScreen />}
      </div>

      {/* Bottom tab bar */}
      <div
        className="flex items-center justify-around px-2 py-2"
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '18px',
          flexShrink: 0,
          margin: '0 10px 10px',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
        }}
      >
        {tabs.map(({ tab, Icon, label }) => {
          const active = activeTab === tab && tab !== 'more'
          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center gap-1 py-1 px-3"
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
            >
              <Icon active={active} />
              {active && (
                <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, borderRadius: 1, background: '#3b9edd' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Overlays */}
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} activeTab={activeTab} onNav={setActiveTab} onSignOut={onSignOut} theme={theme} />
      <TacticalUpdatesPanel open={tacticalOpen} onClose={() => setTacticalOpen(false)} />
      <SystemSettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} setTheme={setTheme} user={user} dutyTime={dutyTime} setDutyTime={setDutyTime} hideLanded={hideLanded} setHideLanded={setHideLanded} hideDeparted={hideDeparted} setHideDeparted={setHideDeparted} onSignOut={onSignOut} />
      <MoreOptionsSheet open={moreOpen} onClose={() => setMoreOpen(false)} onSettings={() => setSettingsOpen(true)} onSignOut={onSignOut} theme={theme} />
      <Toast show={toast.show} message={toast.message} onDismiss={() => setToast(t => ({ ...t, show: false }))} />
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState<StaffUser | null>(() => {
    try { return JSON.parse(localStorage.getItem('auth-user') ?? 'null') as StaffUser | null }
    catch { return null }
  })

  return user === null
    ? <LoginScreen onLogin={authenticatedUser => { setUser(authenticatedUser); localStorage.setItem('auth-user', JSON.stringify(authenticatedUser)) }} />
    : <AppShell user={user} onSignOut={() => { setUser(null); localStorage.removeItem('auth-user') }} />
}
