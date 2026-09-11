import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Check, MessageSquarePlus } from 'lucide-react'
import BottomNav from '../components/ui/BottomNav'
import BottomSheet from '../components/ui/BottomSheet'
import Avatar from '../components/ui/Avatar'
import { Skeleton, SkeletonCircle } from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import { escucharConversaciones, obtenerMiLectura, abrirDM, crearGrupo } from '../lib/mensajes'
import { misEquiposComoMiembro, obtenerMiembros } from '../lib/equipos'
import { obtenerAutores } from '../lib/muro'

interface Conv {
  id: string
  tipo?: string
  nombre?: string
  participantes?: string[]
  nombres?: Record<string, string>
  ultimoMensaje?: { texto?: string; senderUid?: string } | null
  actualizadoEn?: { toMillis?: () => number } | null
}

interface Miembro { uid: string; nombre: string; avatarUrl: string }

function displayConv(c: Conv, myUid?: string) {
  if (c.tipo === 'grupo') return { nombre: c.nombre || 'Grupo', esGrupo: true, otroUid: undefined as string | undefined }
  const otro = (c.participantes || []).find(u => u !== myUid)
  return { nombre: (otro && c.nombres?.[otro]) || 'Jugador', esGrupo: false, otroUid: otro }
}

export default function ChatPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const myUid = user?.uid

  const [conversaciones, setConversaciones] = useState<Conv[]>([])
  const [loading, setLoading] = useState(true)
  const [noLeidos, setNoLeidos] = useState<Record<string, boolean>>({})

  // Equipo + compañeros para iniciar chats
  const [equipoId, setEquipoId] = useState<string | null>(null)
  const [companeros, setCompaneros] = useState<Miembro[]>([])

  // Selector de nuevo chat
  const [pickerOpen, setPickerOpen] = useState(false)
  const [modoGrupo, setModoGrupo] = useState(false)
  const [grupoNombre, setGrupoNombre] = useState('')
  const [grupoSel, setGrupoSel] = useState<Set<string>>(new Set())
  const [creando, setCreando] = useState(false)

  // Escucha de mis conversaciones
  useEffect(() => {
    if (!myUid) return
    const unsub = escucharConversaciones(
      (convs: Conv[]) => { setConversaciones(convs); setLoading(false) },
      () => setLoading(false),
    )
    return unsub
  }, [myUid])

  // No-leídos por conversación (derivado de mi última lectura)
  useEffect(() => {
    if (!myUid || conversaciones.length === 0) { setNoLeidos({}); return }
    let vivo = true
    Promise.all(conversaciones.map(async c => {
      const lect = await obtenerMiLectura(c.id).catch(() => null)
      const ultMs = c.actualizadoEn?.toMillis?.() ?? 0
      const leidoMs = (lect?.ultimoLeidoEn as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0
      const hayNuevo = !!c.ultimoMensaje && c.ultimoMensaje.senderUid !== myUid && ultMs > leidoMs
      return [c.id, hayNuevo] as const
    })).then(pares => {
      if (vivo) setNoLeidos(Object.fromEntries(pares))
    })
    return () => { vivo = false }
  }, [conversaciones, myUid])

  // Cargar mi equipo + compañeros
  useEffect(() => {
    if (!user) return
    misEquiposComoMiembro().then(async eqs => {
      if (eqs.length === 0) return
      const eq = eqs[0].equipoId
      setEquipoId(eq)
      const miembros = await obtenerMiembros(eq)
      const uids = miembros.map((m: { uid: string }) => m.uid).filter(u => u !== myUid)
      const autores = await obtenerAutores(uids) as Record<string, { nombre?: string; apodo?: string; avatarUrl?: string } | null>
      setCompaneros(uids.map(u => ({
        uid: u,
        nombre: autores[u]?.apodo || autores[u]?.nombre || 'Jugador',
        avatarUrl: autores[u]?.avatarUrl || '',
      })))
    }).catch(() => {})
  }, [user, myUid])

  function abrirConversacion(c: Conv) {
    const d = displayConv(c, myUid)
    nav('/chat/conversation', { state: {
      convId: c.id, tipo: c.tipo, participantes: c.participantes,
      name: d.nombre, badge: d.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      color: d.esGrupo ? '#5DC3FF' : '#10B981', active: true,
    } })
  }

  function abrirBot() {
    nav('/chat/conversation', { state: { name: 'Asistente GRADA', badge: '🤖', color: '#B347FF', active: true, bot: true } })
  }

  async function iniciarDM(m: Miembro) {
    if (!equipoId || !myUid) return
    try {
      const convId = await abrirDM({ otroUid: m.uid, otroNombre: m.nombre, equipoId, miNombre: user?.name })
      setPickerOpen(false)
      nav('/chat/conversation', { state: {
        convId, tipo: 'directo', participantes: [myUid, m.uid],
        name: m.nombre, badge: m.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        color: '#10B981', active: true,
      } })
    } catch { /* ignore */ }
  }

  function toggleSel(uid: string) {
    setGrupoSel(prev => {
      const n = new Set(prev)
      if (n.has(uid)) n.delete(uid); else n.add(uid)
      return n
    })
  }

  async function crearNuevoGrupo() {
    if (!equipoId || !grupoNombre.trim() || grupoSel.size === 0 || creando) return
    setCreando(true)
    try {
      const convId = await crearGrupo({ nombre: grupoNombre.trim(), equipoId, participantes: [...grupoSel] })
      setPickerOpen(false); setModoGrupo(false); setGrupoNombre(''); setGrupoSel(new Set())
      nav('/chat/conversation', { state: {
        convId, tipo: 'grupo', participantes: [myUid!, ...grupoSel],
        name: grupoNombre.trim(), badge: grupoNombre.trim().slice(0, 2).toUpperCase(),
        color: '#5DC3FF', active: true,
      } })
    } catch { /* ignore */ }
    finally { setCreando(false) }
  }

  function closePicker() {
    setPickerOpen(false); setModoGrupo(false); setGrupoNombre(''); setGrupoSel(new Set())
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflow: 'hidden' }}>
      <div className="screen-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 60, paddingBottom: 90 }}>
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 32, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Chats
          </div>
          <button
            onClick={() => setPickerOpen(true)}
            aria-label="Nuevo chat"
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              border: 'none', color: '#FAFBFD', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            <MessageSquarePlus size={20} />
          </button>
        </div>

        <div style={{ padding: '0 12px' }}>
          {/* Asistente IA fijado */}
          <ConvRow
            onClick={abrirBot}
            avatarEmoji="🤖"
            color="#B347FF"
            nombre="Asistente GRADA"
            preview="Pregúntame lo que quieras de la app"
            unread={false}
          />

          {loading && Array.from({ length: 3 }).map((_, i) => (
            <div key={`sk-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 8px', borderBottom: '1px solid var(--border)' }}>
              <SkeletonCircle size={50} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skeleton width="40%" height={13} />
                <Skeleton width="75%" height={11} />
              </div>
            </div>
          ))}

          {!loading && conversaciones.map(c => {
            const d = displayConv(c, myUid)
            return (
              <ConvRow
                key={c.id}
                onClick={() => abrirConversacion(c)}
                avatarSrc={undefined}
                color={d.esGrupo ? '#5DC3FF' : '#10B981'}
                nombre={d.nombre}
                esGrupo={d.esGrupo}
                preview={c.ultimoMensaje?.texto || (d.esGrupo ? 'Grupo creado' : 'Iniciá la conversación')}
                unread={!!noLeidos[c.id]}
              />
            )
          })}

          {!loading && conversaciones.length === 0 && (
            <div style={{ padding: '36px 20px', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: 'var(--text-muted)' }}>
              Aún no tienes chats. Toca <b>+</b> para escribir a un compañero de equipo.
            </div>
          )}
        </div>
      </div>

      {/* Selector de nuevo chat */}
      <BottomSheet open={pickerOpen} onClose={closePicker} title={modoGrupo ? 'Nuevo grupo' : 'Nuevo chat'} accent="#10B981" height="80%">
        {!equipoId ? (
          <div style={{ padding: '30px 10px', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: 'var(--text-muted)' }}>
            Necesitas pertenecer a un equipo para escribir a tus compañeros. Crea o únete a uno en Comunidad.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Toggle directo / grupo */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ k: false, label: 'Directo' }, { k: true, label: 'Grupo' }].map(o => (
                <button
                  key={String(o.k)}
                  onClick={() => setModoGrupo(o.k)}
                  style={{
                    flex: 1, padding: '9px 0', borderRadius: 10,
                    background: modoGrupo === o.k ? 'var(--border-warm)' : 'rgba(10,21,48,0.03)',
                    border: `1px solid ${modoGrupo === o.k ? 'var(--accent-primary)' : 'var(--border)'}`,
                    color: modoGrupo === o.k ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {modoGrupo && (
              <input
                value={grupoNombre}
                onChange={e => setGrupoNombre(e.target.value)}
                placeholder="Nombre del grupo"
                style={{
                  width: '100%', boxSizing: 'border-box', height: 46, padding: '0 14px', borderRadius: 12,
                  background: 'var(--surface-1)', border: '1px solid var(--border)', outline: 'none',
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, color: 'var(--text-primary)',
                }}
              />
            )}

            {companeros.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-dim)' }}>
                No hay más miembros en tu equipo todavía.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {companeros.map(m => {
                const sel = grupoSel.has(m.uid)
                return (
                  <button
                    key={m.uid}
                    onClick={() => modoGrupo ? toggleSel(m.uid) : iniciarDM(m)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 12,
                      background: sel ? 'var(--border-warm)' : 'var(--surface-1)',
                      border: `1px solid ${sel ? 'var(--accent-primary)' : 'var(--border)'}`,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <Avatar src={m.avatarUrl} nombre={m.nombre} size={40} />
                    <div style={{ flex: 1, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                      {m.nombre}
                    </div>
                    {modoGrupo && sel && <Check size={18} color="var(--accent-primary)" />}
                  </button>
                )
              })}
            </div>

            {modoGrupo && (
              <button
                onClick={crearNuevoGrupo}
                disabled={!grupoNombre.trim() || grupoSel.size === 0 || creando}
                style={{
                  marginTop: 4, height: 50, borderRadius: 14, border: 'none',
                  background: (!grupoNombre.trim() || grupoSel.size === 0 || creando)
                    ? 'var(--border)'
                    : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  color: '#FAFBFD', cursor: (!grupoNombre.trim() || grupoSel.size === 0 || creando) ? 'default' : 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Users size={16} /> {creando ? 'Creando…' : `Crear grupo (${grupoSel.size})`}
              </button>
            )}
          </div>
        )}
      </BottomSheet>

      <BottomNav />
    </div>
  )
}

function ConvRow({
  onClick, nombre, preview, color, unread, avatarEmoji, avatarSrc, esGrupo,
}: {
  onClick: () => void
  nombre: string
  preview: string
  color: string
  unread: boolean
  avatarEmoji?: string
  avatarSrc?: string
  esGrupo?: boolean
}) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 8px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
    >
      {avatarEmoji ? (
        <div style={{
          width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
          background: `${color}22`, border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {avatarEmoji}
        </div>
      ) : (
        <Avatar src={avatarSrc} nombre={nombre} size={50} bg={esGrupo ? '#5DC3FF' : color} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
          {nombre}
        </div>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
          color: unread ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: unread ? 700 : 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240, marginTop: 3,
        }}>
          {preview}
        </div>
      </div>
      {unread && (
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0, boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
      )}
    </div>
  )
}
