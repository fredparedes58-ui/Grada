import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { acceder } from '../lib/auth'

export default function LoginPage() {
  const nav = useNavigate()
  const { setToast } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  function validate() {
    const e: typeof errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email inválido'
    if (password.length < 6) e.password = 'Mínimo 6 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate() || loading) return
    setLoading(true)
    setErrors({})
    try {
      await acceder({ email, password })
      setToast('¡Bienvenido de vuelta!')
      nav('/home')
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Error al iniciar sesión' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="screen-scroll"
      style={{
        position: 'absolute', inset: 0,
        background: 'var(--bg-deep)',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Mint top accent bar */}
      <div
        style={{
          height: 4,
          background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, padding: '48px 28px 40px', display: 'flex', flexDirection: 'column' }}>
        {/* Brand */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              }}
            >
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 900, fontSize: 20, color: '#FAFBFD' }}>G</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>GRADA</span>
          </div>

          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 500,
              fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.16em',
              textTransform: 'uppercase', marginBottom: 10,
            }}
          >
            Acceso · Tu cuenta
          </div>
          <h1
            style={{
              fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700,
              fontSize: 36, color: 'var(--text-primary)', letterSpacing: '-0.018em',
              lineHeight: 1.05, margin: 0,
            }}
          >
            Bienvenido de vuelta
          </h1>
          <p
            style={{
              marginTop: 10, fontFamily: 'Inter, sans-serif',
              fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5,
            }}
          >
            Inicia sesión para ver tu equipo y estadísticas
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {/* Email */}
          <div>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface-1)',
                border: `1.5px solid ${errors.email ? '#EF4444' : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 16px',
                boxShadow: '0 1px 4px rgba(10, 21, 48, 0.05)',
                transition: 'border-color 0.2s',
              }}
            >
              <Mail size={18} color="var(--text-dim)" />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'var(--text-primary)',
                }}
              />
            </div>
            {errors.email && (
              <div style={{ marginTop: 4, fontSize: 12, color: '#EF4444', fontFamily: 'Inter, sans-serif', paddingLeft: 4 }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface-1)',
                border: `1.5px solid ${errors.password ? '#EF4444' : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 16px',
                boxShadow: '0 1px 4px rgba(10, 21, 48, 0.05)',
              }}
            >
              <Lock size={18} color="var(--text-dim)" />
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={() => setShowPwd(s => !s)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showPwd
                  ? <EyeOff size={18} color="var(--text-dim)" />
                  : <Eye size={18} color="var(--text-dim)" />}
              </button>
            </div>
            {errors.password && (
              <div style={{ marginTop: 4, fontSize: 12, color: '#EF4444', fontFamily: 'Inter, sans-serif', paddingLeft: 4 }}>
                {errors.password}
              </div>
            )}
          </div>
        </div>

        {errors.general && (
          <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
            {errors.general}
          </div>
        )}

        {/* CTA button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            height: 54, width: '100%', borderRadius: 14,
            background: loading ? 'var(--border)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            border: 'none', cursor: loading ? 'default' : 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: 15, color: '#FAFBFD',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(16, 185, 129, 0.3), 0 2px 6px rgba(16, 185, 129, 0.2)',
            transition: 'transform 0.12s, box-shadow 0.12s',
            marginBottom: 20,
          }}
          onMouseDown={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)' }}
          onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          {loading ? 'Entrando…' : 'Iniciar sesión'}
        </button>

        <div
          style={{
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14, color: 'var(--text-muted)',
          }}
        >
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => nav('/register')}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--accent-primary)', fontWeight: 700, fontFamily: 'inherit', fontSize: 14,
            }}
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  )
}
