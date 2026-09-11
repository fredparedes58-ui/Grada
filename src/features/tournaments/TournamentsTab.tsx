/**
 * Sprint C — Tab de Torneos para CommunityPage.
 * Brackets eliminatorios (8 equipos), crear torneo, inscribirse.
 */
import { useState } from 'react'
import { Trophy, Plus, Users, Calendar, ChevronRight, Check, Lock, Flame } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import BottomSheet from '../../components/ui/BottomSheet'
import { useAuth } from '../../context/AuthContext'

interface TournamentMatch {
  id: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  status: 'pending' | 'live' | 'done'
}

interface Tournament {
  id: string
  name: string
  organizer: string
  teams: number
  maxTeams: number
  status: 'open' | 'in_progress' | 'finished'
  prize: string
  date: string
  color: string
  rounds: TournamentMatch[][]
}

const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'Copa Verano GRADA',
    organizer: 'Los Pumas FC',
    teams: 6,
    maxTeams: 8,
    status: 'open',
    prize: 'Medallas + Feature en app',
    date: 'Jun 15, 2026',
    color: '#CCFF00',
    rounds: [
      [
        { id: 'qf1', home: 'Los Pumas FC',    away: 'Rayo Urbano',     homeScore: null, awayScore: null, status: 'pending' },
        { id: 'qf2', home: 'Águilas Doradas', away: 'Phantom FC',      homeScore: null, awayScore: null, status: 'pending' },
        { id: 'qf3', home: 'Tigres Verdes',   away: 'Cometa SC',       homeScore: null, awayScore: null, status: 'pending' },
        { id: 'qf4', home: 'TBD',             away: 'TBD',             homeScore: null, awayScore: null, status: 'pending' },
      ],
      [
        { id: 'sf1', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null, status: 'pending' },
        { id: 'sf2', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null, status: 'pending' },
      ],
      [
        { id: 'f1', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null, status: 'pending' },
      ],
    ],
  },
  {
    id: 't2',
    name: 'Liga Nocturna Futsal',
    organizer: 'Rayo Urbano',
    teams: 8,
    maxTeams: 8,
    status: 'in_progress',
    prize: 'Trofeo + 500€ en material',
    date: 'Mayo – Jun 2026',
    color: '#FF5B3A',
    rounds: [
      [
        { id: 'qf1', home: 'Los Pumas FC',    away: 'Rayo Urbano',     homeScore: 2, awayScore: 1, status: 'done' },
        { id: 'qf2', home: 'Águilas Doradas', away: 'Phantom FC',      homeScore: 3, awayScore: 2, status: 'done' },
        { id: 'qf3', home: 'Tigres Verdes',   away: 'Cometa SC',       homeScore: 1, awayScore: 0, status: 'done' },
        { id: 'qf4', home: 'Vila-real B',     away: 'CF Burjassot',    homeScore: 2, awayScore: 2, status: 'live' },
      ],
      [
        { id: 'sf1', home: 'Los Pumas FC',    away: 'Águilas Doradas', homeScore: null, awayScore: null, status: 'pending' },
        { id: 'sf2', home: 'Tigres Verdes',   away: 'TBD',             homeScore: null, awayScore: null, status: 'pending' },
      ],
      [
        { id: 'f1', home: 'TBD', away: 'TBD', homeScore: null, awayScore: null, status: 'pending' },
      ],
    ],
  },
  {
    id: 't3',
    name: 'Memorial Pedro García',
    organizer: 'CD Castellón B',
    teams: 8,
    maxTeams: 8,
    status: 'finished',
    prize: 'Trofeo conmemorativo',
    date: 'Abril 2026',
    color: '#B347FF',
    rounds: [
      [
        { id: 'qf1', home: 'Los Pumas FC',    away: 'Rayo Urbano',     homeScore: 1, awayScore: 2, status: 'done' },
        { id: 'qf2', home: 'Águilas Doradas', away: 'Phantom FC',      homeScore: 4, awayScore: 1, status: 'done' },
        { id: 'qf3', home: 'Tigres Verdes',   away: 'Cometa SC',       homeScore: 2, awayScore: 0, status: 'done' },
        { id: 'qf4', home: 'Vila-real B',     away: 'CF Burjassot',    homeScore: 3, awayScore: 1, status: 'done' },
      ],
      [
        { id: 'sf1', home: 'Rayo Urbano',     away: 'Águilas Doradas', homeScore: 1, awayScore: 2, status: 'done' },
        { id: 'sf2', home: 'Tigres Verdes',   away: 'Vila-real B',     homeScore: 0, awayScore: 1, status: 'done' },
      ],
      [
        { id: 'f1', home: 'Águilas Doradas',  away: 'Vila-real B',     homeScore: 2, awayScore: 1, status: 'done' },
      ],
    ],
  },
]

const ROUND_NAMES = ['Cuartos', 'Semifinales', 'Final']

const STATUS_STYLE = {
  open:        { label: 'Inscripciones abiertas', color: '#CCFF00', bg: 'rgba(204,255,0,0.12)' },
  in_progress: { label: 'En curso',               color: '#FF5B3A', bg: 'rgba(255,91,58,0.12)' },
  finished:    { label: 'Finalizado',              color: 'rgba(250,245,235,0.4)', bg: 'rgba(255,255,255,0.06)' },
}

// Mini bracket component for a single match
function MatchNode({ m, accent }: { m: TournamentMatch; accent: string }) {
  const isPending = m.status === 'pending'
  const isLive = m.status === 'live'
  const isDone = m.status === 'done'

  const homeWon = isDone && m.homeScore! > m.awayScore!
  const awayWon = isDone && m.awayScore! > m.homeScore!

  return (
    <div style={{
      borderRadius: 10,
      background: isLive ? 'rgba(255,91,58,0.10)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${isLive ? 'rgba(255,91,58,0.4)' : 'rgba(255,220,180,0.07)'}`,
      overflow: 'hidden',
      minWidth: 130,
    }}>
      {/* Home */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 10px',
        borderBottom: '1px solid rgba(255,220,180,0.06)',
        background: homeWon ? `${accent}0e` : 'transparent',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk', fontWeight: homeWon ? 700 : 500, fontSize: 11,
          color: homeWon ? '#FAF5EB' : isPending ? 'rgba(250,245,235,0.4)' : 'rgba(250,245,235,0.75)',
          maxWidth: 88, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {m.home}
        </span>
        {!isPending && (
          <span style={{
            fontFamily: 'Archivo', fontWeight: 800, fontSize: 13,
            color: homeWon ? accent : 'rgba(250,245,235,0.6)',
            marginLeft: 6, flexShrink: 0,
          }}>
            {m.homeScore}
          </span>
        )}
        {isLive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF5B3A', boxShadow: '0 0 5px #FF5B3A', animation: 'pulse-glow 1.2s ease-in-out infinite', marginLeft: 4, flexShrink: 0 }} />}
      </div>
      {/* Away */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 10px',
        background: awayWon ? `${accent}0e` : 'transparent',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk', fontWeight: awayWon ? 700 : 500, fontSize: 11,
          color: awayWon ? '#FAF5EB' : isPending ? 'rgba(250,245,235,0.4)' : 'rgba(250,245,235,0.75)',
          maxWidth: 88, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {m.away}
        </span>
        {!isPending && (
          <span style={{
            fontFamily: 'Archivo', fontWeight: 800, fontSize: 13,
            color: awayWon ? accent : 'rgba(250,245,235,0.6)',
            marginLeft: 6, flexShrink: 0,
          }}>
            {m.awayScore}
          </span>
        )}
      </div>
    </div>
  )
}

export default function TournamentsTab() {
  const { setToast } = useAuth()
  const [selected, setSelected] = useState<Tournament | null>(null)
  const [joined, setJoined] = useState<Record<string, boolean>>({})
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newMaxTeams, setNewMaxTeams] = useState<8 | 16>(8)

  function handleJoin(t: Tournament) {
    setJoined(prev => ({ ...prev, [t.id]: true }))
    setToast(`¡Inscrito en ${t.name}!`)
    if ('vibrate' in navigator) navigator.vibrate(40)
  }

  function handleCreate() {
    if (!newName.trim()) return
    setToast(`Torneo "${newName}" creado`)
    setCreateOpen(false)
    setNewName('')
  }

  return (
    <div>
      {/* Create CTA */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setCreateOpen(true)}
          style={{
            width: '100%', padding: '13px 16px', borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(204,255,0,0.14), rgba(255,184,0,0.08))',
            border: '1px solid rgba(204,255,0,0.35)',
            color: '#FAF5EB', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 0 16px rgba(204,255,0,0.10)',
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(204,255,0,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#CCFF00', flexShrink: 0,
          }}>
            <Plus size={18} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 14, color: '#FAF5EB' }}>
              Crear torneo
            </div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(250,245,235,0.5)' }}>
              Organiza un bracket para tu liga
            </div>
          </div>
          <ChevronRight size={16} color="rgba(250,245,235,0.4)" style={{ marginLeft: 'auto' }} />
        </button>
      </div>

      {/* Tournament list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_TOURNAMENTS.map(t => {
          const st = STATUS_STYLE[t.status]
          const isJoined = joined[t.id]
          const isFull = t.teams >= t.maxTeams
          const isFinished = t.status === 'finished'

          return (
            <GlassCard key={t.id} accent={t.color} padding={14}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${t.color}20`,
                  border: `1.5px solid ${t.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: t.color,
                  boxShadow: `0 0 14px ${t.color}22`,
                }}>
                  <Trophy size={20} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Archivo', fontWeight: 800, fontSize: 15,
                    color: '#FAF5EB', letterSpacing: '-0.01em', marginBottom: 3,
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontFamily: 'Space Grotesk', fontSize: 11,
                    color: 'rgba(250,245,235,0.5)', marginBottom: 8,
                  }}>
                    Por {t.organizer}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    <div style={{
                      padding: '2px 8px', borderRadius: 999,
                      background: st.bg, border: `1px solid ${st.color}44`,
                      fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 9,
                      color: st.color, letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                      {st.label}
                    </div>
                    <div style={{
                      padding: '2px 8px', borderRadius: 999,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,220,180,0.08)',
                      fontFamily: 'Space Grotesk', fontSize: 9,
                      color: 'rgba(250,245,235,0.5)',
                      display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                      <Users size={8} /> {t.teams}/{t.maxTeams}
                    </div>
                    <div style={{
                      padding: '2px 8px', borderRadius: 999,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,220,180,0.08)',
                      fontFamily: 'Space Grotesk', fontSize: 9,
                      color: 'rgba(250,245,235,0.5)',
                      display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                      <Calendar size={8} /> {t.date}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prize */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 10px', marginTop: 10, borderRadius: 8,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,220,180,0.05)',
              }}>
                <Flame size={11} color="#FFB800" />
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(250,245,235,0.6)' }}>
                  {t.prize}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => setSelected(t)}
                  style={{
                    flex: 1, padding: '9px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,220,180,0.10)',
                    color: 'rgba(250,245,235,0.8)',
                    fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}
                >
                  Ver bracket
                </button>
                {!isFinished && (
                  <button
                    onClick={() => !isFull && !isJoined && handleJoin(t)}
                    disabled={isFull || isJoined}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 10,
                      background: isJoined
                        ? 'rgba(204,255,0,0.12)'
                        : isFull
                        ? 'rgba(255,255,255,0.04)'
                        : `${t.color}22`,
                      border: `1px solid ${isJoined ? 'rgba(204,255,0,0.4)' : isFull ? 'rgba(255,220,180,0.08)' : t.color + '44'}`,
                      color: isJoined ? '#CCFF00' : isFull ? 'rgba(250,245,235,0.3)' : t.color,
                      fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
                      cursor: isFull || isJoined ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}
                  >
                    {isJoined ? <><Check size={12} /> Inscrito</> : isFull ? <><Lock size={12} /> Lleno</> : 'Inscribirse'}
                  </button>
                )}
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Bracket detail sheet */}
      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        accent={selected?.color ?? '#CCFF00'}
        height="80%"
      >
        {selected && (
          <div>
            {selected.rounds.map((round, ri) => (
              <div key={ri} style={{ marginBottom: 20 }}>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 10,
                  color: 'rgba(250,245,235,0.45)', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {ri === selected.rounds.length - 1
                    ? <><Flame size={10} color={selected.color} /> Final</>
                    : ROUND_NAMES[ri]
                  }
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${round.length > 2 ? 2 : round.length}, 1fr)`,
                  gap: 8,
                }}>
                  {round.map(m => (
                    <MatchNode key={m.id} m={m} accent={selected.color} />
                  ))}
                </div>
              </div>
            ))}

            {selected.status === 'open' && !joined[selected.id] && (
              <button
                onClick={() => { handleJoin(selected); setSelected(null) }}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12,
                  background: `linear-gradient(135deg, ${selected.color}, #FFB800)`,
                  border: 'none', color: '#0F0D0A',
                  fontFamily: 'Archivo', fontWeight: 800, fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: `0 6px 20px ${selected.color}44`,
                  marginTop: 8,
                }}
              >
                <Plus size={15} /> Inscribir mi equipo
              </button>
            )}
          </div>
        )}
      </BottomSheet>

      {/* Create tournament sheet */}
      <BottomSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Nuevo torneo"
        accent="#CCFF00"
        height="55%"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
              color: 'rgba(250,245,235,0.5)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              Nombre del torneo
            </div>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Ej: Copa Verano 2026"
              style={{
                width: '100%', height: 46, padding: '0 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,220,180,0.12)',
                color: '#FAF5EB',
                fontFamily: 'Space Grotesk', fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
              color: 'rgba(250,245,235,0.5)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              Número de equipos
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {([8, 16] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setNewMaxTeams(n)}
                  style={{
                    flex: 1, padding: '11px', borderRadius: 10,
                    background: newMaxTeams === n ? 'rgba(204,255,0,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${newMaxTeams === n ? 'rgba(204,255,0,0.45)' : 'rgba(255,220,180,0.08)'}`,
                    color: newMaxTeams === n ? '#CCFF00' : 'rgba(250,245,235,0.6)',
                    fontFamily: 'Archivo', fontWeight: 800, fontSize: 16,
                    cursor: 'pointer',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            style={{
              width: '100%', padding: '13px', borderRadius: 12, marginTop: 4,
              background: newName.trim()
                ? 'linear-gradient(135deg, #CCFF00, #FFB800)'
                : 'rgba(255,255,255,0.06)',
              border: 'none',
              color: newName.trim() ? '#0F0D0A' : 'rgba(250,245,235,0.3)',
              fontFamily: 'Archivo', fontWeight: 800, fontSize: 13,
              cursor: newName.trim() ? 'pointer' : 'default',
              boxShadow: newName.trim() ? '0 6px 20px rgba(204,255,0,0.3)' : 'none',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            Crear torneo
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
