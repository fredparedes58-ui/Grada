import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Trophy, MessageCircle, User } from 'lucide-react'

const TABS = [
  { id: 'home',      path: '/home',      icon: Home,          label: 'Inicio' },
  { id: 'community', path: '/community', icon: Users,         label: 'Comunidad' },
  { id: 'league',    path: '/league',    icon: Trophy,        label: 'Liga' },
  { id: 'chat',      path: '/chat',      icon: MessageCircle, label: 'Chat' },
  { id: 'profile',   path: '/profile',   icon: User,          label: 'Perfil' },
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
        background: 'rgba(15, 13, 10, 0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(255, 220, 180, 0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        {TABS.map(t => {
          const active = loc.pathname === t.path
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
                color: active ? '#CCFF00' : 'rgba(250, 245, 235, 0.5)',
                transition: 'color 0.2s',
              }}
            >
              <Icon
                size={22}
                style={{
                  filter: active ? 'drop-shadow(0 0 8px #CCFF00)' : 'none',
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
