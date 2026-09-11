import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Trophy, Brain, User } from 'lucide-react'
import { useNotifications } from '../../context/NotificationsContext'

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
  const { unread } = useNotifications()

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
          const active = loc.pathname === t.path || (t.path === '/chat' && loc.pathname.startsWith('/chat'))
          const Icon = t.icon
          const showBadge = t.id === 'coach' && unread > 0

          return (
            <button
              key={t.id}
              onClick={() => nav(t.path)}
              aria-label={t.label}
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
                transition: 'color 0.2s, transform 0.15s',
                transform: active ? 'translateY(-1px)' : 'translateY(0)',
                position: 'relative',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Icon
                  size={22}
                  style={{
                    filter: active ? 'drop-shadow(0 0 8px var(--accent-primary))' : 'none',
                    transition: 'filter 0.2s',
                  }}
                />
                {showBadge && (
                  <div style={{
                    position: 'absolute',
                    top: -3,
                    right: -4,
                    minWidth: unread > 9 ? 16 : 14,
                    height: 14,
                    borderRadius: 7,
                    background: '#FF5B3A',
                    border: '1.5px solid var(--bg-deep, #FAFBFD)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    animation: 'count-pop 0.3s cubic-bezier(.2,.8,.2,1)',
                  }}>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: 8,
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1,
                    }}>
                      {unread > 9 ? '9+' : unread}
                    </span>
                  </div>
                )}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  fontFamily: 'Space Grotesk, sans-serif',
                  letterSpacing: '0.01em',
                  transition: 'font-weight 0.15s',
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
