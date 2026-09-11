import { useState, useMemo, useEffect, useRef, type ChangeEvent } from 'react'
import { Flame, Trophy, Zap, Heart, MessageCircle, Share2, Copy, Link as LinkIcon, Send, Bell, Sparkles, RefreshCw, Newspaper, Film, Play, Scissors, ImagePlus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useMuro, tiempoRelativo, type MuroPost, type MuroComentario } from '../hooks/useMuro'
import Avatar from '../components/ui/Avatar'
import BottomNav from '../components/ui/BottomNav'
import GlassCard from '../components/ui/GlassCard'
import FloatingOrbs from '../components/ui/FloatingOrbs'
import BottomSheet from '../components/ui/BottomSheet'
import LikeBurst from '../components/ui/LikeBurst'
import { Skeleton, SkeletonCircle } from '../components/ui/Skeleton'
import NotificationsPanel from '../components/ui/NotificationsPanel'
import { useNotifications } from '../context/NotificationsContext'
import { generateMatchRecap, suggestMediaTags, generateWeeklyDigest, suggestVideoClips, clipEmoji, formatClipTime, type MatchFact, type MatchRecap, type Tone, type Lang, type VideoClip } from '../lib/aiMocks'
import LiveTicker from '../components/ui/LiveTicker'
import AIBorder from '../components/ui/AIBorder'
import LineupSheet from '../components/ui/LineupSheet'
import RivalScoutSheet from '../components/ui/RivalScoutSheet'
import RippleButton from '../components/ui/RippleButton'
import LiveMatchSheet from '../components/ui/LiveMatchSheet'
import StoriesStrip from '../features/stories/StoriesStrip'
import TacticsBoardSheet from '../features/tactics/TacticsBoardSheet'
import EventsSheet from '../features/events/EventsSheet'
import PollCard from '../features/polls/PollCard'
import { Calendar as CalendarIcon } from 'lucide-react'

// Hechos reales del partido — en producción vendrían del backend.
const RECAP_FACTS: MatchFact = {
  home: 'Valencia BC',
  away: 'Mestalla CF',
  homeScore: 3,
  awayScore: 1,
  topScorer: { name: 'Carlos Martínez', goals: 2, team: 'home' },
  keyMoment: { minute: 62, description: 'Mestalla CF falló un penal clave' },
  attendance: 240,
}

const ACCENTS = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--accent-warm)']
function colorAutor(uid: string): string {
  let h = 0
  for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) >>> 0
  return ACCENTS[h % ACCENTS.length]
}

export default function HomePage() {
  const { user, setToast } = useAuth()
  const { posts, loading, error, hayMas, cargandoMas, cargarMas, crear, alternarLike, cargarComentarios, agregarComentario } = useMuro()
  const [burstId, setBurstId] = useState<string | null>(null)

  const { unread } = useNotifications()
  const [notifOpen, setNotifOpen] = useState(false)

  const [commentsOpen, setCommentsOpen] = useState<MuroPost | null>(null)
  const [comentarios, setComentarios] = useState<MuroComentario[]>([])
  const [comentariosLoading, setComentariosLoading] = useState(false)
  const [shareOpen, setShareOpen] = useState<MuroPost | null>(null)
  const [newComment, setNewComment] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Compositor de publicación
  const [composeOpen, setComposeOpen] = useState(false)
  const [draftText, setDraftText] = useState('')
  const [draftImage, setDraftImage] = useState<File | null>(null)
  const [draftPreview, setDraftPreview] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const composeImgRef = useRef<HTMLInputElement>(null)

  // Revoca el object URL del preview al desmontar o al cambiar de imagen
  useEffect(() => () => {
    if (draftPreview) URL.revokeObjectURL(draftPreview)
  }, [draftPreview])

  // Tags de IA precomputados por post (evita recalcular en cada render)
  const tagsByPost = useMemo(() => {
    const m = new Map<string, ReturnType<typeof suggestMediaTags>>()
    for (const p of posts) if (p.texto) m.set(p.id, suggestMediaTags({ caption: p.texto, team: p.autorNombre }))
    return m
  }, [posts])

  // AI Recap (feature 3 del tier 1)
  const [recapTone, setRecapTone] = useState<Tone>('casual')
  const [recapLang, setRecapLang] = useState<Lang>('es')
  const [recap, setRecap] = useState<MatchRecap>(() =>
    generateMatchRecap(RECAP_FACTS, { tone: 'casual', lang: 'es' })
  )
  const [recapOpen, setRecapOpen] = useState(false)
  const [recapRegen, setRecapRegen] = useState(false)
  const [clips, setClips] = useState<VideoClip[] | null>(null)
  const [clipsLoading, setClipsLoading] = useState(false)

  function generateClips() {
    if (clipsLoading) return
    setClipsLoading(true)
    if ('vibrate' in navigator) navigator.vibrate(12)
    setTimeout(() => {
      setClips(suggestVideoClips({
        duration: 5400,
        title: `${RECAP_FACTS.home} vs ${RECAP_FACTS.away}`,
        homeScore: RECAP_FACTS.homeScore,
        awayScore: RECAP_FACTS.awayScore,
        topScorer: RECAP_FACTS.topScorer?.name,
      }))
      setClipsLoading(false)
      setToast('Clips generados')
    }, 900)
  }

  function regenerateRecap(overrideTone?: Tone, overrideLang?: Lang) {
    const t = overrideTone ?? recapTone
    const l = overrideLang ?? recapLang
    setRecapRegen(true)
    if ('vibrate' in navigator) navigator.vibrate(10)
    setTimeout(() => {
      // Rotamos el minuto del momento clave para introducir variación
      const rotated: MatchFact = {
        ...RECAP_FACTS,
        keyMoment: {
          ...RECAP_FACTS.keyMoment!,
          minute: Math.floor(20 + Math.random() * 70),
        },
      }
      setRecap(generateMatchRecap(rotated, { tone: t, lang: l }))
      setRecapRegen(false)
      setToast(l === 'en' ? 'Recap regenerated' : 'Recap regenerado')
    }, 700)
  }

  function changeRecapTone(t: Tone) {
    setRecapTone(t)
    setRecap(generateMatchRecap(RECAP_FACTS, { tone: t, lang: recapLang }))
    if ('vibrate' in navigator) navigator.vibrate(8)
  }

  // Weekly Digest (Tier 3)
  const [digestOpen, setDigestOpen] = useState(false)

  // Tier 5 — auto-alineación + rival scouting
  const [lineupOpen, setLineupOpen] = useState(false)
  const [scoutOpen, setScoutOpen] = useState(false)
  const [liveOpen, setLiveOpen] = useState(false)
  const [tacticsOpen, setTacticsOpen] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)
  const NEXT_OPPONENT = 'Mestalla CF'
  const digest = useMemo(() => generateWeeklyDigest({
    userName: user?.name ?? 'Carlos Martínez',
    matchesPlayed: 3,
    goals: 4,
    assists: 2,
    wins: 2, losses: 1, draws: 0,
    topPostLikes: 47,
    nextMatch: { opponent: 'Mestalla CF', when: 'Sáb 7 Sep 11:00 · Campo El Saler' },
  }), [user?.name])

  function changeRecapLang(l: Lang) {
    setRecapLang(l)
    setRecap(generateMatchRecap(RECAP_FACTS, { tone: recapTone, lang: l }))
    if ('vibrate' in navigator) navigator.vibrate(8)
  }

  async function handleLike(p: MuroPost) {
    if (!p.liked) {
      setBurstId(p.id)
      setTimeout(() => setBurstId(null), 700)
      try { navigator.vibrate?.(30) } catch { /* ignore */ }
    }
    try {
      await alternarLike(p)
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'No se pudo dar like')
    }
  }

  async function openComments(p: MuroPost) {
    setCommentsOpen(p)
    setComentarios([])
    setComentariosLoading(true)
    try {
      setComentarios(await cargarComentarios(p.id))
    } catch {
      /* ignore */
    } finally {
      setComentariosLoading(false)
    }
  }

  async function sendComment() {
    const texto = newComment.trim()
    if (!texto || !commentsOpen || enviando) return
    setEnviando(true)
    try {
      await agregarComentario(commentsOpen.id, texto)
      setNewComment('')
      setComentarios(await cargarComentarios(commentsOpen.id))
      setToast('Comentario enviado')
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'No se pudo comentar')
    } finally {
      setEnviando(false)
    }
  }

  function pickComposeImage(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (draftPreview) URL.revokeObjectURL(draftPreview)
    setDraftImage(f)
    setDraftPreview(URL.createObjectURL(f))
  }

  function quitarDraftImage() {
    if (draftPreview) URL.revokeObjectURL(draftPreview)
    setDraftImage(null)
    setDraftPreview(null)
  }

  function closeCompose() {
    setComposeOpen(false)
    setDraftText('')
    quitarDraftImage()
  }

  async function publishPost() {
    const texto = draftText.trim()
    if ((!texto && !draftImage) || publishing) return
    setPublishing(true)
    try {
      await crear({ texto, imagen: draftImage })
      closeCompose()
      setToast('Publicado')
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'No se pudo publicar')
    } finally {
      setPublishing(false)
    }
  }

  function copyLink() {
    if (!shareOpen) return
    navigator.clipboard?.writeText(`grada.app/post/${shareOpen.id}`).catch(() => {})
    setToast('Enlace copiado al portapapeles')
    setShareOpen(null)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <FloatingOrbs
          orbs={[
            { x: 85, y: 6,  size: 260, color: 'var(--accent-primary)', opacity: 0.08, dur: 16 },
            { x: 8,  y: 58, size: 300, color: 'var(--accent-secondary)', opacity: 0.06, dur: 20 },
            { x: 55, y: 92, size: 380, color: 'var(--accent-warm)', opacity: 0.07, dur: 26 },
            { x: 90, y: 75, size: 220, color: '#0B4B3E', opacity: 0.07, dur: 22 },
          ]}
        />
      </div>

      <div
        className="screen-scroll"
        style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', paddingBottom: 90 }}
      >
        {/* Header */}
        <div style={{ padding: '60px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>
              Hola, {user?.name.split(' ')[0] ?? 'jugador'} ⚽
            </div>
            <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 28, color: 'var(--text-primary)', letterSpacing: '-0.018em' }}>
              Tu feed
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setDigestOpen(true)}
            aria-label="Digest semanal"
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'rgba(93, 195, 255, 0.15)',
              border: '1px solid rgba(93, 195, 255, 0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-secondary)', cursor: 'pointer',
            }}
          >
            <Newspaper size={18} />
          </button>
          <button
            onClick={() => setNotifOpen(true)}
            style={{
              position: 'relative',
              width: 42, height: 42, borderRadius: 12,
              background: 'var(--border-warm)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-primary)', cursor: 'pointer',
            }}
          >
            <Bell size={20} />
            {unread > 0 && (
              <div
                style={{
                  position: 'absolute', top: -4, right: -4,
                  minWidth: 20, height: 20, padding: '0 5px', borderRadius: 999,
                  background: 'var(--accent-warm)', color: '#091A12',
                  fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(52, 211, 153, 0.65)',
                  border: '2px solid var(--bg-deep)',
                }}
              >
                {unread}
              </div>
            )}
          </button>
          </div>
        </div>

        {/* Live ticker */}
        <div style={{ marginBottom: 10 }}>
          <LiveTicker />
        </div>

        {/* Stories */}
        <div style={{ marginBottom: 14 }}>
          <StoriesStrip />
        </div>

        {/* Encuesta de la comunidad */}
        <div style={{ padding: '0 20px 14px' }}>
          <PollCard
            id="mvp-jornada-42"
            question="¿Quién fue el MVP de la jornada?"
            options={[
              { id: 'o1', label: 'Carlos Méndez',  votes: 48, color: 'var(--accent-primary)' },
              { id: 'o2', label: 'Leo Vargas',     votes: 31, color: 'var(--accent-secondary)' },
              { id: 'o3', label: 'Diego Pérez',    votes: 22, color: 'var(--accent-secondary)' },
              { id: 'o4', label: 'Martín Ríos',    votes: 14, color: 'var(--accent-secondary)' },
            ]}
            totalVoters={140}
          />
        </div>

        {/* Eventos CTA */}
        <div style={{ padding: '0 20px 14px' }}>
          <button
            onClick={() => setEventsOpen(true)}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.16), rgba(179,71,255,0.08))',
              border: '1px solid rgba(0,212,255,0.45)',
              color: 'var(--text-primary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 0 18px rgba(0,212,255,0.14)',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(0,212,255,0.18)', color: 'var(--accent-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CalendarIcon size={18} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 14 }}>
                Eventos cerca tuyo
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-dim)' }}>
                4 partidos abiertos · RSVP en 1 tap
              </div>
            </div>
            <span style={{ color: 'var(--accent-secondary)', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12 }}>Ver →</span>
          </button>
        </div>

        {/* CTAs Tier 5: alineación + scouting */}
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 10 }}>
          <button
            onClick={() => setLineupOpen(true)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(204,255,0,0.15), rgba(255,184,0,0.10))',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
              textAlign: 'left',
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(204,255,0,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-primary)',
              fontFamily: 'Archivo', fontWeight: 900, fontSize: 10,
              flexShrink: 0, letterSpacing: '0.04em',
            }}>
              11
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Space Grotesk', fontSize: 9,
                color: 'var(--text-dim)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Alineación AI
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                Ver formación
              </div>
            </div>
          </button>

          <button
            onClick={() => setScoutOpen(true)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(255,91,58,0.12), rgba(179,71,255,0.10))',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
              textAlign: 'left',
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(255,91,58,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-warm)',
              flexShrink: 0,
            }}>
              <Sparkles size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Space Grotesk', fontSize: 9,
                color: 'var(--text-dim)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Scouting
              </div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {NEXT_OPPONENT}
              </div>
            </div>
          </button>

          <button
            onClick={() => setLiveOpen(true)}
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.14), rgba(179,71,255,0.10))',
              border: '1px solid rgba(93, 195, 255, 0.4)',
              color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 12,
              textAlign: 'left',
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'rgba(0,212,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-secondary)',
              flexShrink: 0,
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: 3, right: 3,
                width: 6, height: 6, borderRadius: '50%',
                background: '#FF5B3A', boxShadow: '0 0 6px #FF5B3A',
                animation: 'pulse-glow 1.2s ease-in-out infinite',
              }} />
              <Play size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Space Grotesk', fontSize: 9,
                color: 'var(--text-dim)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Live · AI
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                Partido en vivo
              </div>
            </div>
          </button>
        </div>

        {/* 4° CTA — pizarra táctica (fila separada) */}
        <div style={{ padding: '0 20px 16px' }}>
          <button
            onClick={() => setTacticsOpen(true)}
            style={{
              width: '100%',
              padding: '10px 14px', borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(204,255,0,0.08))',
              border: '1px solid rgba(93, 195, 255, 0.35)',
              color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer',
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13,
              textAlign: 'left',
              boxShadow: '0 0 12px rgba(0,212,255,0.12)',
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(0,212,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent-secondary)',
              fontFamily: 'Archivo', fontWeight: 900, fontSize: 12,
              flexShrink: 0, letterSpacing: '0.04em',
            }}>
              TAC
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Space Grotesk', fontSize: 9,
                color: 'var(--text-dim)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Pizarra táctica
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                Arrastrá tus 11 — drag-drop
              </div>
            </div>
            <span style={{ color: 'var(--accent-secondary)', fontSize: 18 }}>→</span>
          </button>
        </div>

        {/* Stats strip */}
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
          {[
            { icon: Trophy, label: 'Goles',       value: '32', color: 'var(--accent-primary)' },
            { icon: Zap,    label: 'Asistencias', value: '15', color: 'var(--accent-secondary)' },
            { icon: Flame,  label: 'MVPs',        value: '5',  color: 'var(--accent-warm)' },
          ].map((s, i) => {
            const I = s.icon
            return (
              <GlassCard key={i} accent={s.color} padding={14} style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${s.color}22`, color: s.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <I size={16} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
                      {s.value}
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {s.label}
                    </div>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>

        {/* Feed */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Compositor trigger */}
          <button
            onClick={() => setComposeOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 14,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              boxShadow: '0 1px 4px rgba(10, 21, 48, 0.05)',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <Avatar
              src={user?.avatarUrl}
              nombre={user?.name ?? 'T'}
              size={38}
              bg="linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
            />
            <span style={{ flex: 1, fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: 'var(--text-muted)' }}>
              ¿Qué está pasando?
            </span>
            <ImagePlus size={20} color="var(--accent-primary)" />
          </button>

          {loading && Array.from({ length: 2 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              style={{
                padding: 0,
                borderRadius: 16,
                overflow: 'hidden',
                background: 'var(--bg-surface)',
                border: '1px solid rgba(10, 21, 48, 0.08)',
              }}
            >
              <Skeleton width="100%" height={180} radius={0} />
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <SkeletonCircle size={36} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Skeleton width="60%" height={12} />
                    <Skeleton width="35%" height={10} />
                  </div>
                </div>
                <Skeleton width="90%" height={12} style={{ marginBottom: 8 }} />
                <Skeleton width="70%" height={12} style={{ marginBottom: 14 }} />
                <div style={{ display: 'flex', gap: 18 }}>
                  <Skeleton width={60} height={14} />
                  <Skeleton width={60} height={14} />
                  <Skeleton width={60} height={14} />
                </div>
              </div>
            </div>
          ))}
          {/* AI Recap card — generated post */}
          {!loading && (
          <AIBorder colors={['#B347FF', '#00D4FF', 'var(--accent-secondary)', '#B347FF']} radius={16} speed={9} halo={0.45}>
            <div
              onClick={() => setRecapOpen(true)}
              style={{
                padding: 16,
                background: 'linear-gradient(135deg, rgba(93, 195, 255, 0.18), rgba(16, 185, 129, 0.08))',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div
                  style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: 'rgba(93, 195, 255, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-secondary)',
                  }}
                >
                  <Sparkles size={14} />
                </div>
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 10,
                  color: 'var(--accent-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  Recap generado por AI
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); regenerateRecap() }}
                  aria-label="Regenerar recap"
                  disabled={recapRegen}
                  style={{
                    marginLeft: 'auto',
                    width: 28, height: 28, borderRadius: 8,
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(93, 195, 255, 0.3)',
                    color: 'var(--accent-secondary)', cursor: recapRegen ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: recapRegen ? 0.5 : 1,
                  }}
                >
                  <RefreshCw size={13} style={{ animation: recapRegen ? 'spin 700ms linear infinite' : 'none' }} />
                </button>
              </div>
              <div style={{
                fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 17,
                color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 6, letterSpacing: '-0.01em',
              }}>
                {recap.headline}
              </div>
              <div style={{
                fontFamily: 'Space Grotesk', fontSize: 12, lineHeight: 1.4,
                color: 'rgba(10, 21, 48, 0.65)', marginBottom: 12,
              }}>
                {recap.tagline}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {recap.highlights.slice(0, 3).map((h, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '4px 10px', borderRadius: 999,
                      background: 'var(--bg-surface)',
                      border: '1px solid rgba(16, 185, 129, 0.08)',
                      fontFamily: 'Space Grotesk', fontSize: 11,
                      color: 'rgba(10, 21, 48, 0.75)',
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 10, fontFamily: 'Space Grotesk', fontSize: 11,
                color: 'var(--accent-primary)', fontWeight: 600,
              }}>
                Leer recap completo →
              </div>
            </div>
          </AIBorder>
          )}

          {!loading && error && (
            <div style={{ padding: '30px 20px', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-muted)' }}>
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, color: 'var(--text-muted)' }}>
              Aún no hay publicaciones. ¡Sé el primero en publicar! ⚽
            </div>
          )}

          {!loading && posts.map(p => {
            const color = colorAutor(p.autorUid)
            return (
              <GlassCard key={p.id} accent={color} padding={0}>
                {p.imagenUrl && (
                  <div
                    style={{
                      height: 180,
                      backgroundImage: `url(${p.imagenUrl})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, transparent 40%, rgba(15,13,10,0.8) 100%)',
                      }}
                    />
                    <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar
                        src={p.autorAvatar}
                        nombre={p.autorNombre}
                        size={36}
                        radius={10}
                        bg={color}
                        style={{ boxShadow: `0 0 12px ${color}66` }}
                      />
                      <div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#FAFBFD' }}>
                          {p.autorNombre}
                        </div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(250, 251, 253, 0.7)' }}>
                          {tiempoRelativo(p.creadoEn)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Body */}
                <div style={{ padding: 14 }}>
                  {!p.imagenUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <Avatar src={p.autorAvatar} nombre={p.autorNombre} size={40} bg={color} />
                      <div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                          {p.autorNombre}
                        </div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'var(--text-dim)' }}>
                          {tiempoRelativo(p.creadoEn)}
                        </div>
                      </div>
                    </div>
                  )}

                  {p.texto && (
                    <div
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4,
                        marginBottom: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                      }}
                    >
                      {p.texto}
                    </div>
                  )}

                  {/* AI tags */}
                  {p.texto && (
                    <div style={{
                      display: 'flex', gap: 5, flexWrap: 'wrap',
                      alignItems: 'center', marginBottom: 12,
                    }}>
                      <Sparkles size={11} color="#B347FF" style={{ opacity: 0.7 }} />
                      {(tagsByPost.get(p.id) ?? []).slice(0, 4).map((t, i) => (
                        <div
                          key={`${p.id}-tag-${i}`}
                          style={{
                            padding: '2px 8px', borderRadius: 999,
                            background: 'rgba(93, 195, 255, 0.08)',
                            border: '1px solid rgba(93, 195, 255, 0.25)',
                            fontFamily: 'Space Grotesk, sans-serif', fontSize: 10,
                            color: 'var(--text-muted)', fontWeight: 600,
                          }}
                        >
                          {t.label}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions bar */}
                  <div style={{ display: 'flex', gap: 18, color: 'var(--text-muted)', alignItems: 'center' }}>
                    {/* Like */}
                    <button
                      onClick={() => handleLike(p)}
                      aria-label={`Me gusta, ${p.numLikes}`}
                      aria-pressed={p.liked}
                      style={{
                        position: 'relative',
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: p.liked ? '#FF5B3A' : 'var(--text-muted)',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: 12,
                        transition: 'color 0.15s',
                        padding: 0,
                      }}
                    >
                      <div style={{ position: 'relative', width: 15, height: 15 }}>
                        <Heart
                          size={15}
                          fill={p.liked ? '#FF5B3A' : 'none'}
                          style={{
                            transition: 'transform 0.2s',
                            transform: p.liked ? 'scale(1.15)' : 'scale(1)',
                            filter: p.liked ? 'drop-shadow(0 0 6px rgba(255,91,58,0.6))' : 'none',
                          }}
                        />
                        <LikeBurst show={burstId === p.id} />
                      </div>
                      <span
                        key={`${p.id}-${p.numLikes}`}
                        style={{
                          fontVariantNumeric: 'tabular-nums',
                          display: 'inline-block',
                          animation: burstId === p.id ? 'count-pop 420ms ease-out' : 'none',
                        }}
                      >
                        {p.numLikes}
                      </span>
                    </button>

                    {/* Comments */}
                    <button
                      onClick={() => openComments(p)}
                      aria-label={`Comentarios, ${p.numComentarios}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontFamily: 'Space Grotesk, sans-serif', fontSize: 12,
                        padding: 0,
                      }}
                    >
                      <MessageCircle size={15} /> {p.numComentarios}
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => setShareOpen(p)}
                      aria-label="Compartir publicación"
                      style={{
                        marginLeft: 'auto',
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: 0,
                      }}
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            )
          })}

          {!loading && hayMas && (
            <button
              onClick={cargarMas}
              disabled={cargandoMas}
              style={{
                margin: '4px auto 0', padding: '10px 22px', borderRadius: 999,
                background: 'var(--surface-1)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', cursor: cargandoMas ? 'default' : 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
              }}
            >
              {cargandoMas ? 'Cargando…' : 'Cargar más'}
            </button>
          )}
        </div>
      </div>

      <BottomNav />

      {/* Comments sheet */}
      <BottomSheet
        open={!!commentsOpen}
        onClose={() => setCommentsOpen(null)}
        title={commentsOpen ? `${comentarios.length} comentarios` : ''}
        accent="#10B981"
        height="72%"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 16 }}>
          {comentariosLoading && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-dim)', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13 }}>
              Cargando comentarios…
            </div>
          )}
          {!comentariosLoading && comentarios.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 12 }}>
              <Avatar src={c.autorAvatar} nombre={c.autorNombre} size={36} fontSize={12} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                    {c.autorNombre}
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'var(--text-dim)' }}>
                    {tiempoRelativo(c.creadoEn)}
                  </div>
                </div>
                <div style={{ marginTop: 3, fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {c.texto}
                </div>
              </div>
            </div>
          ))}
          {!comentariosLoading && comentarios.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13 }}>
              Sé el primero en comentar 💬
            </div>
          )}
        </div>

        {/* Composer */}
        <div
          style={{
            position: 'sticky', bottom: 0, marginTop: 8,
            padding: '12px 0',
            background: 'linear-gradient(180deg, transparent, var(--bg-deep) 30%)',
            display: 'flex', gap: 8, alignItems: 'center',
          }}
        >
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.repeat) sendComment() }}
            disabled={enviando}
            placeholder="Escribe un comentario..."
            style={{
              flex: 1, height: 42, padding: '0 14px', borderRadius: 999,
              background: 'var(--bg-surface)',
              border: '1px solid rgba(16, 185, 129, 0.12)',
              color: 'var(--text-primary)',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            onClick={sendComment}
            disabled={!newComment.trim() || enviando}
            aria-label="Enviar comentario"
            style={{
              width: 42, height: 42, borderRadius: '50%',
              background: newComment.trim() ? 'var(--accent-primary)' : 'var(--border)',
              color: newComment.trim() ? '#FAFBFD' : 'rgba(10, 21, 48, 0.3)',
              border: 'none',
              cursor: newComment.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: newComment.trim() ? '0 0 14px rgba(16, 185, 129, 0.5)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </BottomSheet>

      {/* Share sheet */}
      <BottomSheet
        open={!!shareOpen}
        onClose={() => setShareOpen(null)}
        title="Compartir"
        accent="#FFB800"
        height="45%"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={copyLink}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 14, borderRadius: 14,
              background: 'var(--bg-surface)',
              border: '1px solid rgba(16, 185, 129, 0.08)',
              color: 'var(--text-primary)', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600,
              textAlign: 'left',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--border-warm)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkIcon size={18} />
            </div>
            Copiar enlace
          </button>
          <button
            onClick={() => { setToast('Compartido en tu historia'); setShareOpen(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 14, borderRadius: 14,
              background: 'var(--bg-surface)',
              border: '1px solid rgba(16, 185, 129, 0.08)',
              color: 'var(--text-primary)', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600,
              textAlign: 'left',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(93, 195, 255, 0.15)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} />
            </div>
            Agregar a tu historia
          </button>
          <button
            onClick={() => { setToast('Mensaje enviado al chat'); setShareOpen(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 14, borderRadius: 14,
              background: 'var(--bg-surface)',
              border: '1px solid rgba(16, 185, 129, 0.08)',
              color: 'var(--text-primary)', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600,
              textAlign: 'left',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} />
            </div>
            Enviar por chat
          </button>
          <button
            onClick={() => { navigator.clipboard?.writeText(shareOpen?.texto ?? ''); setToast('Texto copiado'); setShareOpen(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 14, borderRadius: 14,
              background: 'var(--bg-surface)',
              border: '1px solid rgba(16, 185, 129, 0.08)',
              color: 'var(--text-primary)', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600,
              textAlign: 'left',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(240, 248, 244, 0.1)', color: 'rgba(10, 21, 48, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Copy size={18} />
            </div>
            Copiar texto
          </button>
        </div>
      </BottomSheet>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* Compositor de publicación */}
      <BottomSheet
        open={composeOpen}
        onClose={closeCompose}
        title="Nueva publicación"
        accent="#10B981"
        height="70%"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <textarea
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            placeholder="¿Qué está pasando?"
            rows={4}
            style={{
              width: '100%', resize: 'none', boxSizing: 'border-box',
              padding: '12px 14px', borderRadius: 12,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', outline: 'none',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, lineHeight: 1.4,
            }}
          />

          {draftPreview && (
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
              <img src={draftPreview} alt="" style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }} />
              <button
                onClick={quitarDraftImage}
                aria-label="Quitar imagen"
                style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'rgba(10,21,48,0.6)', border: 'none', color: '#FAFBFD',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => composeImgRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 12,
                background: 'var(--border-warm)', border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--accent-primary)', cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
              }}
            >
              <ImagePlus size={16} /> Foto
            </button>
            <input ref={composeImgRef} type="file" accept="image/*" onChange={pickComposeImage} style={{ display: 'none' }} />

            <button
              onClick={publishPost}
              disabled={publishing || (!draftText.trim() && !draftImage)}
              style={{
                marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 8,
                height: 44, padding: '0 20px', borderRadius: 12,
                background: (publishing || (!draftText.trim() && !draftImage))
                  ? 'var(--border)'
                  : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: '#FAFBFD', border: 'none',
                cursor: (publishing || (!draftText.trim() && !draftImage)) ? 'default' : 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14,
                boxShadow: (publishing || (!draftText.trim() && !draftImage)) ? 'none' : '0 6px 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              {publishing ? 'Publicando…' : <><Send size={15} /> Publicar</>}
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Weekly Digest (Tier 3) */}
      <BottomSheet
        open={digestOpen}
        onClose={() => setDigestOpen(false)}
        title="Tu semana en GRADA"
        accent="#10B981"
        height="80%"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={13} color="#B347FF" />
          <div style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 10,
            color: 'var(--accent-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            Digest AI · últimos 7 días
          </div>
        </div>

        <div style={{
          fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 22,
          color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em',
          marginBottom: 10,
        }}>
          {digest.title}
        </div>

        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(93, 195, 255, 0.05))',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontFamily: 'Space Grotesk', fontSize: 13, lineHeight: 1.5,
          color: 'var(--text-primary)', fontStyle: 'italic',
          marginBottom: 18,
        }}>
          {digest.highlight}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {digest.sections.map((s, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 12,
              background: 'var(--bg-surface)',
              border: `1px solid ${s.color}33`,
              borderLeft: `3px solid ${s.color}`,
            }}>
              <div style={{
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 10,
                color: s.color, letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: 'Space Grotesk', fontSize: 13, lineHeight: 1.45,
                color: 'var(--text-primary)',
              }}>
                {s.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(93, 195, 255, 0.12), rgba(93, 195, 255, 0.06))',
          border: '1px solid rgba(93, 195, 255, 0.35)',
          fontFamily: 'Space Grotesk', fontSize: 13, lineHeight: 1.5,
          color: 'var(--text-primary)', fontWeight: 500,
        }}>
          {digest.outlook}
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(
              `${digest.title}\n\n${digest.highlight}\n\n${digest.sections.map(s => `${s.label}: ${s.text}`).join('\n')}\n\n${digest.outlook}`
            ).catch(() => {})
            setToast('Digest copiado')
          }}
          style={{
            marginTop: 16, width: '100%',
            padding: '12px 14px', borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            border: 'none', color: '#FAFBFD',
            fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
          }}
        >
          <Copy size={13} /> Copiar digest
        </button>
      </BottomSheet>

      {/* AI Recap sheet */}
      <BottomSheet
        open={recapOpen}
        onClose={() => setRecapOpen(false)}
        title="Recap del partido"
        accent="#B347FF"
        height="80%"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Sparkles size={13} color="#B347FF" />
          <div style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 10,
            color: 'var(--accent-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            Generado por AI · basado en datos del partido
          </div>
        </div>

        <div style={{
          fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 22,
          color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em',
          marginBottom: 10,
        }}>
          {recap.headline}
        </div>

        {/* Scoreboard */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
          gap: 10, padding: '14px 10px', borderRadius: 14,
          background: 'var(--bg-surface)',
          border: '1px solid rgba(16, 185, 129, 0.08)',
          marginBottom: 18,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
              {RECAP_FACTS.home}
            </div>
            <div style={{ fontFamily: 'Archivo', fontStyle: 'italic', fontWeight: 900, fontSize: 40, color: 'var(--accent-primary)', lineHeight: 1 }}>
              {RECAP_FACTS.homeScore}
            </div>
          </div>
          <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 16, color: 'var(--accent-warm)' }}>VS</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
              {RECAP_FACTS.away}
            </div>
            <div style={{ fontFamily: 'Archivo', fontStyle: 'italic', fontWeight: 900, fontSize: 40, color: 'var(--text-primary)', lineHeight: 1 }}>
              {RECAP_FACTS.awayScore}
            </div>
          </div>
        </div>

        <div style={{
          fontFamily: 'Space Grotesk', fontSize: 14, lineHeight: 1.6,
          color: 'rgba(10, 21, 48, 0.85)', marginBottom: 18,
        }}>
          {recap.body}
        </div>

        <div style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
          color: 'var(--text-dim)', letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: 10,
        }}>
          Highlights
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {recap.highlights.map((h, i) => (
            <div
              key={i}
              style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'var(--bg-surface)',
                border: '1px solid rgba(16, 185, 129, 0.18)',
                fontFamily: 'Space Grotesk', fontSize: 13,
                color: 'var(--text-primary)',
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Video highlights auto-cut */}
        <div style={{ marginBottom: 18 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
              color: 'var(--text-dim)', letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              <Film size={12} color="#00D4FF" />
              Clips auto-cut
            </div>
            {!clips && (
              <button
                onClick={generateClips}
                disabled={clipsLoading}
                style={{
                  padding: '6px 12px', borderRadius: 999,
                  background: 'rgba(93, 195, 255, 0.12)',
                  border: '1px solid rgba(93, 195, 255, 0.45)',
                  color: 'var(--accent-secondary)',
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  cursor: clipsLoading ? 'default' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  opacity: clipsLoading ? 0.6 : 1,
                }}
              >
                <Scissors size={11} style={{ animation: clipsLoading ? 'spin 700ms linear infinite' : 'none' }} />
                {clipsLoading ? 'Analizando…' : 'Generar'}
              </button>
            )}
            {clips && (
              <button
                onClick={generateClips}
                disabled={clipsLoading}
                style={{
                  padding: '6px 10px', borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid rgba(93, 195, 255, 0.3)',
                  color: 'var(--accent-secondary)',
                  fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 10,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                }}
              >
                <RefreshCw size={10} style={{ animation: clipsLoading ? 'spin 700ms linear infinite' : 'none' }} />
                Re-analizar
              </button>
            )}
          </div>

          {!clips && !clipsLoading && (
            <div style={{
              padding: '14px 12px', borderRadius: 10,
              background: 'rgba(93, 195, 255, 0.04)',
              border: '1px dashed rgba(93, 195, 255, 0.25)',
              fontFamily: 'Space Grotesk', fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}>
              La AI detecta goles, atajadas y jugadas destacadas del video completo.
            </div>
          )}

          {clips && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {clips.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10,
                    background: 'rgba(93, 195, 255, 0.05)',
                    border: '1px solid rgba(93, 195, 255, 0.18)',
                    animation: 'slide-up-fade 260ms ease-out backwards',
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(93, 195, 255, 0.15)',
                    border: '1px solid rgba(93, 195, 255, 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 16,
                  }}>
                    {clipEmoji(c.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13,
                      color: 'var(--text-primary)',
                    }}>
                      {c.label}
                    </div>
                    <div style={{
                      fontFamily: 'Space Grotesk', fontSize: 10,
                      color: 'var(--text-dim)',
                      marginTop: 2,
                    }}>
                      {formatClipTime(c.start)} – {formatClipTime(c.end)} · {Math.round(c.confidence * 100)}% match
                    </div>
                  </div>
                  <button
                    onClick={() => setToast(`▶ ${c.label}`)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00D4FF, #B347FF)',
                      border: 'none',
                      color: '#091A12',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(93, 195, 255, 0.3)',
                    }}
                  >
                    <Play size={13} fill="#0F0D0A" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tone + Language switchers */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{
              fontFamily: 'Space Grotesk', fontSize: 10,
              color: 'var(--text-dim)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginRight: 4,
            }}>
              Tono
            </span>
            {(['casual', 'hype', 'formal'] as Tone[]).map(t => (
              <button
                key={t}
                onClick={() => changeRecapTone(t)}
                style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: recapTone === t ? 'rgba(93, 195, 255, 0.22)' : 'transparent',
                  border: recapTone === t ? '1px solid rgba(93, 195, 255, 0.5)' : '1px solid rgba(16, 185, 129, 0.1)',
                  color: recapTone === t ? '#B347FF' : 'var(--text-dim)',
                  fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 600,
                  textTransform: 'capitalize', cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 'auto' }}>
            {(['es', 'en'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => changeRecapLang(l)}
                style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: recapLang === l ? 'var(--border-warm)' : 'transparent',
                  border: recapLang === l ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(16, 185, 129, 0.1)',
                  color: recapLang === l ? 'var(--accent-primary)' : 'var(--text-dim)',
                  fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => regenerateRecap()}
            disabled={recapRegen}
            style={{
              flex: 1, padding: '12px 14px', borderRadius: 12,
              background: 'rgba(93, 195, 255, 0.15)',
              border: '1px solid rgba(93, 195, 255, 0.4)',
              color: 'var(--accent-secondary)',
              fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 12,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: recapRegen ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              opacity: recapRegen ? 0.6 : 1,
            }}
          >
            <RefreshCw size={13} style={{ animation: recapRegen ? 'spin 700ms linear infinite' : 'none' }} />
            {recapRegen ? 'Regenerando…' : 'Regenerar'}
          </button>
          <RippleButton
            onClick={() => {
              navigator.clipboard?.writeText(`${recap.headline}\n\n${recap.body}`).catch(() => {})
              setToast('Recap copiado')
            }}
            rippleColor="rgba(15, 13, 10, 0.35)"
            style={{
              flex: 1, padding: '12px 14px', borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              border: 'none',
              color: '#FAFBFD',
              fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize: 12,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Copy size={13} /> Copiar recap
          </RippleButton>
        </div>
      </BottomSheet>

      {/* Tier 5 sheets */}
      <LineupSheet open={lineupOpen} onClose={() => setLineupOpen(false)} opponent={NEXT_OPPONENT} />
      <RivalScoutSheet open={scoutOpen} onClose={() => setScoutOpen(false)} opponent={NEXT_OPPONENT} />
      <LiveMatchSheet open={liveOpen} onClose={() => setLiveOpen(false)} home="Los Pumas FC" away={NEXT_OPPONENT} />
      <TacticsBoardSheet open={tacticsOpen} onClose={() => setTacticsOpen(false)} />
      <EventsSheet open={eventsOpen} onClose={() => setEventsOpen(false)} />
    </div>
  )
}
