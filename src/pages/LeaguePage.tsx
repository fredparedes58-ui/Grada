import { useState } from 'react'
import { Trophy, Target, Calendar, MapPin, TrendingUp, Award, Flame } from 'lucide-react'
import BottomNav from '../components/ui/BottomNav'
import GlassCard from '../components/ui/GlassCard'
import BottomSheet from '../components/ui/BottomSheet'
import { Skeleton } from '../components/ui/Skeleton'
import { useSimulatedLoad } from '../hooks/useSimulatedLoad'
import LeaderboardSheet from '../features/leaderboard/LeaderboardSheet'

interface Standing { pos: number; team: string; pts: number; pj: number; gf: number; gc: number }
interface Scorer   { player: string; team: string; goals: number }
interface Fixture  { home: string; away: string; date: string; venue: string }

const STANDINGS: Standing[] = [
  { pos: 1, team: 'CF Benimàmet',       pts: 12, pj: 5, gf: 14, gc: 5 },
  { pos: 2, team: 'Valencia BC',        pts: 10, pj: 5, gf: 11, gc: 6 },
  { pos: 3, team: 'Mestalla CF',        pts: 9,  pj: 5, gf: 9,  gc: 7 },
  { pos: 4, team: 'CD Borriol',         pts: 7,  pj: 5, gf: 8,  gc: 9 },
  { pos: 5, team: 'Valencia Mestalla B', pts: 6,  pj: 5, gf: 6,  gc: 10 },
]

const SCORERS: Scorer[] = [
  { player: 'Carlos Martínez', team: 'Valencia BC',        goals: 6 },
  { player: 'Pau Ferrer',      team: 'CF Benimàmet',       goals: 5 },
  { player: 'Adrián Molina',   team: 'Mestalla CF',        goals: 4 },
  { player: 'Jordi Palau',     team: 'CD Borriol',         goals: 3 },
]

const FIXTURES: Fixture[] = [
  { home: 'Valencia BC',   away: 'Mestalla CF',        date: 'Sáb · 11:00', venue: 'Campo El Saler' },
  { home: 'CF Benimàmet',  away: 'CD Borriol',         date: 'Sáb · 13:00', venue: 'Camp de Benimàmet' },
  { home: 'Valencia Mestalla B', away: 'CF Benimàmet', date: 'Dom · 10:00', venue: 'Fernán Caballero' },
]

type Tab = 'tabla' | 'goleadores' | 'partidos'
type Drawer =
  | { kind: 'standing'; data: Standing }
  | { kind: 'scorer'; data: Scorer; rank: number }
  | { kind: 'fixture'; data: Fixture }
  | null

export default function LeaguePage() {
  const loading = useSimulatedLoad(700)
  const [tab, setTab] = useState<Tab>('tabla')
  const [drawer, setDrawer] = useState<Drawer>(null)
  const [lbOpen, setLbOpen] = useState(false)

  const drawerTitle =
    drawer?.kind === 'standing' ? drawer.data.team :
    drawer?.kind === 'scorer'   ? drawer.data.player :
    drawer?.kind === 'fixture'  ? 'Detalle del partido' : undefined

  const drawerAccent =
    drawer?.kind === 'standing' ? 'var(--accent-primary)' :
    drawer?.kind === 'scorer'   ? 'var(--accent-secondary)' :
    drawer?.kind === 'fixture'  ? 'var(--accent-warm)' : 'var(--accent-primary)'

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflow: 'hidden' }}>
      <div
        className="screen-scroll"
        style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 60, paddingBottom: 90 }}
      >
        {/* Header */}
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FAFBFD', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Trophy size={22} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700,
                fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em',
              }}
            >
              Liga Autonómica Valenciana
            </div>
            <div
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 12, color: 'rgba(10, 21, 48, 0.5)',
              }}
            >
              Temporada 2026 · J5
            </div>
          </div>
          <button
            onClick={() => setLbOpen(true)}
            style={{
              marginLeft: 'auto',
              padding: '10px 14px', borderRadius: 12,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
            }}
          >
            <Award size={14} /> Ranking
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8 }}>
          {([
            ['tabla', 'Tabla'],
            ['goleadores', 'Goleadores'],
            ['partidos', 'Partidos'],
          ] as [Tab, string][]).map(([id, label]) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10,
                  background: active ? 'var(--bg-surface-alt)' : 'rgba(10, 21, 48, 0.04)',
                  border: `1.5px solid ${active ? 'var(--accent-primary)' : 'var(--border)'}`,
                  color: active ? 'var(--accent-primary)' : 'rgba(10, 21, 48, 0.5)',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ padding: '0 20px' }}>
          {loading && (
            <GlassCard padding={0}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid', gridTemplateColumns: '28px 1fr 48px 48px',
                    gap: 10, alignItems: 'center', padding: '14px 14px',
                    borderBottom: i < 5 ? '1px solid rgba(10, 21, 48, 0.05)' : 'none',
                  }}
                >
                  <Skeleton width={24} height={24} radius={6} />
                  <Skeleton width="70%" height={12} />
                  <Skeleton width={36} height={10} />
                  <Skeleton width={24} height={14} style={{ marginLeft: 'auto' }} />
                </div>
              ))}
            </GlassCard>
          )}
          {!loading && tab === 'tabla' && (
            <GlassCard padding={0}>
              {STANDINGS.map((s, i) => (
                <div
                  key={i}
                  onClick={() => setDrawer({ kind: 'standing', data: s })}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr 48px 48px',
                    gap: 10, alignItems: 'center',
                    padding: '12px 14px',
                    borderBottom: i < STANDINGS.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: s.pos <= 3 ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'var(--border)',
                      color: s.pos <= 3 ? '#FAFBFD' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 11,
                    }}
                  >
                    {s.pos}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                      fontSize: 13, color: 'var(--text-primary)',
                    }}
                  >
                    {s.team}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: 11, color: 'rgba(10, 21, 48, 0.45)', textAlign: 'center',
                    }}
                  >
                    {s.gf}:{s.gc}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700,
                      fontSize: 14, color: 'var(--accent-primary)', textAlign: 'right',
                    }}
                  >
                    {s.pts}
                  </div>
                </div>
              ))}
            </GlassCard>
          )}

          {!loading && tab === 'goleadores' && (
            <GlassCard padding={0}>
              {SCORERS.map((s, i) => (
                <div
                  key={i}
                  onClick={() => setDrawer({ kind: 'scorer', data: s, rank: i + 1 })}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    borderBottom: i < SCORERS.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: i === 0 ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'var(--border)',
                      color: i === 0 ? '#FAFBFD' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 12,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                        fontSize: 13, color: 'var(--text-primary)',
                      }}
                    >
                      {s.player}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: 11, color: 'rgba(10, 21, 48, 0.45)',
                      }}
                    >
                      {s.team}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--accent-primary)' }}>
                    <Target size={14} />
                    <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 16 }}>
                      {s.goals}
                    </span>
                  </div>
                </div>
              ))}
            </GlassCard>
          )}

          {!loading && tab === 'partidos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FIXTURES.map((f, i) => (
                <div key={i} onClick={() => setDrawer({ kind: 'fixture', data: f })} style={{ cursor: 'pointer' }}>
                  <GlassCard padding={14}>
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 10, color: 'var(--accent-secondary)',
                      }}
                    >
                      <Calendar size={13} />
                      <span
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                          fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}
                      >
                        {f.date}
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: 11, color: 'rgba(10, 21, 48, 0.45)',
                        }}
                      >
                        {f.venue}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                      <div
                        style={{
                          flex: 1,
                          fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 15,
                          color: 'var(--text-primary)', textAlign: 'right',
                        }}
                      >
                        {f.home}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                          fontSize: 12, color: 'var(--text-dim)',
                          padding: '4px 10px', background: 'rgba(10, 21, 48, 0.05)',
                          borderRadius: 6,
                        }}
                      >
                        VS
                      </div>
                      <div
                        style={{
                          flex: 1,
                          fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 15,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {f.away}
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomSheet
        open={!!drawer}
        onClose={() => setDrawer(null)}
        title={drawerTitle}
        accent={drawerAccent}
        height="60%"
      >
        {drawer?.kind === 'standing' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 18 }}>
              {[
                ['POS', `#${drawer.data.pos}`, 'var(--accent-primary)'],
                ['PTS', drawer.data.pts, 'var(--accent-primary)'],
                ['PJ',  drawer.data.pj, 'var(--text-primary)'],
                ['DIF', drawer.data.gf - drawer.data.gc, drawer.data.gf >= drawer.data.gc ? 'var(--accent-primary)' : '#EF4444'],
              ].map(([l, v, c]) => (
                <div
                  key={l as string}
                  style={{
                    padding: '12px 6px',
                    background: 'rgba(10, 21, 48, 0.04)',
                    borderRadius: 10, textAlign: 'center',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 20, color: c as string }}>{v}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'rgba(10, 21, 48, 0.45)', letterSpacing: '0.08em' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: 'rgba(10, 21, 48, 0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Rendimiento
            </div>
            {[
              { label: 'Goles a favor', value: drawer.data.gf, color: 'var(--accent-primary)', icon: TrendingUp },
              { label: 'Goles en contra', value: drawer.data.gc, color: 'var(--accent-secondary)', icon: Flame },
              { label: 'Promedio por partido', value: (drawer.data.pts / drawer.data.pj).toFixed(2), color: 'var(--accent-warm)', icon: Award },
            ].map((r, i) => {
              const I = r.icon
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', marginBottom: 8,
                  background: 'rgba(10, 21, 48, 0.03)', borderRadius: 10,
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `${r.color}18`, color: r.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <I size={14} />
                  </div>
                  <div style={{ flex: 1, fontFamily: 'Space Grotesk', fontSize: 13, color: 'var(--text-primary)' }}>{r.label}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 15, color: r.color }}>{r.value}</div>
                </div>
              )
            })}
          </div>
        )}

        {drawer?.kind === 'scorer' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 22, color: '#FAFBFD',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
              }}>
                #{drawer.rank}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>{drawer.data.player}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(10, 21, 48, 0.5)' }}>{drawer.data.team}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 28, color: 'var(--accent-primary)' }}>{drawer.data.goals}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'rgba(10, 21, 48, 0.45)', letterSpacing: '0.08em' }}>GOLES</div>
              </div>
            </div>
            <div style={{ padding: '16px 0' }}>
              {[
                { label: 'Prom. goles/partido', value: (drawer.data.goals / 16).toFixed(2) },
                { label: 'Minutos jugados', value: `${1200 + drawer.rank * 40}′` },
                { label: 'Tarjetas amarillas', value: 3 + drawer.rank },
                { label: 'Hat-tricks', value: Math.max(0, 3 - drawer.rank) },
              ].map((r, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 12px', marginBottom: 6,
                  background: 'rgba(10, 21, 48, 0.03)', borderRadius: 10,
                  border: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(10, 21, 48, 0.6)' }}>{r.label}</span>
                  <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {drawer?.kind === 'fixture' && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 18, padding: '8px 0 20px',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, margin: '0 auto 8px',
                  background: 'var(--bg-surface-alt)', color: 'var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 18,
                  border: '2px solid rgba(16, 185, 129, 0.25)',
                }}>
                  {drawer.data.home.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
                  {drawer.data.home}
                </div>
              </div>
              <div style={{
                fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 24,
                color: 'var(--accent-secondary)', letterSpacing: '-0.02em',
              }}>
                VS
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, margin: '0 auto 8px',
                  background: 'rgba(93, 195, 255, 0.10)', color: 'var(--accent-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Fraunces, serif', fontWeight: 800, fontSize: 18,
                  border: '2px solid rgba(93, 195, 255, 0.25)',
                }}>
                  {drawer.data.away.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
                  {drawer.data.away}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px', background: 'rgba(10, 21, 48, 0.03)', borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                <Calendar size={16} color="#5DC3FF" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(10, 21, 48, 0.45)' }}>Fecha y hora</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{drawer.data.date}</div>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px', background: 'rgba(10, 21, 48, 0.03)', borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                <MapPin size={16} color="#10B981" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(10, 21, 48, 0.45)' }}>Cancha</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{drawer.data.venue}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </BottomSheet>

      <LeaderboardSheet open={lbOpen} onClose={() => setLbOpen(false)} />

      <BottomNav />
    </div>
  )
}
