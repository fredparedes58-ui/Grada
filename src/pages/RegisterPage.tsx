import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})

  function validate() {
    const e: typeof errors = {}
    if (name.trim().length < 2) e.name = 'Nombre muy corto'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email inválido'
    if (password.length < 6) e.password = 'Mínimo 6 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    login({ name, email, position: 'Centrocampista', team: 'Valencia BC' })
    nav('/home')
  }

  const fields = [
    { key: 'name' as const, placeholder: 'Tu nombre completo', type: 'text', icon: User, value: name, set: setName },
    { key: 'email' as const, placeholder: 'tu@email.com', type: 'email', icon: Mail, value: email, set: setEmail },
    { key: 'password' as const, placeholder: 'Contraseña', type: showPwd ? 'text' : 'password', icon: Lock, value: password, set: setPassword },
  ]

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
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', flexShrink: 0 }} />

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
            Registro · Nueva cuenta
          </div>
          <h1
            style={{
              fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700,
              fontSize: 34, color: 'var(--text-primary)', letterSpacing: '-0.018em',
              lineHeight: 1.05, margin: 0,
            }}
          >
            Únete a tu cancha
          </h1>
          <p style={{ marginTop: 10, fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Crea tu perfil y conecta con tu equipo
          </p>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {fields.map(f => {
            const Icon = f.icon
            const err = errors[f.key]
            return (
              <div key={f.key}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'var(--surface-1)',
                    border: `1.5px solid ${err ? '#EF4444' : 'var(--border)'}`,
                    borderRadius: 12, padding: '14px 16px',
                    boxShadow: '0 1px 4px rgba(10, 21, 48, 0.05)',
                  }}
                >
                  <Icon size={18} color="var(--text-dim)" />
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'var(--text-primary)',
                    }}
                  />
                  {f.key === 'password' && (
                    <button
                      onClick={() => setShowPwd(s => !s)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {showPwd
                        ? <EyeOff size={18} color="var(--text-dim)" />
                        : <Eye size={18} color="var(--text-dim)" />}
                    </button>
                  )}
                </div>
                {err && (
                  <div style={{ marginTop: 4, fontSize: 12, color: '#EF4444', fontFamily: 'Inter, sans-serif', paddingLeft: 4 }}>
                    {err}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          style={{
            height: 54, width: '100%', borderRadius: 14,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            border: 'none', cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700, fontSize: 15, color: '#FAFBFD',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
            transition: 'transform 0.12s',
            marginBottom: 20,
          }}
          onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)' }}
          onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          Crear cuenta
        </button>

        <div style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => nav('/login')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontWeight: 700, fontFamily: 'inherit', fontSize: 14 }}
          >
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  )
}
