import { createRemoteJWKSet, jwtVerify } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
)

const MODELOS_PERMITIDOS = new Set([
  'claude-haiku-4-5-20251001',
  'claude-sonnet-5',
  'claude-opus-5',
])

// Rate limiter en memoria — frena bucles accidentales, no abuso deliberado.
// El Edge arranca varias instancias: para un tope real usa @vercel/kv.
const solicitudes = new Map()
const VENTANA_MS = 60_000
const MAX_POR_VENTANA = 30

function limitado(uid) {
  const ahora = Date.now()
  const e = solicitudes.get(uid) ?? { total: 0, inicio: ahora }
  if (ahora - e.inicio > VENTANA_MS) { solicitudes.set(uid, { total: 1, inicio: ahora }); return false }
  if (e.total >= MAX_POR_VENTANA) return true
  solicitudes.set(uid, { ...e, total: e.total + 1 })
  return false
}

export const config = { runtime: 'edge' }

export default async function handler(req) {
  const origen = req.headers.get('origin') ?? ''
  const permitidos = (process.env.ORIGENES_PERMITIDOS ?? '').split(',').map(s => s.trim())
  const corsHeaders = {
    'Access-Control-Allow-Origin': permitidos.includes(origen) ? origen : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const token = (req.headers.get('authorization') ?? '').replace('Bearer ', '')
  if (!token) {
    return new Response(JSON.stringify({ error: 'Sin autenticación' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let uid
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer:   `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`,
      audience: process.env.FIREBASE_PROJECT_ID,
    })
    uid = payload.sub
  } catch {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (limitado(uid)) {
    return new Response(JSON.stringify({ error: 'Demasiadas solicitudes' }), {
      status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { mensajes, sistema, modelo = 'claude-sonnet-5' } = await req.json()

  if (!MODELOS_PERMITIDOS.has(modelo)) {
    return new Response(JSON.stringify({ error: 'Modelo no permitido' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: 1024,
      stream: true,
      messages: mensajes,
      ...(sistema ? { system: sistema } : {}),
    }),
  })

  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: await upstream.text() }), {
      status: upstream.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(upstream.body, {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  })
}
