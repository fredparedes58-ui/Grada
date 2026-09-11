import { auth } from './firebase'

export async function preguntar(mensajes, {
  sistema,
  modelo = 'claude-sonnet-5',
  onTexto,
} = {}) {
  const token = await auth.currentUser?.getIdToken()
  if (!token) throw new Error('No hay sesión')

  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mensajes, sistema, modelo }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let texto = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') return texto
      try {
        const json = JSON.parse(data)
        const delta = json.delta?.text ?? ''
        if (delta) {
          texto += delta
          onTexto?.(texto)
        }
      } catch { /* líneas vacías o eventos no-data */ }
    }
  }

  return texto
}
