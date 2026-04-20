// community.jsx — Clean, photo-forward community screen
function CommunityScreen({ onNavigate, active }) {
  const [query, setQuery] = React.useState('');
  const [joined, setJoined] = React.useState({});
  const [activeFilter, setActiveFilter] = React.useState('Cerca de ti');

  const teams = [
    { name: 'FC Thunder', members: 142, badge: 'FT', level: 'Sub-17', palette: ['#0a1428', '#1e3ca8', '#CCFF00'] },
    { name: 'Atlético Nova', members: 98, badge: 'AN', level: 'Sub-19', palette: ['#1a0a28', '#8a1e3c', '#CCFF00'] },
    { name: 'Rayo Urbano', members: 211, badge: 'RU', level: 'Sub-21', palette: ['#281a0a', '#aa5a1e', '#CCFF00'] },
    { name: 'Phantom FC', members: 76, badge: 'PF', level: 'Sub-15', palette: ['#0a281a', '#1e8a5a', '#CCFF00'] },
  ];
  const filtered = teams.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0F0D0A', overflow: 'hidden' }}>
      <div className="screen-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 56, paddingBottom: 90 }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 16px' }}>
          <div style={{
            fontFamily: 'Archivo, sans-serif', fontWeight: 800,
            fontSize: 28, color: '#fff',
            letterSpacing: '-0.02em',
          }}>Comunidad</div>
          <div style={{
            marginTop: 4,
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 14, color: 'rgba(255,255,255,0.6)',
          }}>Descubre clubes y equipos cerca</div>
        </div>

        {/* Search */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, height: 46, borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '0 14px',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}><Icon.search size={18}/></div>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar equipos, clubes, jugadores…" style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
            }}/>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 20px', overflowX: 'auto' }}>
          {['Cerca de ti', 'Tu nivel', 'Top 10', 'Nuevos'].map(c => {
            const isActive = c === activeFilter;
            return (
              <button key={c} onClick={() => setActiveFilter(c)} style={{
                padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap',
                background: isActive ? '#CCFF00' : 'rgba(255,255,255,0.06)',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.12)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                cursor: 'pointer',
              }}>{c}</button>
            );
          })}
        </div>

        {/* Team grid */}
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map((t, i) => (
            <TeamCard key={i} {...t} joined={!!joined[t.name]} onToggle={() => setJoined(s => ({ ...s, [t.name]: !s[t.name] }))}/>
          ))}
        </div>

        {/* Tournament banner */}
        <div style={{ padding: '20px 16px 0' }}>
          <button style={{
            width: '100%', borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(204, 255, 0,0.12), rgba(204, 255, 0,0.04))',
            border: '1px solid rgba(204, 255, 0,0.3)',
            padding: 14,
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer',
            textAlign: 'left',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: '#CCFF00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon.trophy size={22} color="#fff"/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 11, fontWeight: 700, color: '#CCFF00',
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>Torneo abierto</div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700, fontSize: 15, color: '#fff', marginTop: 2,
              }}>Copa de Verano 2026</div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}>
              <Icon.chevron color="currentColor"/>
            </div>
          </button>
        </div>
      </div>

      <TabBar active={active} onNavigate={onNavigate} />
    </div>
  );
}

function TeamCard({ name, members, badge, level, palette, joined, onToggle }) {
  return (
    <div style={{
      borderRadius: 16,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ height: 90, position: 'relative' }}>
        <TeamPhoto palette={palette} style={{ width: '100%', height: '100%' }}/>
        <div style={{
          position: 'absolute', bottom: -16, left: 12,
          width: 40, height: 40, borderRadius: 10,
          background: '#0F0D0A',
          border: '2px solid #0F0D0A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'rgba(204, 255, 0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Archivo, sans-serif', fontWeight: 800,
            fontSize: 13, color: '#CCFF00',
          }}>{badge}</div>
        </div>
      </div>
      <div style={{ padding: '22px 12px 12px' }}>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700, fontSize: 14, color: '#fff',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
        <div style={{
          display: 'flex', gap: 6, marginTop: 3,
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
          color: 'rgba(255,255,255,0.55)',
        }}>
          <span>{level}</span>
          <span>·</span>
          <span>{members} miembros</span>
        </div>
        <button onClick={onToggle} style={{
          marginTop: 10, width: '100%', height: 32, borderRadius: 10,
          background: joined ? 'transparent' : '#CCFF00',
          border: joined ? '1px solid rgba(255,255,255,0.2)' : 'none',
          color: joined ? 'rgba(255,255,255,0.85)' : '#fff',
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
          fontSize: 12,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        }}>
          {joined ? <><Icon.check size={12}/> Unido</> : 'Unirse'}
        </button>
      </div>
    </div>
  );
}

window.CommunityScreen = CommunityScreen;
