import { getStore } from '@netlify/blobs'

function followerKey(flightId: string) {
  return `followers:${flightId}`
}

export default async function handler(request: Request) {
  const store = getStore('flight-followers')

  if (request.method === 'GET') {
    const flightIds = new URL(request.url).searchParams.get('flightIds')?.split(',').filter(Boolean) ?? []
    const entries = await Promise.all(flightIds.map(async flightId => [flightId, (await store.get(followerKey(flightId), { type: 'json' })) as string[] | null ?? []] as const))
    return Response.json(Object.fromEntries(entries))
  }

  if (request.method === 'POST') {
    try {
      const { flightId, userName, following } = await request.json() as { flightId?: string; userName?: string; following?: boolean }
      if (!flightId || !userName) return Response.json({ error: 'flightId and userName are required' }, { status: 400 })
      const current = (await store.get(followerKey(flightId), { type: 'json' })) as string[] | null ?? []
      const next = following ? [...new Set([...current, userName])] : current.filter(name => name !== userName)
      await store.setJSON(followerKey(flightId), next)
      return Response.json({ ok: true, followers: next })
    } catch {
      return Response.json({ error: 'Unable to update followers' }, { status: 400 })
    }
  }

  return new Response('Method Not Allowed', { status: 405 })
}
