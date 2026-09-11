/**
 * LandingPage — marketing / onboarding para visitantes web.
 * Ruta pública `/landing`. GRADA brand — Krujens.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Users, Activity, Radio, Play, ChevronRight } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const FEATURES = [
  {
    icon: Brain,
    color: '#10B981',
    title: 'Match Intelligence',
    text: 'Análisis en tiempo real, predicciones y scouting con IA determinista.',
  },
  {
    icon: Activity,
    color: '#5DC3FF',
    title: 'Federation Layer',
    text: 'Liga Autonómica conectada — resultados, tabla y jornadas al instante.',
  },
  {
    icon: Users,
    color: '#34D399',
    title: 'Family Channel',
    text: 'Comparte momentos con la familia. Stories, fotos y convocatorias.',
  },
  {
    icon: Radio,
    color: '#5DC3FF',
    title: 'Pulse Feed',
    text: 'Highlight Reel automatizado. Tu equipo escribe historia. Ahora queda.',
  },
]

// Animated TPI counter
function TPICounter({ target }: { target: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let frame: number
    const start = performance.now()
    const dur = 1800
    function tick(now: number) {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(ease * target))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return <>{val}</>
}

export default function LandingPage() {
  const nav = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    setMounted(true)
    const onBip = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  async function tryInstall() {
    if (!installPrompt) { nav('/'); return }
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
  }

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: '#091A12',
        overflow: 'hidden', overflowY: 'auto',
      }}
      className="screen-scroll"
    >
      {/* Subtle gradient top */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(16,185,129,0.18), transparent 60%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Nav */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, #10B981, #5DC3FF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(16,185,129,0.5)',
            }}>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900, fontSize: 16, color: '#091A12' }}>G</span>
            </div>
            <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 17, color: '#F0F8F4', letterSpacing: '0.02em' }}>GRADA</span>
          </div>
          <button
            onClick={() => nav('/login')}
            style={{
              padding: '8px 16px', borderRadius: 999,
              background: 'transparent',
              border: '1px solid rgba(16,185,129,0.35)',
              color: '#10B981', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13,
            }}
          >
            Iniciar sesión
          </button>
        </div>

        {/* Hero */}
        <div style={{ padding: '40px 24px 48px', textAlign: 'center' }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-block',
              padding: '5px 12px', borderRadius: 999,
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.3)',
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 500,
              fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#34D399', marginBottom: 24,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'all 0.5s ease',
            }}
          >
            GRASSROOTS NETWORK · BY KRUJENS
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900,
              fontSize: 46, lineHeight: 1.05, letterSpacing: '-0.022em',
              color: '#F0F8F4', margin: '0 0 10px',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.6s ease 0.1s',
            }}
          >
            Tu equipo escribe historia<br />cada fin de semana.
          </h1>
          <h2
            style={{
              fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900,
              fontSize: 46, lineHeight: 1.05, letterSpacing: '-0.022em',
              margin: '0 0 24px',
              background: 'linear-gradient(135deg, #10B981, #5DC3FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.6s ease 0.2s',
            }}
          >
            Y nadie la guarda.
          </h2>

          {/* Tagline */}
          <p
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic',
              fontWeight: 500, fontSize: 20,
              color: 'rgba(240, 248, 244, 0.75)', marginBottom: 36,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease 0.35s',
            }}
          >
            "La grada nunca se calla."
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            maxWidth: 320, margin: '0 auto',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.6s ease 0.45s',
          }}>
            <button
              onClick={() => nav('/register')}
              style={{
                height: 54, width: '100%', borderRadius: 14,
                background: 'linear-gradient(135deg, #10B981, #5DC3FF)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15,
                color: '#091A12',
                boxShadow: '0 8px 24px rgba(16,185,129,0.35), 0 0 40px rgba(16,185,129,0.15)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Play size={16} fill="#091A12" /> Empieza gratis
            </button>
            <button
              onClick={tryInstall}
              style={{
                height: 54, width: '100%', borderRadius: 14,
                background: 'transparent',
                border: '1px solid rgba(16,185,129,0.35)',
                color: '#F0F8F4', cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              Ver demo
              <ChevronRight size={16} color="#10B981" />
            </button>
          </div>
        </div>

        {/* TPI Score showcase */}
        <div style={{ padding: '0 24px 40px' }}>
          <div style={{
            padding: 24, borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(93,195,255,0.06))',
            border: '1px solid rgba(16,185,129,0.2)',
            boxShadow: '0 0 32px rgba(16,185,129,0.1)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 500,
              fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#34D399', marginBottom: 12,
            }}>
              TPI SCORE · TERRACES PULSE INDEX
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
              fontSize: 72, lineHeight: 1, color: '#10B981',
              textShadow: '0 0 30px rgba(16,185,129,0.5)',
            }}>
              <TPICounter target={74} />
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 13,
              color: 'rgba(240,248,244,0.6)', marginTop: 8,
            }}>
              Tu equipo · Liga Autonómica Valenciana · J5
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 12, padding: '4px 12px', borderRadius: 999,
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.3)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: '#34D399', fontWeight: 700,
            }}>
              MAR 87% · Match Attendance Rate
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div style={{ padding: '0 24px 40px' }}>
          <div style={{
            fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700,
            fontSize: 22, color: '#F0F8F4', letterSpacing: '-0.018em',
            marginBottom: 16,
          }}>
            Todo lo que necesita tu club
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {FEATURES.map((f, i) => {
              const I = f.icon
              return (
                <div key={i} style={{
                  padding: 16, borderRadius: 16,
                  background: `linear-gradient(135deg, ${f.color}10, rgba(9,26,18,0.6))`,
                  border: `1px solid ${f.color}30`,
                  boxShadow: `0 0 16px ${f.color}10`,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${f.color}20`, color: f.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <I size={18} />
                  </div>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                    fontSize: 13, color: '#F0F8F4', marginBottom: 6,
                  }}>
                    {f.title}
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 11,
                    color: 'rgba(240,248,244,0.6)', lineHeight: 1.45,
                  }}>
                    {f.text}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 60px', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic',
            fontSize: 13, color: 'rgba(240,248,244,0.4)', marginBottom: 8,
          }}>
            GRADA (del castellano <em>grada</em>, "donde el partido se vive")
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.1em', color: 'rgba(240,248,244,0.3)',
            textTransform: 'uppercase',
          }}>
            Powered by Krujens · © 2026
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}
