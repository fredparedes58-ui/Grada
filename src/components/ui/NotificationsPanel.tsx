import { Target, Calendar, MessageCircle, Users, Trophy, Check } from 'lucide-react'
import BottomSheet from './BottomSheet'
import { useNotifications, type NotifKind } from '../../context/NotificationsContext'

interface Props { open: boolean; onClose: () => void }

const ICONS: Record<NotifKind, { icon: typeof Target; color: string }> = {
  goal:                 { icon: Target,         color: '#10B981' },
  match:                { icon: Calendar,       color: '#FFB800' },
  message:              { icon: MessageCircle,  color: '#10B981' },
  team:                 { icon: Users,          color: '#FF5B3A' },
  trophy:               { icon: Trophy,         color: '#FFB800' },
  // FFCV
  ffcv_schedule_change: { icon: Calendar,       color: '#FFB800' },
  ffcv_postponed:       { icon: Calendar,       color: '#FF5B3A' },
  ffcv_live_goal:       { icon: Target,         color: '#FF5B3A' },
  ffcv_result:          { icon: Trophy,         color: '#10B981' },
}

export default function NotificationsPanel({ open, onClose }: Props) {
  const { items, unread, markAllRead, markRead } = useNotifications()

  return (
    <BottomSheet open={open} onClose={onClose} title="Notificaciones" accent="#10B981" height="75%">
      {/* Summary bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 2px 14px',
          borderBottom: '1px solid var(--border)',
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
            {unread}{' '}
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 500, fontSize: 13, color: 'var(--text-muted)' }}>
              sin leer
            </span>
          </div>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-muted)' }}>
            {items.length} notificaciones totales
          </div>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 12px', borderRadius: 10,
              background: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-warm)',
              color: 'var(--accent-primary)',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
              cursor: 'pointer',
            }}
          >
            <Check size={13} /> Marcar todo
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(n => {
          const { icon: I, color } = ICONS[n.kind]
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              style={{
                display: 'flex', gap: 12, padding: '12px',
                background: n.read ? 'rgba(10,21,48,0.04)' : 'var(--bg-surface)',
                borderRadius: 12,
                border: n.read ? '1px solid var(--border)' : `1px solid ${color}44`,
                cursor: 'pointer',
                transition: 'all 200ms',
                position: 'relative',
              }}
            >
              {!n.read && (
                <div
                  style={{
                    position: 'absolute', top: 14, right: 12,
                    width: 8, height: 8, borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />
              )}
              <div
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${color}22`, color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <I size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 14 }}>
                <div
                  style={{
                    fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13,
                    color: 'var(--text-primary)', marginBottom: 2,
                  }}
                >
                  {n.title}
                </div>
                <div
                  style={{
                    fontFamily: 'Space Grotesk', fontSize: 12,
                    color: 'var(--text-muted)', lineHeight: 1.3,
                  }}
                >
                  {n.body}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: 'Space Grotesk', fontSize: 10,
                    color: 'var(--text-dim)',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}
                >
                  {n.time}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}
