import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Trophy, Brain, User } from 'lucide-react'

const TABS = [
  { id: 'home',      path: '/home',      icon: Home,   label: 'Inicio' },
  { id: 'league',    path: '/league',    icon: Trophy, label: 'Liga' },
  { id: 'community', path: '/community', icon: Users,  label: 'Comunidad' },
  { id: 'coach',     path: '/chat',      icon: Brain,  label: 'Coach' },
  { id: 'profile',   path: '/profile',   icon: User,   label: 'Perfil' },
]

export default function BottomNav() {
  const loc = useLocation()
  const nav = useNavigate()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 430,
        margin: '0 auto',
        zIndex: 50,
        padding: '10px 12px calc(12px + env(safe-area-inset-bottom))',
        background: 'rgba(250, 251, 253, 0.92)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 20px var(--border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {TABS.map(t => {
          const active = loc.pathname === t.path || (t.id === 'coach' && loc.pathname === '/chat')
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => nav(t.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: active ? 'var(--accent-primary)' : 'rgba(10, 21, 48, 0.38)',
                transition: 'color 0.2s',
              }}
            >
              <Icon
                size={22}
                style={{
                  filter: active ? 'drop-shadow(0 0 8px var(--accent-primary))' : 'none',
                  transition: 'filter 0.2s',
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: 'Space Grotesk, sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
