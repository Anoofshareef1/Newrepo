#!/usr/bin/env node

const url = process.env.CLEANUP_URL ?? 'http://localhost:8888/.netlify/functions/cleanup-stale-push-subscriptions'
const token = process.env.CLEANUP_TOKEN ?? ''

const response = await fetch(url, {
  method: 'POST',
  headers: token ? { Authorization: `Bearer ${token}` } : {},
})

const text = await response.text()
console.log(text)

if (!response.ok) {
  process.exit(response.status || 1)
}
