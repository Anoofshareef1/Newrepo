export default async function handler() {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  if (!publicKey) return Response.json({ error: 'Push notifications are not configured' }, { status: 503 })
  return Response.json({ publicKey }, { headers: { 'cache-control': 'public, max-age=3600' } })
}
