// league.jsx — League standings for the user's team

const LEAGUE_DATA = {
  name: 'Liga Juvenil Metropolitana',
  season: 'Temporada 2025/26',
  division: 'Sub-17 · División A',
  userTeam: 'FC Thunder',
  matchday: 14,
  totalMatchdays: 22,
  standings: [
    { pos: 1, team: 'Atlético Nova',   badge: 'AN', played: 14, w: 11, d: 2, l: 1, gf: 38, ga: 9,  form: ['W','W','W','D','W'], palette: ['#1a0a28','#8a1e3c'] },
    { pos: 2, team: 'Rayo Urbano',     badge: 'RU', played: 14, w: 10, d: 2, l: 2, gf: 31, ga: 12, form: ['W','W','L','W','W'], palette: ['#281a0a','#aa5a1e'] },
    { pos: 3, team: 'FC Thunder',      badge: 'FT', played: 14, w: 9,  d: 3, l: 2, gf: 28, ga: 14, form: ['W','D','W','W','W'], palette: ['#0a1428','#1e3ca8'] },
    { pos: 4, team: 'Phantom FC',      badge: 'PF', played: 14, w: 8,  d: 3, l: 3, gf: 25, ga: 16, form: ['W','L','W','W','D'], palette: ['#0a281a','#1e8a5a'] },
    { pos: 5, team: 'Unión Central',   badge: 'UC', played: 14, w: 7,  d: 4, l: 3, gf: 22, ga: 17, form: ['D','W','W','D','W'], palette: ['#281a28','#6a1e8a'] },
    { pos: 6, team: 'Real Litoral',    badge: 'RL', played: 14, w: 6,  d: 3, l: 5, gf: 20, ga: 19, form: ['L','W','D','W','L'], palette: ['#0a2028','#1e6a8a'] },
    { pos: 7, team: 'Deportivo Sur',   badge: 'DS', played: 14, w: 5,  d: 4, l: 5, gf: 18, ga: 20, form: ['D','L','W','D','W'], palette: ['#282810','#8a8a1e'] },
    { pos: 8, team: 'Club Oriente',    badge: 'CO', played: 14, w: 4,  d: 3, l: 7, gf: 15, ga: 23, form: ['L','L','W','D','L'], palette: ['#28140a','#8a3c1e'] },
    { pos: 9, team: 'San Lorenzo B',   badge: 'SL', played: 14, w: 3,  d: 3, l: 8, gf: 12, ga: 26, form: ['L','D','L','L','W'], palette: ['#1a1a1a','#5a5a5a'] },
    { pos: 10, team: 'Estrella Azul',  badge: 'EA', played: 14, w: 2,  d: 2, l: 10, gf: 10, ga: 32, form: ['L','L','L','W','L'], palette: ['#0a1a2a','#1e4a8a'] },
  ],
  topScorers: [
    { name: 'Diego Morales', team: 'Atlético Nova', goals: 18, avatar: '#8a1e3c' },
    { name: 'Mateo Reyes',   team: 'FC Thunder',    goals: 15, avatar: '#1e3ca8', isUserTeam: true },
    { name: 'Luca Serrano',  team: 'Rayo Urbano',   goals: 13, avatar: '#aa5a1e' },
    { name: 'Iván Córdoba',  team: 'Phantom FC',    goals: 11, avatar: '#1e8a5a' },
  ],
  nextMatch: {
    home: 'FC Thunder',       homeBadge: 'FT', homeColor: '#1e3ca8',
    away: 'Rayo Urbano',      awayBadge: 'RU', awayColor: '#aa5a1e',
    date: 'Sáb 12 Dic',
    time: '16:00',
    venue: 'Campo Municipal Norte',
    matchday: 15,
  },
};

function LeagueScreen({ user, onNavigate, active }) {
  const [tab, setTab] = React.useState('tabla'); // tabla | goleadores | partidos
  const userTeamPos = LEAGUE_DATA.standings.find(s => s.team === LEAGUE_DATA.userTeam);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0F0D0A', overflow: 'hidden' }}>
      <div className="screen-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 52, paddingBottom: 90 }}>

        {/* Hero header w/ gradient */}
        <div style={{
          position: 'relative',
          padding: '16px 20px 20px',
          background: 'linear-gradient(180deg, rgba(204, 255, 0,0.08) 0%, transparent 100%)',
          overflow: 'hidden',
        }}>
          {/* Decorative trophy bg */}
          <div style={{
            position: 'absolute', right: -20, top: -20,
            color: 'rgba(204, 255, 0,0.08)',
            transform: 'rotate(-15deg)',
            pointerEvents: 'none',
          }}>
            <Icon.trophy size={180} color="currentColor"/>
          </div>

          <div style={{
            display: 'inline-block',
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(204, 255, 0,0.15)',
            border: '1px solid rgba(204, 255, 0,0.35)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
            color: '#CCFF00', letterSpacing: '0.15em',
            textTransform: 'uppercase', fontWeight: 700,
          }}>
            {LEAGUE_DATA.division}
          </div>
          <div style={{
            marginTop: 10,
            fontFamily: 'Archivo, sans-serif', fontWeight: 800,
            fontSize: 26, color: '#fff', letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            {LEAGUE_DATA.name}
          </div>
          <div style={{
            marginTop: 4,
            fontFamily: 'Space Grotesk', fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
          }}>
            {LEAGUE_DATA.season} · Jornada {LEAGUE_DATA.matchday}/{LEAGUE_DATA.totalMatchdays}
          </div>

          {/* Season progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{
              height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${(LEAGUE_DATA.matchday / LEAGUE_DATA.totalMatchdays) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #CCFF00, #FFB800)',
                boxShadow: '0 0 8px rgba(204, 255, 0,0.6)',
                borderRadius: 2,
              }}/>
            </div>
          </div>
        </div>

        {/* User's team position card — prominent */}
        {userTeamPos && (
          <div style={{ padding: '4px 16px 16px' }}>
            <div style={{
              padding: 14, borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(204, 255, 0,0.12) 0%, rgba(255, 184, 0,0.06) 100%)',
              border: '1.5px solid rgba(204, 255, 0,0.35)',
              boxShadow: '0 0 24px rgba(204, 255, 0,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 10, right: 12,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                color: '#CCFF00', letterSpacing: '0.15em', fontWeight: 700,
                textTransform: 'uppercase',
              }}>TU EQUIPO</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Position badge */}
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'linear-gradient(135deg, #CCFF00, #FFB800)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(204, 255, 0,0.45)',
                  flexShrink: 0,
                }}>
                  <div style={{
                    fontFamily: 'Archivo, sans-serif', fontWeight: 900,
                    fontSize: 26, color: '#fff', lineHeight: 1,
                  }}>{userTeamPos.pos}º</div>
                  <div style={{
                    fontFamily: 'Space Grotesk', fontSize: 8,
                    color: '#fff', letterSpacing: '0.1em',
                    fontWeight: 700, marginTop: 2,
                  }}>POSICIÓN</div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                    fontSize: 18, color: '#fff', letterSpacing: '-0.01em',
                  }}>{userTeamPos.team}</div>
                  <div style={{
                    marginTop: 6,
                    display: 'flex', gap: 10, alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    <StatPill label="PJ" value={userTeamPos.played} />
                    <StatPill label="PTS" value={userTeamPos.w * 3 + userTeamPos.d} highlight/>
                    <FormDots form={userTeamPos.form}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next match card */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
            color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em',
            fontWeight: 700, textTransform: 'uppercase', marginBottom: 8,
            padding: '0 2px',
          }}>Próximo partido · Jornada {LEAGUE_DATA.nextMatch.matchday}</div>
          <NextMatchCard match={LEAGUE_DATA.nextMatch}/>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 6, padding: '0 16px 14px',
          overflowX: 'auto',
        }}>
          {[
            { id: 'tabla', label: 'Tabla' },
            { id: 'partidos', label: 'Partidos' },
            { id: 'plantillas', label: 'Plantillas' },
            { id: 'goleadores', label: 'Goleadores' },
          ].map(t => {
            const isActive = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: '1 0 auto', height: 36, padding: '0 14px', borderRadius: 10,
                background: isActive ? '#CCFF00' : 'rgba(255,255,255,0.05)',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                fontFamily: 'Space Grotesk', fontWeight: 700,
                fontSize: 13, cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}>{t.label}</button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === 'tabla' && <StandingsTable data={LEAGUE_DATA.standings} userTeam={LEAGUE_DATA.userTeam}/>}
        {tab === 'partidos' && <FixturesList/>}
        {tab === 'plantillas' && <RostersList data={LEAGUE_DATA.standings} userTeam={LEAGUE_DATA.userTeam}/>}
        {tab === 'goleadores' && <TopScorers scorers={LEAGUE_DATA.topScorers}/>}

      </div>

      <TabBar active={active} onNavigate={onNavigate} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
function StatPill({ label, value, highlight }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 4,
    }}>
      <div style={{
        fontFamily: 'Archivo, sans-serif', fontWeight: 800,
        fontSize: 15, color: highlight ? '#CCFF00' : '#fff',
        textShadow: highlight ? '0 0 8px rgba(204, 255, 0,0.5)' : 'none',
      }}>{value}</div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em',
        fontWeight: 700,
      }}>{label}</div>
    </div>
  );
}

function FormDots({ form, size = 'md' }) {
  const s = size === 'sm' ? 8 : 10;
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {form.map((r, i) => (
        <div key={i} title={r} style={{
          width: s, height: s, borderRadius: '50%',
          background: r === 'W' ? '#CCFF00' : r === 'D' ? '#FFB800' : '#FF5B3A',
          boxShadow: r === 'W' ? '0 0 6px rgba(204, 255, 0,0.6)' : 'none',
        }}/>
      ))}
    </div>
  );
}

function TeamBadge({ badge, palette, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Archivo, sans-serif', fontWeight: 900,
      fontSize: size * 0.4, color: '#fff', letterSpacing: '-0.02em',
      border: '1px solid rgba(255,255,255,0.15)',
      flexShrink: 0,
    }}>{badge}</div>
  );
}

// ═════════════════════════════════════════════════════════════
function StandingsTable({ data, userTeam }) {
  return (
    <div style={{ padding: '0 12px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '28px 1fr 28px 28px 28px 34px',
          gap: 6, padding: '10px 12px',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em',
          fontWeight: 700, textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>#</div>
          <div>Equipo</div>
          <div style={{textAlign: 'center'}}>PJ</div>
          <div style={{textAlign: 'center'}}>DG</div>
          <div style={{textAlign: 'center'}}>Forma</div>
          <div style={{textAlign: 'right'}}>Pts</div>
        </div>

        {/* Rows */}
        {data.map((row, i) => {
          const isUser = row.team === userTeam;
          const pts = row.w * 3 + row.d;
          const dg = row.gf - row.ga;
          const zone = row.pos <= 2 ? 'promotion' : row.pos >= 9 ? 'relegation' : null;
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr 28px 28px 28px 34px',
              gap: 6, padding: '10px 12px',
              alignItems: 'center',
              background: isUser ? 'rgba(204, 255, 0,0.08)' : 'transparent',
              borderLeft: isUser ? '3px solid #CCFF00' : '3px solid transparent',
              borderBottom: i < data.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              position: 'relative',
            }}>
              {/* Position */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 14,
                color: isUser ? '#CCFF00' : '#fff',
              }}>
                {row.pos}
                {zone === 'promotion' && (
                  <div style={{ width: 3, height: 14, borderRadius: 2, background: '#FFB800', boxShadow: '0 0 4px #FFB800' }}/>
                )}
                {zone === 'relegation' && (
                  <div style={{ width: 3, height: 14, borderRadius: 2, background: '#FF5B3A' }}/>
                )}
              </div>

              {/* Team */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <TeamBadge badge={row.badge} palette={row.palette} size={24}/>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: isUser ? 700 : 600,
                  fontSize: 13, color: isUser ? '#fff' : 'rgba(255,255,255,0.9)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{row.team}</div>
              </div>

              {/* PJ */}
              <div style={{
                textAlign: 'center',
                fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600,
                color: 'rgba(255,255,255,0.7)',
              }}>{row.played}</div>

              {/* Goal diff */}
              <div style={{
                textAlign: 'center',
                fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600,
                color: dg > 0 ? '#CCFF00' : dg < 0 ? '#FF5B3A' : 'rgba(255,255,255,0.6)',
              }}>{dg > 0 ? '+' : ''}{dg}</div>

              {/* Form dots */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <FormDots form={row.form.slice(-3)} size="sm"/>
              </div>

              {/* Pts */}
              <div style={{
                textAlign: 'right',
                fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                fontSize: 15,
                color: isUser ? '#CCFF00' : '#fff',
                textShadow: isUser ? '0 0 8px rgba(204, 255, 0,0.5)' : 'none',
              }}>{pts}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: 14, marginTop: 10, padding: '0 4px',
        fontFamily: 'Space Grotesk', fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 3, height: 10, borderRadius: 2, background: '#FFB800' }}/>
          Ascenso
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 3, height: 10, borderRadius: 2, background: '#FF5B3A' }}/>
          Descenso
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
function NextMatchCard({ match }) {
  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      position: 'relative',
    }}>
      {/* Background image — pitch */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=85&auto=format&fit=crop)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.15,
        filter: 'blur(2px)',
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(15,13,10,0.7) 0%, rgba(15,13,10,0.95) 100%)',
      }}/>

      <div style={{ position: 'relative', padding: 16 }}>
        {/* VS layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', gap: 12,
        }}>
          {/* Home team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 54, height: 54, margin: '0 auto 8px',
              borderRadius: 14,
              background: `linear-gradient(135deg, ${match.homeColor}, ${match.homeColor}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Archivo', fontWeight: 900, fontSize: 22, color: '#fff',
              boxShadow: `0 4px 16px ${match.homeColor}55`,
              border: '1px solid rgba(255,255,255,0.15)',
            }}>{match.homeBadge}</div>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13,
              color: '#fff',
            }}>{match.home}</div>
            <div style={{
              marginTop: 2,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
              color: '#CCFF00', letterSpacing: '0.15em',
              fontWeight: 700,
            }}>LOCAL</div>
          </div>

          {/* VS center */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontStyle: 'italic',
              fontSize: 20, color: 'rgba(255,255,255,0.4)',
              letterSpacing: '-0.04em',
            }}>VS</div>
            <div style={{
              marginTop: 6,
              padding: '4px 10px', borderRadius: 8,
              background: 'rgba(204, 255, 0,0.15)',
              border: '1px solid rgba(204, 255, 0,0.3)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              color: '#CCFF00', fontWeight: 700, letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}>{match.time}</div>
          </div>

          {/* Away team */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 54, height: 54, margin: '0 auto 8px',
              borderRadius: 14,
              background: `linear-gradient(135deg, ${match.awayColor}, ${match.awayColor}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Archivo', fontWeight: 900, fontSize: 22, color: '#fff',
              boxShadow: `0 4px 16px ${match.awayColor}55`,
              border: '1px solid rgba(255,255,255,0.15)',
            }}>{match.awayBadge}</div>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13,
              color: '#fff',
            }}>{match.away}</div>
            <div style={{
              marginTop: 2,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
              color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em',
              fontWeight: 700,
            }}>VISITA</div>
          </div>
        </div>

        {/* Meta row */}
        <div style={{
          marginTop: 14, paddingTop: 12,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'Space Grotesk', fontSize: 11,
          color: 'rgba(255,255,255,0.7)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon.calendar size={12} color="rgba(255,255,255,0.5)"/>
            {match.date}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: '60%',
          }}>
            <Icon.pin size={12} color="rgba(255,255,255,0.5)"/>
            {match.venue}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
function TopScorers({ scorers }) {
  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        {scorers.map((s, i) => {
          const medal = i === 0 ? '#FFB800' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : null;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              background: s.isUserTeam ? 'rgba(204, 255, 0,0.08)' : 'transparent',
              borderLeft: s.isUserTeam ? '3px solid #CCFF00' : '3px solid transparent',
              borderBottom: i < scorers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{
                width: 26, textAlign: 'center',
                fontFamily: 'Archivo, sans-serif', fontWeight: 900,
                fontSize: 16, color: medal || 'rgba(255,255,255,0.5)',
                textShadow: medal ? `0 0 8px ${medal}66` : 'none',
              }}>{i + 1}</div>

              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `linear-gradient(135deg, ${s.avatar}, ${s.avatar}77)`,
                border: '1.5px solid rgba(255,255,255,0.15)',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13,
                color: '#fff',
              }}>{s.name.split(' ').map(n => n[0]).join('')}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700,
                  fontSize: 14, color: '#fff',
                }}>{s.name}</div>
                <div style={{
                  fontFamily: 'Space Grotesk', fontSize: 11,
                  color: 'rgba(255,255,255,0.55)', marginTop: 1,
                }}>{s.team}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                  fontSize: 20, color: '#CCFF00',
                  textShadow: '0 0 8px rgba(204, 255, 0,0.4)',
                  lineHeight: 1,
                }}>{s.goals}</div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
                  color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em',
                  fontWeight: 700, marginTop: 2,
                }}>GOLES</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
function FixturesList() {
  const fixtures = [
    { date: 'Sáb 12 Dic · 16:00', home: 'FC Thunder', away: 'Rayo Urbano', status: 'upcoming', md: 15, homeBadge: 'FT', awayBadge: 'RU', homeColor: '#1e3ca8', awayColor: '#aa5a1e' },
    { date: 'Sáb 19 Dic · 18:00', home: 'Atlético Nova', away: 'FC Thunder', status: 'upcoming', md: 16, homeBadge: 'AN', awayBadge: 'FT', homeColor: '#8a1e3c', awayColor: '#1e3ca8' },
    { date: 'Dom 27 Dic · 11:00', home: 'FC Thunder', away: 'Phantom FC', status: 'upcoming', md: 17, homeBadge: 'FT', awayBadge: 'PF', homeColor: '#1e3ca8', awayColor: '#1e8a5a' },
    // Past
    { date: 'Sáb 5 Dic · 16:00', home: 'FC Thunder', away: 'Unión Central', score: '3-1', status: 'won', md: 14, homeBadge: 'FT', awayBadge: 'UC', homeColor: '#1e3ca8', awayColor: '#6a1e8a' },
    { date: 'Sáb 28 Nov · 15:00', home: 'Real Litoral', away: 'FC Thunder', score: '0-2', status: 'won', md: 13, homeBadge: 'RL', awayBadge: 'FT', homeColor: '#1e6a8a', awayColor: '#1e3ca8' },
    { date: 'Sáb 21 Nov · 16:00', home: 'FC Thunder', away: 'Deportivo Sur', score: '1-1', status: 'drew', md: 12, homeBadge: 'FT', awayBadge: 'DS', homeColor: '#1e3ca8', awayColor: '#8a8a1e' },
  ];

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em',
        fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4,
      }}>Próximos</div>
      {fixtures.filter(f => f.status === 'upcoming').map((f, i) => (
        <FixtureRow key={i} fixture={f}/>
      ))}

      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em',
        fontWeight: 700, textTransform: 'uppercase',
        marginTop: 18, marginBottom: 8, paddingLeft: 4,
      }}>Resultados</div>
      {fixtures.filter(f => f.status !== 'upcoming').map((f, i) => (
        <FixtureRow key={i} fixture={f}/>
      ))}
    </div>
  );
}

function FixtureRow({ fixture }) {
  const isUserHome = fixture.home === 'FC Thunder';
  const resultColor = fixture.status === 'won' ? '#CCFF00' : fixture.status === 'drew' ? '#FFB800' : fixture.status === 'lost' ? '#FF5B3A' : null;
  const resultLabel = fixture.status === 'won' ? 'G' : fixture.status === 'drew' ? 'E' : fixture.status === 'lost' ? 'P' : null;

  return (
    <div style={{
      padding: '10px 12px', marginBottom: 8,
      borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em',
        fontWeight: 700, whiteSpace: 'nowrap',
        width: 56, flexShrink: 0,
      }}>
        J{fixture.md}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            flex: 1, minWidth: 0,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: `linear-gradient(135deg, ${fixture.homeColor}, ${fixture.homeColor}99)`,
              fontFamily: 'Archivo', fontWeight: 900, fontSize: 9,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{fixture.homeBadge}</div>
            <div style={{
              fontFamily: 'Space Grotesk',
              fontWeight: fixture.home === 'FC Thunder' ? 700 : 500,
              fontSize: 12,
              color: fixture.home === 'FC Thunder' ? '#fff' : 'rgba(255,255,255,0.8)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{fixture.home}</div>
          </div>

          {fixture.score ? (
            <div style={{
              fontFamily: 'Archivo, sans-serif', fontWeight: 800,
              fontSize: 13, color: '#fff', padding: '2px 8px',
              borderRadius: 6, background: 'rgba(255,255,255,0.08)',
              whiteSpace: 'nowrap',
            }}>{fixture.score}</div>
          ) : (
            <div style={{
              fontFamily: 'Space Grotesk', fontSize: 10,
              color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em',
              fontWeight: 700,
            }}>vs</div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            flex: 1, minWidth: 0, justifyContent: 'flex-end',
          }}>
            <div style={{
              fontFamily: 'Space Grotesk',
              fontWeight: fixture.away === 'FC Thunder' ? 700 : 500,
              fontSize: 12,
              color: fixture.away === 'FC Thunder' ? '#fff' : 'rgba(255,255,255,0.8)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              textAlign: 'right',
            }}>{fixture.away}</div>
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              background: `linear-gradient(135deg, ${fixture.awayColor}, ${fixture.awayColor}99)`,
              fontFamily: 'Archivo', fontWeight: 900, fontSize: 9,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{fixture.awayBadge}</div>
          </div>
        </div>

        <div style={{
          marginTop: 3,
          fontFamily: 'Space Grotesk', fontSize: 10,
          color: 'rgba(255,255,255,0.45)',
        }}>{fixture.date}</div>
      </div>

      {resultLabel && (
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: `${resultColor}22`,
          border: `1px solid ${resultColor}88`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Archivo', fontWeight: 900, fontSize: 11,
          color: resultColor,
          flexShrink: 0,
          boxShadow: `0 0 6px ${resultColor}44`,
        }}>{resultLabel}</div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// ROSTERS LIST — shows all team squads, expandable, user's team first
// ═════════════════════════════════════════════════════════════

const POSITIONS = { GK: '#FFB800', DEF: '#FFB800', MID: '#CCFF00', FWD: '#FF5B3A' };

// Build per-team rosters (deterministic, lightweight)
const ROSTERS = {
  'FC Thunder': [
    { num: 1,  name: 'Martín Vega',    pos: 'GK',  goals: 0,  assists: 0, age: 16, captain: false },
    { num: 4,  name: 'Pablo Herrera',  pos: 'DEF', goals: 2,  assists: 1, age: 17, captain: false },
    { num: 5,  name: 'Diego Navarro',  pos: 'DEF', goals: 1,  assists: 0, age: 16, captain: true },
    { num: 6,  name: 'Andrés Silva',   pos: 'DEF', goals: 0,  assists: 2, age: 16, captain: false },
    { num: 8,  name: 'Tomás Ríos',     pos: 'MID', goals: 4,  assists: 6, age: 17, captain: false },
    { num: 10, name: 'Mateo Reyes',    pos: 'FWD', goals: 15, assists: 4, age: 16, captain: false, star: true, isUser: true },
    { num: 11, name: 'Lucas Fernández',pos: 'FWD', goals: 6,  assists: 3, age: 17, captain: false },
    { num: 14, name: 'Javier Ortiz',   pos: 'MID', goals: 2,  assists: 5, age: 15, captain: false },
    { num: 17, name: 'Bruno Márquez',  pos: 'MID', goals: 3,  assists: 2, age: 16, captain: false },
    { num: 21, name: 'Nicolás Paz',    pos: 'DEF', goals: 0,  assists: 1, age: 15, captain: false },
    { num: 23, name: 'Gonzalo Vera',   pos: 'FWD', goals: 5,  assists: 1, age: 17, captain: false },
  ],
  'Atlético Nova': [
    { num: 1,  name: 'Iván Castro',    pos: 'GK',  goals: 0,  assists: 0, age: 17 },
    { num: 3,  name: 'Sergio Medina',  pos: 'DEF', goals: 1,  assists: 0, age: 17, captain: true },
    { num: 6,  name: 'Ramiro Díaz',    pos: 'DEF', goals: 0,  assists: 3, age: 16 },
    { num: 8,  name: 'Facundo López',  pos: 'MID', goals: 3,  assists: 8, age: 17 },
    { num: 9,  name: 'Diego Morales',  pos: 'FWD', goals: 18, assists: 5, age: 17, star: true },
    { num: 10, name: 'Julián Peña',    pos: 'MID', goals: 5,  assists: 7, age: 16 },
    { num: 11, name: 'Emilio Carmona', pos: 'FWD', goals: 9,  assists: 2, age: 17 },
    { num: 14, name: 'Hugo Varela',    pos: 'DEF', goals: 2,  assists: 1, age: 16 },
    { num: 18, name: 'Rodrigo Sosa',   pos: 'MID', goals: 1,  assists: 4, age: 15 },
  ],
  'Rayo Urbano': [
    { num: 1,  name: 'Cristian Luna',  pos: 'GK',  goals: 0,  assists: 0, age: 17 },
    { num: 4,  name: 'Marcos Torres',  pos: 'DEF', goals: 1,  assists: 0, age: 16 },
    { num: 5,  name: 'Kevin Arias',    pos: 'DEF', goals: 0,  assists: 1, age: 17, captain: true },
    { num: 7,  name: 'Luca Serrano',   pos: 'FWD', goals: 13, assists: 4, age: 16, star: true },
    { num: 9,  name: 'Nahuel Ramírez', pos: 'FWD', goals: 7,  assists: 3, age: 17 },
    { num: 10, name: 'Santiago Ruiz',  pos: 'MID', goals: 4,  assists: 9, age: 16 },
    { num: 13, name: 'Axel Benítez',   pos: 'MID', goals: 2,  assists: 4, age: 15 },
    { num: 19, name: 'Rodrigo Flores', pos: 'DEF', goals: 0,  assists: 2, age: 17 },
  ],
  'Phantom FC': [
    { num: 1,  name: 'Franco Vidal',   pos: 'GK',  goals: 0,  assists: 0, age: 16 },
    { num: 3,  name: 'Alan Benitez',   pos: 'DEF', goals: 0,  assists: 0, age: 15 },
    { num: 8,  name: 'Iván Córdoba',   pos: 'FWD', goals: 11, assists: 3, age: 16, star: true },
    { num: 10, name: 'Juan Cáceres',   pos: 'MID', goals: 5,  assists: 6, age: 15, captain: true },
    { num: 11, name: 'Dylan Aguirre',  pos: 'FWD', goals: 6,  assists: 2, age: 16 },
    { num: 14, name: 'Leonel Pérez',   pos: 'MID', goals: 2,  assists: 3, age: 14 },
  ],
  'Unión Central': [
    { num: 1,  name: 'Mauro Cabrera',  pos: 'GK',  goals: 0, assists: 0, age: 17 },
    { num: 5,  name: 'Álvaro Soto',    pos: 'DEF', goals: 1, assists: 1, age: 16, captain: true },
    { num: 9,  name: 'Gael Moreno',    pos: 'FWD', goals: 9, assists: 2, age: 17 },
    { num: 10, name: 'Ezequiel Durán', pos: 'MID', goals: 4, assists: 5, age: 16 },
    { num: 14, name: 'Tiago Escobar',  pos: 'FWD', goals: 5, assists: 1, age: 15 },
  ],
  'Real Litoral': [
    { num: 1,  name: 'Brian Acosta',   pos: 'GK',  goals: 0, assists: 0, age: 17 },
    { num: 6,  name: 'Cristóbal Vera', pos: 'DEF', goals: 0, assists: 0, age: 16, captain: true },
    { num: 9,  name: 'Elías Pinto',    pos: 'FWD', goals: 8, assists: 2, age: 16 },
    { num: 10, name: 'Lautaro Gómez',  pos: 'MID', goals: 3, assists: 4, age: 17 },
  ],
  'Deportivo Sur': [
    { num: 1,  name: 'Benjamín Rojas', pos: 'GK',  goals: 0, assists: 0, age: 16 },
    { num: 4,  name: 'Maxi Villalba',  pos: 'DEF', goals: 1, assists: 0, age: 17, captain: true },
    { num: 9,  name: 'Thiago Salas',   pos: 'FWD', goals: 7, assists: 3, age: 16 },
    { num: 10, name: 'Renato Aldana',  pos: 'MID', goals: 3, assists: 3, age: 16 },
  ],
  'Club Oriente': [
    { num: 1,  name: 'Pedro Juárez',   pos: 'GK',  goals: 0, assists: 0, age: 17 },
    { num: 5,  name: 'Ariel Sosa',     pos: 'DEF', goals: 0, assists: 0, age: 16, captain: true },
    { num: 9,  name: 'Bruno Rivas',    pos: 'FWD', goals: 5, assists: 1, age: 16 },
    { num: 10, name: 'Franco Medina',  pos: 'MID', goals: 2, assists: 2, age: 17 },
  ],
  'San Lorenzo B': [
    { num: 1,  name: 'Dante Quiroga',  pos: 'GK',  goals: 0, assists: 0, age: 17 },
    { num: 4,  name: 'Guido Paredes',  pos: 'DEF', goals: 0, assists: 0, age: 16, captain: true },
    { num: 9,  name: 'Simón Gálvez',   pos: 'FWD', goals: 4, assists: 2, age: 16 },
    { num: 10, name: 'Ian Molina',     pos: 'MID', goals: 1, assists: 2, age: 15 },
  ],
  'Estrella Azul': [
    { num: 1,  name: 'Matías Herrera', pos: 'GK',  goals: 0, assists: 0, age: 16 },
    { num: 5,  name: 'Nahuel Ferrari', pos: 'DEF', goals: 0, assists: 0, age: 17, captain: true },
    { num: 9,  name: 'Valentín Luna',  pos: 'FWD', goals: 3, assists: 1, age: 16 },
    { num: 10, name: 'Ciro Domínguez', pos: 'MID', goals: 2, assists: 1, age: 16 },
  ],
};

function RostersList({ data, userTeam }) {
  // User's team first, then the rest
  const sorted = [
    ...data.filter(t => t.team === userTeam),
    ...data.filter(t => t.team !== userTeam),
  ];
  const [expanded, setExpanded] = React.useState(userTeam);

  return (
    <div style={{ padding: '0 16px' }}>
      {sorted.map((t, i) => (
        <RosterCard
          key={t.team}
          team={t}
          roster={ROSTERS[t.team] || []}
          isUserTeam={t.team === userTeam}
          open={expanded === t.team}
          onToggle={() => setExpanded(expanded === t.team ? null : t.team)}
        />
      ))}
    </div>
  );
}

function RosterCard({ team, roster, isUserTeam, open, onToggle }) {
  return (
    <div style={{
      marginBottom: 10,
      borderRadius: 14,
      background: isUserTeam ? 'rgba(204, 255, 0,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isUserTeam ? 'rgba(204, 255, 0,0.3)' : 'rgba(255,255,255,0.06)'}`,
      overflow: 'hidden',
      transition: 'all 0.2s',
      boxShadow: isUserTeam ? '0 0 20px rgba(204, 255, 0,0.12)' : 'none',
    }}>
      {/* Header row */}
      <button onClick={onToggle} style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        background: 'transparent', border: 'none',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <TeamBadge badge={team.badge} palette={team.palette} size={36}/>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 700,
              fontSize: 14, color: '#fff',
            }}>{team.team}</div>
            {isUserTeam && (
              <div style={{
                padding: '2px 6px', borderRadius: 5,
                background: 'rgba(204, 255, 0,0.15)',
                border: '1px solid rgba(204, 255, 0,0.35)',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
                color: '#CCFF00', letterSpacing: '0.1em',
                fontWeight: 700, textTransform: 'uppercase',
              }}>Tu equipo</div>
            )}
          </div>
          <div style={{
            marginTop: 2,
            fontFamily: 'Space Grotesk', fontSize: 11,
            color: 'rgba(255,255,255,0.55)',
          }}>
            {team.pos}º · {roster.length} jugadores
          </div>
        </div>

        <div style={{
          color: 'rgba(255,255,255,0.4)',
          transform: open ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.2s',
        }}>
          <Icon.chevron size={14}/>
        </div>
      </button>

      {/* Expanded roster */}
      {open && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 0 4px',
        }}>
          {/* Position legend */}
          <div style={{
            display: 'flex', gap: 12, padding: '0 14px 10px',
            flexWrap: 'wrap',
          }}>
            {Object.entries(POSITIONS).map(([p, c]) => (
              <div key={p} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em',
                fontWeight: 700,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: c, boxShadow: `0 0 4px ${c}` }}/>
                {p}
              </div>
            ))}
          </div>

          {/* Sub-header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '22px 22px 1fr 24px 24px',
            gap: 8, padding: '6px 14px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em',
            fontWeight: 700, textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div>#</div>
            <div></div>
            <div>Jugador</div>
            <div style={{ textAlign: 'center' }}>G</div>
            <div style={{ textAlign: 'center' }}>A</div>
          </div>

          {/* Players */}
          {roster.map((p, i) => (
            <PlayerRow key={i} player={p}/>
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerRow({ player }) {
  const posColor = POSITIONS[player.pos];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '22px 22px 1fr 24px 24px',
      gap: 8, padding: '9px 14px',
      alignItems: 'center',
      background: player.isUser ? 'rgba(204, 255, 0,0.05)' : 'transparent',
      borderLeft: player.isUser ? '2px solid #CCFF00' : '2px solid transparent',
    }}>
      {/* Shirt number */}
      <div style={{
        fontFamily: 'Archivo, sans-serif', fontWeight: 900,
        fontSize: 13, color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
      }}>{player.num}</div>

      {/* Position dot */}
      <div style={{
        padding: '2px 0',
        borderRadius: 4,
        background: `${posColor}22`,
        border: `1px solid ${posColor}88`,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
        fontWeight: 700, color: posColor,
        textAlign: 'center', letterSpacing: '0.05em',
      }}>{player.pos}</div>

      {/* Name + badges */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        minWidth: 0,
      }}>
        <div style={{
          fontFamily: 'Space Grotesk',
          fontWeight: player.star || player.captain ? 700 : 500,
          fontSize: 12.5,
          color: player.isUser ? '#CCFF00' : '#fff',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{player.name}</div>

        {player.captain && (
          <div title="Capitán" style={{
            width: 14, height: 14, borderRadius: 3,
            background: '#FFB800',
            color: '#fff',
            fontFamily: 'Archivo', fontWeight: 900, fontSize: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>C</div>
        )}
        {player.star && (
          <div title="Goleador" style={{ flexShrink: 0, color: '#FFB800', filter: 'drop-shadow(0 0 3px #FFB800)' }}>
            <Icon.star size={10} color="#FFB800"/>
          </div>
        )}

        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          color: 'rgba(255,255,255,0.35)', marginLeft: 'auto',
          flexShrink: 0,
        }}>{player.age}a</div>
      </div>

      {/* Goals */}
      <div style={{
        textAlign: 'center',
        fontFamily: 'Space Grotesk', fontWeight: 700,
        fontSize: 12,
        color: player.goals > 0 ? '#CCFF00' : 'rgba(255,255,255,0.4)',
      }}>{player.goals}</div>

      {/* Assists */}
      <div style={{
        textAlign: 'center',
        fontFamily: 'Space Grotesk', fontWeight: 700,
        fontSize: 12,
        color: player.assists > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
      }}>{player.assists}</div>
    </div>
  );
}

window.LeagueScreen = LeagueScreen;
