import { Clock, ShieldX, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function CuentaPendiente({ rechazado = false }: { rechazado?: boolean }) {
  const { logout } = useAuth()
  const Icon = rechazado ? ShieldX : Clock
  const accent = rechazado ? '#EF4444' : 'var(--accent-primary)'

  return (
    <div
      style={{
        position: 'absolute', inset: 0, background: 'var(--bg-deep)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 84, height: 84, borderRadius: 24, marginBottom: 24,
          background: rechazado ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1.5px solid ${rechazado ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
        }}
      >
        <Icon size={38} />
      </div>

      <h1
        style={{
          fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 26,
          color: 'var(--text-primary)', letterSpacing: '-0.018em', margin: 0, lineHeight: 1.15,
        }}
      >
        {rechazado ? 'Cuenta no aprobada' : 'Cuenta pendiente'}
      </h1>

      <p
        style={{
          marginTop: 12, maxWidth: 320,
          fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.5,
          color: 'var(--text-muted)',
        }}
      >
        {rechazado
          ? 'Tu solicitud no fue aprobada. Si crees que es un error, contacta con el administrador del club.'
          : 'Tu cuenta está pendiente de que el administrador la apruebe. Te avisaremos en cuanto esté lista.'}
      </p>

      <button
        onClick={logout}
        style={{
          marginTop: 32, display: 'flex', alignItems: 'center', gap: 8,
          height: 48, padding: '0 22px', borderRadius: 14,
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          color: 'var(--text-primary)', cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14,
        }}
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    </div>
  )
}
