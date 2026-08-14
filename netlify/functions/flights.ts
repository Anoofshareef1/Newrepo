export default async function handler() {
  try {
    const response = await fetch('https://fis.com.mv/api/flights')
    const body = await response.text()
    return new Response(body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'application/json',
        'cache-control': 'no-store',
      },
    })
  } catch {
    return Response.json({ error: 'Unable to reach the flights service' }, { status: 502 })
  }
}
