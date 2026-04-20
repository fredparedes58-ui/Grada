// chat.jsx — Clean chat list with real photo avatars
function ChatScreen({ onNavigate, active }) {
  const conversations = [
    { name: 'Juan P.', msg: 'Vamos a jugar este sábado? 🔥', time: '14:32', unread: 2,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format&fit=crop' },
    { name: 'FC Thunder · Grupo', msg: 'Coach: Entrenamiento a las 18h', time: '12:08', unread: 5,
      photo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=120&q=80&auto=format&fit=crop' },
    { name: 'Lucas Fernández', msg: 'Bro ese golazo 🤯', time: '11:55', unread: 0,
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=80&auto=format&fit=crop' },
    { name: 'Sofía Torres', msg: 'Entrenamos juntos mañana?', time: 'Ayer', unread: 0,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop' },
    { name: 'Liga Juvenil · Staff', msg: 'Resultados jornada 8 publicados', time: 'Ayer', unread: 1,
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&q=80&auto=format&fit=crop' },
    { name: 'Diego Morales', msg: 'Vi tu highlight, brutal', time: 'Lun', unread: 0,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&auto=format&fit=crop' },
    { name: 'Academia Nova', msg: 'Te invitamos al tryout del 20', time: 'Dom', unread: 0,
      photo: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=120&q=80&auto=format&fit=crop' },
  ];

  const [activeTab, setActiveTab] = React.useState('Todos');

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0F0D0A', overflow: 'hidden' }}>
      <div className="screen-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 56, paddingBottom: 90 }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            fontFamily: 'Archivo, sans-serif', fontWeight: 800,
            fontSize: 28, color: '#fff', letterSpacing: '-0.02em',
          }}>Mensajes</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CCFF00' }}/>
            12 online
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 14px', overflowX: 'auto' }}>
          {['Todos', 'Equipos', 'Amigos', 'Ojeadores'].map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap',
                background: isActive ? '#CCFF00' : 'rgba(255,255,255,0.06)',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.12)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
              }}>{tab}</button>
            );
          })}
        </div>

        {/* Conversations */}
        <div style={{ padding: '0 8px' }}>
          {conversations.map((c, i) => <ChatRow key={i} {...c} />)}
        </div>
      </div>

      {/* FAB */}
      <button style={{
        position: 'absolute', bottom: 106, right: 20,
        width: 54, height: 54, borderRadius: 18,
        background: '#CCFF00',
        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 8px 20px rgba(204, 255, 0,0.35), 0 2px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer', zIndex: 40,
      }}><Icon.plus size={24} color="#fff" /></button>

      <TabBar active={active} onNavigate={onNavigate} />
    </div>
  );
}

function ChatRow({ name, msg, time, unread, photo }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 14,
      cursor: 'pointer',
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: '50%',
        overflow: 'hidden', flexShrink: 0,
        background: '#1a2030',
      }}>
        <img src={photo} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            color: '#fff', fontSize: 15, fontWeight: 600,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{name}</div>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
            color: unread > 0 ? '#CCFF00' : 'rgba(255,255,255,0.4)',
            flexShrink: 0, fontWeight: unread > 0 ? 600 : 400,
          }}>{time}</div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', gap: 8,
          marginTop: 3, alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            color: unread > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
            fontSize: 13,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontWeight: unread > 0 ? 500 : 400,
          }}>{msg}</span>
          {unread > 0 && (
            <span style={{
              flexShrink: 0, minWidth: 20, height: 20, borderRadius: 10,
              background: '#CCFF00', color: '#fff',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 7px',
            }}>{unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}

window.ChatScreen = ChatScreen;
