import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import EpicStadiumBackground from '../components/ui/EpicStadiumBackground'
import FloatingOrbs from '../components/ui/FloatingOrbs'
import NeonButton from '../components/ui/NeonButton'
import NeonInput from '../components/ui/NeonInput'

const POSITIONS = [
  { id: 'Portero',        emoji: '🧤', desc: 'Bajo los palos' },
  { id: 'Defensa',        emoji: '🛡️', desc: 'La última línea' },
  { id: 'Centrocampista', emoji: '⚙️', desc: 'Motor del equipo' },
  { id: 'Extremo',        emoji: '⚡', desc: 'Bandas y velocidad' },
  { id: 'Delantero',      emoji: '⚽', desc: 'El gol es el destino' },
]

const LEVELS = [
  { id: 'Amateur',     emoji: '🌱', desc: 'Empezando a jugar' },
  { id: 'Aficionado',  emoji: '⚽', desc: 'Ligas del barrio' },
  { id: 'Semi-pro',    emoji: '🏆', desc: 'Ligas regionales' },
  { id: 'Competitivo', emoji: '🔥', desc: 'Torneos oficiales' },
]

const STEPS = [
  { title: '¿Qué posición juegas?',     sub: 'Te ayudamos a mejorar en tu rol específico.' },
  { title: '¿Cómo se llama tu equipo?', sub: 'Puedes cambiarlo más tarde en tu perfil.' },
  { title: '¿Cuál es tu nivel?',        sub: 'Para mostrarte contenido relevante.' },
]

export default function SetupPage() {
  const nav = useNavigate()
  const { updateUser } = useAuth()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [position, setPosition] = useState('')
  const [team, setTeam] = useState('')
  const [level, setLevel] = useState('')

  const canAdvance = [!!position, true, !!level][step]

  function advance() {
    if (step < 2) {
      setDir(1)
      setStep(s => s + 1)
    } else {
      updateUser({ position, team: team.trim() || 'Sin equipo', level, setupDone: true })
      nav('/home', { replace: true })
    }
  }

  function back() {
    setDir(-1)
    setStep(s => s - 1)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep, #0F0D0A)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <EpicStadiumBackground interval={7000} initial={2} />
      </div>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(180deg, rgba(15,13,10,0.72) 0%, rgba(15,13,10,0.88) 50%, rgba(15,13,10,0.97) 100%)',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <FloatingOrbs orbs={[
          { x: 15, y: 20, size: 220, color: '#CCFF00', opacity: 0.13, dur: 18 },
          { x: 82, y: 55, size: 170, color: '#B347FF', opacity: 0.11, dur: 22 },
        ]} />
      </div>

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '52px 24px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: '#CCFF00',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" fill="none" stroke="#0F0D0A" strokeWidth="1.8" />
              <path d="M12 4l2.5 3.5L12 10l-2.5-2.5zM4 12l3.5 2.5L10 12l-2.5-2.5zM20 12l-3.5 2.5L14 12l2.5-2.5zM12 20l-2.5-3.5L12 14l2.5 2.5z" fill="#0F0D0A" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 16, color: '#FAF5EB' }}>
            GRADA
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              height: 3, borderRadius: 2,
              flex: i === step ? 2 : 1,
              background: i <= step ? '#CCFF00' : 'rgba(250, 245, 235, 0.12)',
              transition: 'all 0.45s cubic-bezier(.2,.8,.2,1)',
              boxShadow: i === step ? '0 0 8px rgba(204, 255, 0, 0.5)' : 'none',
            }} />
          ))}
        </div>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600,
          color: 'rgba(250, 245, 235, 0.35)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Paso {step + 1} de 3
        </div>
      </div>

      {/* Step content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 24px 148px',
      }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -48 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontFamily: 'Archivo, sans-serif', fontWeight: 800,
                fontSize: 30, color: '#FAF5EB', letterSpacing: '-0.02em',
                lineHeight: 1.1, marginBottom: 8,
              }}>
                {STEPS[step].title}
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 14, color: 'rgba(250, 245, 235, 0.5)',
              }}>
                {STEPS[step].sub}
              </div>
            </div>

            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {POSITIONS.map(p => (
                  <button key={p.id} onClick={() => setPosition(p.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 16px', borderRadius: 14, textAlign: 'left',
                    background: position === p.id ? 'rgba(204, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1.5px solid ${position === p.id ? 'rgba(204, 255, 0, 0.45)' : 'rgba(255, 220, 180, 0.08)'}`,
                    cursor: 'pointer', transition: 'all 0.18s',
                    boxShadow: position === p.id ? '0 0 14px rgba(204, 255, 0, 0.12)' : 'none',
                  }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{p.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
                        color: position === p.id ? '#CCFF00' : '#FAF5EB',
                      }}>{p.id}</div>
                      <div style={{
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: 12,
                        color: 'rgba(250, 245, 235, 0.4)',
                      }}>{p.desc}</div>
                    </div>
                    {position === p.id && (
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', background: '#CCFF00',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#0F0D0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div>
                <NeonInput
                  placeholder="Ej: Los Pumas FC, Rayo Urbano…"
                  value={team}
                  onChange={setTeam}
                />
                <div style={{
                  marginTop: 10,
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 12,
                  color: 'rgba(250, 245, 235, 0.3)',
                }}>
                  Si aún no tienes equipo, déjalo en blanco.
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {LEVELS.map(l => (
                  <button key={l.id} onClick={() => setLevel(l.id)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 6, padding: '18px 10px', borderRadius: 14,
                    background: level === l.id ? 'rgba(204, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1.5px solid ${level === l.id ? 'rgba(204, 255, 0, 0.45)' : 'rgba(255, 220, 180, 0.08)'}`,
                    cursor: 'pointer', transition: 'all 0.18s',
                    boxShadow: level === l.id ? '0 0 14px rgba(204, 255, 0, 0.12)' : 'none',
                  }}>
                    <span style={{ fontSize: 26 }}>{l.emoji}</span>
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
                      color: level === l.id ? '#CCFF00' : '#FAF5EB', textAlign: 'center',
                    }}>{l.id}</div>
                    <div style={{
                      fontFamily: 'Space Grotesk, sans-serif', fontSize: 11,
                      color: 'rgba(250, 245, 235, 0.38)', textAlign: 'center',
                    }}>{l.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: '16px 24px calc(28px + env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <NeonButton variant="gradient" onClick={advance} disabled={!canAdvance}>
          {step === 2 ? '¡Empezar en GRADA!' : 'Continuar →'}
        </NeonButton>
        {step > 0 && (
          <button onClick={back} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
            color: 'rgba(250, 245, 235, 0.38)', padding: '10px',
            marginTop: 2,
          }}>
            ← Volver
          </button>
        )}
      </div>
    </div>
  )
}
