import { useState, useEffect, useMemo } from 'react'
import { Check, Minus, Plus, Users, Trash2, Trophy, Sparkles, X } from 'lucide-react'
import BottomSheet from './BottomSheet'
import { useAuth } from '../../context/AuthContext'
import { usePredictions, type PredictionMatch } from '../../context/PredictionsContext'
import { suggestScore, generateMatchPreview, type CopilotSuggestion, type CopilotMood } from '../../lib/aiMocks'

interface Props {
  match: PredictionMatch | null
  onClose: () => void
}

function badgeOf(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function MatchPredictionSheet({ match, onClose }: Props) {
  const { user, setToast } = useAuth()
  const { submit, withdraw, getUserPrediction } = usePredictions()

  const userName = user?.name ?? 'Tú'
  const userBadge = badgeOf(userName)

  const [home, setHome] = useState(1)
  const [away, setAway] = useState(1)
  const [joined, setJoined] = useState(false)
  const [copilot, setCopilot] = useState<CopilotSuggestion | null>(null)
  const [thinking, setThinking] = useState(false)
  const [mood, setMood] = useState<CopilotMood>('balanced')
  const [previewOpen, setPreviewOpen] = useState(false)

  const preview = useMemo(() => {
    if (!match) return null
    return generateMatchPreview({
      home: match.home, away: match.away,
      date: match.date, venue: match.venue,
    })
  }, [match])

  // Reset/sync when a new match is opened
  useEffect(() => {
    if (!match) return
    const existing = getUserPrediction(match.id, userName)
    if (existing) {
      setHome(existing.home)
      setAway(existing.away)
      setJoined(true)
    } else {
      setHome(1)
      setAway(1)
      setJoined(false)
    }
    setCopilot(null)
    setThinking(false)
  }, [match, userName, getUserPrediction])

  if (!match) return null

  const bump = (side: 'h' | 'a', delta: number) => {
    if (side === 'h') setHome(v => Math.max(0, Math.min(20, v + delta)))
    else setAway(v => Math.max(0, Math.min(20, v + delta)))
  }

  const toggleJoin = () => {
    if (joined) {
      withdraw(match.id, userName)
      setJoined(false)
      setToast('Predicción retirada')
      if ('vibrate' in navigator) navigator.vibrate(15)
    } else {
      submit(match.id, {
        userName,
        badge: userBadge,
        color: '#CCFF00',
        home,
        away,
      })
      setJoined(true)
      setToast(`Participas: ${home}-${away}`)
      if ('vibrate' in navigator) navigator.vibrate(40)
    }
  }

  const askCopilot = (withMood?: CopilotMood) => {
    if (!match) return
    const m = withMood ?? mood
    setThinking(true)
    if ('vibrate' in navigator) navigator.vibrate(10)
    // Simulamos latencia de un LLM para que el botón "se sienta" AI.
    setTimeout(() => {
      const s = suggestScore(match.home, match.away, m)
      setCopilot(s)
      setThinking(false)
    }, 650)
  }

  const changeMood = (m: CopilotMood) => {
    setMood(m)
    if (copilot) askCopilot(m)
  }

  const applyCopilot = () => {
    if (!copilot) return
    setHome(copilot.home)
    setAway(copilot.away)
    if ('vibrate' in navigator) navigator.vibrate(25)
    setToast(`Marcador sugerido: ${copilot.home}-${copilot.away}`)
  }

  const dismissCopilot = () => setCopilot(null)

  const saveUpdate = () => {
    submit(match.id, { userName, badge: userBadge, color: '#CCFF00', home, away })
    setToast(`Predicción actualizada: ${home}-${away}`)
    if ('vibrate' in navigator) navigator.vibrate(25)
  }

  // Pull fresh participants list each render
  const { predictions } = usePredictions()
  const list = predictions[match.id] ?? []

  return (
    <BottomSheet
      open={!!match}
      onClose={onClose}
      title="Predicción del partido"
      accent="#CCFF00"
      height="88%"
    >
      {/* Match hero */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 16, padding: '6px 0 18px',
          borderBottom: '1px solid rgba(255, 220, 180, 0.06)',
        }}
      >
        <TeamSide name={match.home} color={match.homeColor} badge={match.homeBadge} />
        <div
          style={{
            fontFamily: 'Archivo', fontWeight: 800, fontSize: 20,
            color: '#FF5B3A', letterSpacing: '-0.02em',
          }}
        >
          VS
        </div>
        <TeamSide name={match.away} color={match.awayColor} badge={match.awayBadge} />
      </div>

      <div
        style={{
          marginTop: 10, padding: '10px 14px', borderRadius: 10,
          background: 'rgba(255, 184, 0, 0.08)',
          border: '1px solid rgba(255, 184, 0, 0.2)',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(250, 245, 235, 0.85)',
        }}
      >
        <span style={{ fontWeight: 700, color: '#FFB800' }}>{match.date}</span>
        <span>{match.venue}</span>
      </div>

      {/* AI Preview (Tier 2) */}
      {preview && (
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => {
              setPreviewOpen(v => !v)
              if ('vibrate' in navigator) navigator.vibrate(8)
            }}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 12,
              background: previewOpen
                ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.14), rgba(179, 71, 255, 0.08))'
                : 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.35)',
              color: '#FAF5EB',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <Sparkles size={13} color="#00D4FF" />
            <span style={{ flex: 1 }}>
              {previewOpen ? 'Ocultar preview' : 'Ver preview AI del partido'}
            </span>
            <span style={{
              fontSize: 10, color: '#00D4FF',
              fontFamily: 'Space Grotesk', letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              {previewOpen ? '−' : '+'}
            </span>
          </button>

          {previewOpen && (
            <div
              style={{
                marginTop: 8, padding: 14, borderRadius: 14,
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.22)',
                animation: 'slide-up-fade 240ms ease-out',
              }}
            >
              <div style={{
                fontFamily: 'Space Grotesk', fontSize: 13, lineHeight: 1.5,
                color: 'rgba(250, 245, 235, 0.9)', marginBottom: 12,
                fontStyle: 'italic',
              }}>
                {preview.hypeLine}
              </div>

              <PreviewRow color="#CCFF00" label={match.home} text={preview.homeStrength} />
              <PreviewRow color="#FF5B3A" label={match.away} text={preview.awayStrength} />
              <PreviewRow color="#00D4FF" label="Matchup clave" text={preview.keyMatchup} />
              <PreviewRow color="#FFB800" label="X-factor" text={preview.xFactor} last />
            </div>
          )}
        </div>
      )}

      {/* Prediction inputs */}
      <div
        style={{
          marginTop: 18,
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
          color: 'rgba(250, 245, 235, 0.5)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          textAlign: 'center', marginBottom: 14,
        }}
      >
        Tu predicción
      </div>
      <div
        style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', gap: 12, padding: '0 4px',
        }}
      >
        <ScorePicker
          label={match.homeBadge}
          color={match.homeColor}
          value={home}
          onDec={() => bump('h', -1)}
          onInc={() => bump('h', +1)}
        />
        <div
          style={{
            fontFamily: 'Archivo', fontWeight: 800, fontSize: 22,
            color: 'rgba(250, 245, 235, 0.4)',
          }}
        >
          :
        </div>
        <ScorePicker
          label={match.awayBadge}
          color={match.awayColor}
          value={away}
          onDec={() => bump('a', -1)}
          onInc={() => bump('a', +1)}
        />
      </div>

      {/* Copilot — AI score suggestion */}
      <div style={{ marginTop: 14 }}>
        {!copilot && (
          <button
            onClick={() => askCopilot()}
            disabled={thinking}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 12,
              background: 'rgba(179, 71, 255, 0.10)',
              border: '1px solid rgba(179, 71, 255, 0.35)',
              color: '#FAF5EB',
              fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: thinking ? 'default' : 'pointer',
              opacity: thinking ? 0.7 : 1,
              transition: 'all 200ms',
            }}
          >
            <Sparkles size={14} color="#B347FF" />
            {thinking ? 'Analizando stats…' : 'Sugerir marcador con AI'}
          </button>
        )}

        {copilot && (
          <div
            style={{
              padding: '12px 14px', borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(179, 71, 255, 0.12), rgba(204, 255, 0, 0.06))',
              border: '1px solid rgba(179, 71, 255, 0.4)',
              animation: 'slide-up-fade 260ms ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sparkles size={13} color="#B347FF" />
              <div style={{
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
                color: '#B347FF', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Copiloto · {copilot.confidence}
              </div>
              {/* Mood switcher */}
              <div style={{ display: 'flex', gap: 4, marginLeft: 6 }}>
                {([
                  { k: 'balanced'  as CopilotMood, label: '⚖' },
                  { k: 'optimistic' as CopilotMood, label: '🔥' },
                  { k: 'analytic'  as CopilotMood, label: '📊' },
                ]).map(m => (
                  <button
                    key={m.k}
                    onClick={() => changeMood(m.k)}
                    disabled={thinking}
                    aria-label={m.k}
                    style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: mood === m.k ? 'rgba(179, 71, 255, 0.25)' : 'transparent',
                      border: mood === m.k ? '1px solid rgba(179, 71, 255, 0.5)' : '1px solid rgba(255, 220, 180, 0.1)',
                      fontSize: 10, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <button
                onClick={dismissCopilot}
                aria-label="Cerrar sugerencia"
                style={{
                  marginLeft: 'auto', width: 22, height: 22, borderRadius: 6,
                  background: 'transparent', border: 'none',
                  color: 'rgba(250,245,235,0.5)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  fontFamily: 'Archivo', fontStyle: 'italic', fontWeight: 900,
                  fontSize: 28, color: '#FAF5EB', lineHeight: 1,
                  textShadow: '0 0 14px rgba(179, 71, 255, 0.5)',
                  flexShrink: 0, minWidth: 72, textAlign: 'center',
                }}
              >
                {copilot.home}–{copilot.away}
              </div>
              <div
                style={{
                  flex: 1,
                  fontFamily: 'Space Grotesk', fontSize: 12, lineHeight: 1.45,
                  color: 'rgba(250, 245, 235, 0.78)',
                }}
              >
                {copilot.reason}
              </div>
            </div>
            <button
              onClick={applyCopilot}
              style={{
                marginTop: 10, width: '100%', padding: '9px 12px', borderRadius: 10,
                background: 'rgba(204, 255, 0, 0.15)',
                border: '1px solid rgba(204, 255, 0, 0.4)',
                color: '#CCFF00',
                fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 11,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Check size={12} /> Usar este marcador
            </button>
          </div>
        )}
      </div>

      {/* Join / update / withdraw actions */}
      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        <button
          onClick={toggleJoin}
          style={{
            flex: 1, padding: '14px 16px', borderRadius: 14,
            background: joined
              ? 'rgba(255, 91, 58, 0.14)'
              : 'linear-gradient(135deg, #CCFF00, #FFB800)',
            color: joined ? '#FF5B3A' : '#0F0D0A',
            border: joined ? '1px solid rgba(255, 91, 58, 0.4)' : 'none',
            fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 13,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: joined ? 'none' : '0 8px 24px rgba(204, 255, 0, 0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 200ms',
          }}
        >
          {joined ? (<><Trash2 size={14} /> Retirar predicción</>) : (<><Check size={14} /> Participar</>)}
        </button>
        {joined && (
          <button
            onClick={saveUpdate}
            style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'rgba(204, 255, 0, 0.15)',
              color: '#CCFF00',
              border: '1px solid rgba(204, 255, 0, 0.35)',
              fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 12,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            Guardar cambio
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: 8,
          fontFamily: 'Space Grotesk', fontSize: 11,
          color: 'rgba(250, 245, 235, 0.45)', textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        Participar es opcional — solo si te animás a adivinar.
      </div>

      {/* Participants */}
      <div
        style={{
          marginTop: 22, display: 'flex', alignItems: 'center', gap: 8,
          paddingTop: 14,
          borderTop: '1px solid rgba(255, 220, 180, 0.06)',
        }}
      >
        <Users size={14} color="#CCFF00" />
        <div
          style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
            color: 'rgba(250, 245, 235, 0.75)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
        >
          {list.length} participando
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {list.length === 0 && (
          <div
            style={{
              padding: '28px 12px', textAlign: 'center',
              fontFamily: 'Space Grotesk', fontSize: 13,
              color: 'rgba(250, 245, 235, 0.4)',
            }}
          >
            Nadie ha pronosticado aún · sé el primero
          </div>
        )}
        {list.map((p, i) => {
          const mine = p.userName === userName
          return (
            <div
              key={`${p.userName}-${i}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                background: mine ? 'rgba(204, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: mine ? '1px solid rgba(204, 255, 0, 0.35)' : '1px solid rgba(255, 220, 180, 0.05)',
              }}
            >
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `${p.color}22`, color: p.color,
                  border: `1.5px solid ${p.color}66`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Archivo', fontWeight: 800, fontSize: 11,
                  flexShrink: 0,
                }}
              >
                {p.badge}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13,
                    color: '#FAF5EB', display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {mine ? `${p.userName} (tú)` : p.userName}
                  {i === 0 && !mine && <Trophy size={11} color="#FFB800" />}
                </div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, color: 'rgba(250,245,235,0.4)' }}>
                  {timeAgo(p.at)}
                </div>
              </div>
              <div
                style={{
                  padding: '5px 12px', borderRadius: 8,
                  background: mine ? 'rgba(204, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  fontFamily: 'Archivo', fontWeight: 800, fontSize: 14,
                  color: mine ? '#CCFF00' : '#FAF5EB',
                  letterSpacing: '0.04em',
                }}
              >
                {p.home} – {p.away}
              </div>
            </div>
          )
        })}
      </div>
    </BottomSheet>
  )
}

function TeamSide({ name, color, badge }: { name: string; color: string; badge: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
      <div
        style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 8px',
          background: `${color}22`, color,
          border: `2px solid ${color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Archivo', fontWeight: 800, fontSize: 18,
        }}
      >
        {badge}
      </div>
      <div
        style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
          color: '#FAF5EB', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>
    </div>
  )
}

function ScorePicker({
  label, color, value, onDec, onInc,
}: {
  label: string; color: string; value: number; onDec: () => void; onInc: () => void
}) {
  return (
    <div
      style={{
        padding: 12, borderRadius: 14,
        background: 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${color}44`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 10,
          color, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'Archivo', fontStyle: 'italic', fontWeight: 900,
          fontSize: 54, color: '#FAF5EB', lineHeight: 1,
          textShadow: `0 0 20px ${color}66`,
          transition: 'transform 140ms',
        }}
      >
        {value}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <StepperButton onClick={onDec}><Minus size={14} /></StepperButton>
        <StepperButton onClick={onInc}><Plus size={14} /></StepperButton>
      </div>
    </div>
  )
}

function StepperButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32, height: 32, borderRadius: 10,
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 220, 180, 0.12)',
        color: '#FAF5EB', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {children}
    </button>
  )
}

function PreviewRow({
  color, label, text, last,
}: { color: string; label: string; text: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex', gap: 10,
        padding: '8px 0',
        borderBottom: last ? 'none' : '1px solid rgba(255, 220, 180, 0.06)',
      }}
    >
      <div style={{
        minWidth: 90, fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 700,
        color, textTransform: 'uppercase', letterSpacing: '0.08em',
        paddingTop: 2,
      }}>
        {label}
      </div>
      <div style={{
        flex: 1, fontFamily: 'Space Grotesk', fontSize: 12, lineHeight: 1.4,
        color: 'rgba(250, 245, 235, 0.8)',
      }}>
        {text}
      </div>
    </div>
  )
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const m = Math.round(diff / 60_000)
  if (m < 1) return 'ahora'
  if (m < 60) return `hace ${m} m`
  const h = Math.round(m / 60)
  if (h < 24) return `hace ${h} h`
  return `hace ${Math.round(h / 24)} d`
}
