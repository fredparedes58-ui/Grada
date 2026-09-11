import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft, Check, X, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { obtenerPendientes, aprobarUsuario, rechazarUsuario } from '../lib/usuarios'
import Avatar from '../components/ui/Avatar'

interface Pendiente {
  uid: string
  nombre?: string
  apodo?: string
  ciudad?: string
  posicion?: string
  avatarUrl?: string
}

export default function AdminPage() {
  const { esAdmin, estadoLoading, setToast } = useAuth()
  const nav = useNavigate()
  const [pendientes, setPendientes] = useState<Pendiente[]>([])
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState<string | null>(null)

  useEffect(() => {
    if (!esAdmin) return
    obtenerPendientes()
      .then(p => setPendientes(p as Pendiente[]))
      .catch(() => setToast('No se pudieron cargar las solicitudes'))
      .finally(() => setLoading(false))
  }, [esAdmin, setToast])

  if (!estadoLoading && !esAdmin) return <Navigate to="/home" replace />

  async function decidir(uid: string, aprobar: boolean) {
    if (procesando) return
    setProcesando(uid)
    try {
      if (aprobar) await aprobarUsuario(uid)
      else await rechazarUsuario(uid)
      setPendientes(prev => prev.filter(p => p.uid !== uid))
      setToast(aprobar ? 'Cuenta aprobada' : 'Cuenta rechazada')
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'No se pudo procesar')
    } finally {
      setProcesando(null)
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflow: 'hidden' }}>
      <div className="screen-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 56, paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => nav('/profile')}
            aria-label="Volver"
            style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 24, color: 'var(--text-primary)', letterSpacing: '-0.018em' }}>
              Solicitudes
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>
              Aprueba o rechaza las nuevas cuentas
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading && (
            <div style={{ padding: '30px 20px', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>
              Cargando…
            </div>
          )}

          {!loading && pendientes.length === 0 && (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <UserCheck size={34} color="var(--accent-primary)" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                No hay solicitudes pendientes
              </div>
              <div style={{ marginTop: 4, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
                Cuando alguien cree una cuenta, aparecerá aquí.
              </div>
            </div>
          )}

          {!loading && pendientes.map(p => {
            const nombre = p.apodo || p.nombre || 'Jugador'
            return (
              <div
                key={p.uid}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 12, borderRadius: 14,
                  background: 'var(--surface-1)', border: '1px solid var(--border)',
                  boxShadow: '0 1px 4px rgba(10, 21, 48, 0.05)',
                }}
              >
                <Avatar src={p.avatarUrl} nombre={nombre} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                    {nombre}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'var(--text-muted)' }}>
                    {[p.posicion, p.ciudad].filter(Boolean).join(' · ') || 'Sin datos'}
                  </div>
                </div>
                <button
                  onClick={() => decidir(p.uid, false)}
                  disabled={procesando === p.uid}
                  aria-label="Rechazar"
                  style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#EF4444', cursor: procesando ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={18} />
                </button>
                <button
                  onClick={() => decidir(p.uid, true)}
                  disabled={procesando === p.uid}
                  aria-label="Aprobar"
                  style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    border: 'none', color: '#091A12', cursor: procesando ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Check size={18} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
