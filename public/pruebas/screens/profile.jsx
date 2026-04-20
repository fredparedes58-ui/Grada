// profile.jsx — Clean, photo-forward player profile
function ProfileScreen({ user, onNavigate, active, onLogout }) {
  const stats = [
    { label: 'Partidos', value: 48 },
    { label: 'Goles', value: 32 },
    { label: 'Asistencias', value: 15 },
    { label: 'MVPs', value: 5 },
  ];
  const matches = [
    { opp: 'Rayo Urbano', result: 'G', score: '3-1', date: '12 abr', myGoals: 2 },
    { opp: 'Atlético Nova', result: 'E', score: '2-2', date: '05 abr', myGoals: 1 },
    { opp: 'Phantom FC', result: 'G', score: '4-0', date: '29 mar', myGoals: 1 },
    { opp: 'Tigres Sub-17', result: 'P', score: '1-2', date: '22 mar', myGoals: 0 },
  ];
  const name = user?.name || 'Alex Rivera';
  const ratings = [['PAC', 92], ['DRI', 87], ['SHO', 88], ['DEF', 54], ['PAS', 79], ['FÍS', 81]];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0F0D0A', overflow: 'hidden' }}>
      <div className="screen-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 56, paddingBottom: 90 }}>
        {/* Top bar: title + settings */}
        <div style={{ padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: 'Archivo, sans-serif', fontWeight: 800,
            fontSize: 20, color: '#fff', letterSpacing: '-0.02em',
          }}>Perfil</div>
          <button onClick={onLogout} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.75)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.settings size={18}/></button>
        </div>

        {/* Player photo card — real portrait, clean overlay */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            aspectRatio: '4/5',
            background: '#0a1020',
          }}>
            <img
              src="https://images.unsplash.com/photo-1628891439767-b50ff5d8d8ad?w=700&q=85&auto=format&fit=crop"
              alt=""
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Dark gradient bottom */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(15,13,10,0.9) 100%)',
            }}/>

            {/* Rating top-left */}
            <div style={{
              position: 'absolute', top: 16, left: 18, zIndex: 3,
            }}>
              <div style={{
                fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                fontSize: 42, lineHeight: 0.9, color: '#CCFF00',
              }}>89</div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: 12, color: '#fff',
                marginTop: 4, letterSpacing: '0.1em',
              }}>DELANTERO</div>
            </div>

            {/* Flag top-right */}
            <div style={{
              position: 'absolute', top: 18, right: 18, zIndex: 3,
              width: 28, height: 20, borderRadius: 3,
              background: 'linear-gradient(180deg, #aa151b 33%, #f1bf00 33% 66%, #aa151b 66%)',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            }}/>

            {/* Name + team at bottom */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, zIndex: 3 }}>
              <div style={{
                fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                fontSize: 26, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1,
              }}>{name}</div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4,
              }}>FC Thunder · Sub-17 · #10</div>
            </div>
          </div>
        </div>

        {/* Ratings grid */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
            color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 10, fontWeight: 600,
          }}>Atributos</div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            padding: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
          }}>
            {ratings.map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                  fontSize: 20, color: v >= 80 ? '#CCFF00' : '#fff', lineHeight: 1,
                }}>{v}</div>
                <div style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
                  color: 'rgba(255,255,255,0.5)', marginTop: 4,
                  letterSpacing: '0.08em',
                }}>{k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges row */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['MVP de Marzo', '5 partidos seguidos', 'Capitán'].map((b, i) => (
              <div key={i} style={{
                padding: '6px 12px', borderRadius: 999,
                background: 'rgba(204, 255, 0,0.1)',
                border: '1px solid rgba(204, 255, 0,0.35)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 12, fontWeight: 600, color: '#CCFF00',
              }}>{b}</div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, padding: '0 16px 20px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '14px 6px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                fontSize: 22, color: '#fff', lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
                fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginTop: 4,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent matches */}
        <div style={{ padding: '0 20px' }}>
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
            color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em',
            textTransform: 'uppercase', marginBottom: 10, fontWeight: 600,
          }}>Partidos recientes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matches.map((m, i) => <MatchRow key={i} {...m} />)}
          </div>
        </div>
      </div>

      <TabBar active={active} onNavigate={onNavigate} />
    </div>
  );
}

function MatchRow({ opp, result, score, date, myGoals }) {
  const colorMap = { G: '#CCFF00', E: '#ffcc00', P: '#ff5577' };
  const labelMap = { G: 'W', E: 'D', P: 'L' };
  const color = colorMap[result];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `${color}22`, border: `1px solid ${color}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Archivo, sans-serif', fontWeight: 800,
        fontSize: 13, color, flexShrink: 0,
      }}>{labelMap[result]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 13, fontWeight: 600, color: '#fff',
        }}>vs {opp}</div>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
          color: 'rgba(255,255,255,0.5)', marginTop: 2,
        }}>{date} · {myGoals > 0 ? `${myGoals} gol${myGoals > 1 ? 'es' : ''}` : 'Sin goles'}</div>
      </div>
      <div style={{
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
        fontSize: 15, color: '#fff',
      }}>{score}</div>
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
