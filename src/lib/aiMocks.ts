/**
 * Mock "AI" helpers — simula un backend con LLM.
 * Cada función expone un contrato estable (entrada/salida) para que las vistas
 * no cambien cuando se enchufe un modelo real.
 */

/* -------------------------------------------------------------------------- */
/* Shared types                                                               */
/* -------------------------------------------------------------------------- */

export type Tone = 'casual' | 'hype' | 'formal'
export type Lang = 'es' | 'en'

/* -------------------------------------------------------------------------- */
/* Smart Replies (chat)                                                       */
/* -------------------------------------------------------------------------- */

export interface SuggestRepliesContext {
  teamName?: string
  active?: boolean
  tone?: Tone
  lang?: Lang
}

type ReplyRule = {
  match: RegExp
  replies: Record<Tone, string[]>
}

const RULES_ES: ReplyRule[] = [
  {
    match: /(confirm|confirmamos|juegan|vamos|dale|jugamos)/i,
    replies: {
      casual: ['Confirmado ✅', 'Dale, cuenten conmigo', '¿A qué hora nos vemos?', 'Ahí estoy 👊', 'Anotame'],
      hype:   ['¡A ganar esto! 🔥', '¡Vamos equipo! 💪', 'No me pierdo ni uno 🚀', '¡Listo para romperla!', 'Cuenten con todo 🔥'],
      formal: ['Confirmo mi asistencia', 'Estaré presente', 'Agradezco la convocatoria', 'Me anoto al partido', 'Perfecto, confirmado'],
    },
  },
  {
    match: /(cancha|lugar|d[oó]nde|sede|predio)/i,
    replies: {
      casual: ['¿Cancha A como siempre?', '¿Mismo lugar del sábado?', 'Mándame la ubicación 📍', '¿Dónde queda?', 'Dale, te sigo'],
      hype:   ['¡Vamos a la cancha 🔥!', '¡Allí nos vemos! 🚀', '¡Ubicación al grupo ya!', 'Voy saliendo 💨', 'Cancha activada 🔥'],
      formal: ['¿Podrían compartir la dirección?', 'Solicito la ubicación exacta', '¿En qué sede se realizará?', 'Necesito referencia del predio'],
    },
  },
  {
    match: /(hora|horario|a qué hora|cuando)/i,
    replies: {
      casual: ['Perfecto, ahí estoy', '¿Podemos 30 min antes?', 'Dale, me acomodo 🙌', 'Ok, agendado', '¿Caemos temprano?'],
      hype:   ['¡Listo, cuenten conmigo! 🔥', '¡Voy a calentar antes!', 'Llego con todo 🚀'],
      formal: ['Confirmado, anoto el horario', 'De acuerdo con ese horario', 'Agendado en mi calendario'],
    },
  },
  {
    match: /(entrenamiento|entreno|pr[aá]ctica)/i,
    replies: {
      casual: ['Voy con todo 💪', '¿Cuántos confirmados van?', 'Me cuelo al final del entreno', '¿Qué trabajamos hoy?'],
      hype:   ['¡A meterle pila! 🔥', '¡Vamos a sudar la camiseta! 💪', '¡Hoy la rompemos!'],
      formal: ['Confirmo mi asistencia al entrenamiento', '¿Cuál es el plan de la práctica?', 'Perfecto, estaré puntual'],
    },
  },
  {
    match: /(gol|golazo|ganamos|victoria|triunfo|hat[ -]?trick)/i,
    replies: {
      casual: ['¡Vamos equipo! 🔥', 'Tremendo 🙌', 'Hay que repetirlo el finde', 'Qué grande', 'Bestial'],
      hype:   ['¡GOLAZO! ⚽🔥', '¡VAMOS CARAJO! 🚀', '¡Somos los mejores! 💪', '¡A seguir rompiéndola!', '¡Imparables!'],
      formal: ['Felicitaciones al equipo', 'Muy merecido el resultado', 'Gran triunfo colectivo', 'Enhorabuena'],
    },
  },
  {
    match: /(perdimos|derrota|empate|igual[oó]|no pudimos)/i,
    replies: {
      casual: ['La próxima se gana 💪', 'Nos vemos en el próximo', 'Hay que entrenar más', 'Tranquilo, se viene'],
      hype:   ['¡La próxima los arrollamos! 🔥', '¡A entrenar el doble!', '¡Revancha asegurada! 🚀'],
      formal: ['Lo importante es aprender del partido', 'Analicemos qué mejorar', 'Próximo partido, nueva oportunidad'],
    },
  },
  {
    match: /(hola|buenas|qué tal|como estás|como andan|saludos)/i,
    replies: {
      casual: ['¡Hola! Todo bien', '¿Cómo va todo?', '¡Buenas! Listo para el partido', 'Hola crack', 'Todo tranqui'],
      hype:   ['¡Buenas! 🔥 Listo para romper todo', '¡Qué hacés capo! 🚀', '¡Todo al 100! 💪'],
      formal: ['Buenos días, ¿cómo se encuentra?', 'Saludos cordiales', 'Un gusto saludarte'],
    },
  },
  {
    match: /(foto|video|highlight|clip|grabaci[oó]n)/i,
    replies: {
      casual: ['Pásame el link 🎥', '¡Subilo al grupo!', 'Quiero verlo 👀', 'Mándalo por acá'],
      hype:   ['¡COMPARTILO YA! 🔥', '¡Quiero el highlight! 🚀', 'Súbelo a stories 📸'],
      formal: ['¿Podrías compartir el material?', 'Agradecería el archivo', '¿Dónde puedo acceder al contenido?'],
    },
  },
  {
    match: /(faltan|falt[oó]|no puedo|no llego|no voy)/i,
    replies: {
      casual: ['Sin drama, la próxima 👍', '¿Queda lugar?', '¿Alguien lo reemplaza?', 'Todo bien, cuídate'],
      hype:   ['¡Te esperamos la próxima! 💪', '¡No te pierdas el siguiente! 🔥'],
      formal: ['Gracias por avisar con tiempo', 'Entendido, buscaremos reemplazo', 'Sin problema, nos vemos pronto'],
    },
  },
  {
    match: /(cumple|cumplea[ñn]os|aniversario|felicidades)/i,
    replies: {
      casual: ['¡Feliz cumple! 🎉', 'Mil años más crack 🥳', '¡Salud!'],
      hype:   ['¡FELIZ CUMPLE CAMPEÓN! 🎉🔥', '¡A festejar con goles! ⚽🥳'],
      formal: ['Felicitaciones por tu cumpleaños', 'Muchas felicidades en tu día', 'Te deseo lo mejor'],
    },
  },
  {
    match: /(gracias|graci|agradezco)/i,
    replies: {
      casual: ['De nada 👊', 'Cuando quieras', 'Todo bien capo'],
      hype:   ['¡Somos equipo! 🔥', '¡Para eso estamos! 💪'],
      formal: ['Un gusto colaborar', 'Para eso estamos', 'No hay de qué'],
    },
  },
  {
    match: /\?$/,
    replies: {
      casual: ['Sí, dale', 'Depende, contame más', 'Déjame ver y te aviso', 'Mmm no sé, tú decís'],
      hype:   ['¡Claro que sí! 🔥', '¡Dale sin dudar!', '¡Obvio capo! 💪'],
      formal: ['Lo verificaré y respondo', 'Dame un momento para revisar', 'Procedo a confirmar'],
    },
  },
]

const GENERIC: Record<Tone, string[]> = {
  casual: ['Ok, dale 👊', '¡Perfecto!', 'Avísame cuando confirmes', 'Listo', 'Entendido'],
  hype:   ['¡Dale que arranca! 🔥', '¡Todo listo! 🚀', '¡Vamos con todo! 💪'],
  formal: ['Entendido, gracias', 'Confirmado', 'De acuerdo'],
}

/**
 * Devuelve hasta 3 chips contextuales. Cuando hay más opciones que slots, rota
 * según un hash del input para que el mismo mensaje siempre muestre el mismo set
 * (evita "parpadeo" entre renders) pero mensajes distintos varíen.
 */
export function suggestReplies(
  lastMessage: string,
  ctx: SuggestRepliesContext = {},
): string[] {
  const text = (lastMessage ?? '').trim()
  const tone: Tone = ctx.tone ?? 'casual'
  if (!text) return GENERIC[tone].slice(0, 3)

  const seed = text.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  for (const rule of RULES_ES) {
    if (rule.match.test(text)) {
      const pool = rule.replies[tone] ?? rule.replies.casual
      return rotate(pool, seed).slice(0, 3)
    }
  }
  return rotate(GENERIC[tone], seed).slice(0, 3)
}

function rotate<T>(arr: T[], by: number): T[] {
  if (arr.length === 0) return arr
  const k = ((by % arr.length) + arr.length) % arr.length
  return [...arr.slice(k), ...arr.slice(0, k)]
}

/* -------------------------------------------------------------------------- */
/* Quiniela Copilot — sugiere un marcador con "razonamiento"                  */
/* -------------------------------------------------------------------------- */

export type CopilotMood = 'balanced' | 'optimistic' | 'analytic'

export interface CopilotSuggestion {
  home: number
  away: number
  reason: string
  confidence: 'baja' | 'media' | 'alta'
  mood: CopilotMood
}

const SCENARIOS_BALANCED = (home: string, away: string): CopilotSuggestion[] => [
  { home: 2, away: 1, reason: `${home} juega de local y llega con racha de 3 partidos sin perder.`, confidence: 'media',  mood: 'balanced' },
  { home: 1, away: 2, reason: `${away} presiona arriba y le cuesta al rival salir jugado.`,          confidence: 'media',  mood: 'balanced' },
  { home: 2, away: 2, reason: 'Equipos parejos, últimos 3 cruces terminaron en empate.',             confidence: 'media',  mood: 'balanced' },
  { home: 1, away: 1, reason: 'Estadísticas muy parejas — se define por detalles.',                  confidence: 'media',  mood: 'balanced' },
]

const SCENARIOS_OPTIMISTIC = (home: string, away: string): CopilotSuggestion[] => [
  { home: 3, away: 1, reason: `${home} arrolló en su último partido y mantiene titular.`,            confidence: 'alta',  mood: 'optimistic' },
  { home: 3, away: 2, reason: 'Ambos marcan y reciben — pronóstico de partidazo abierto.',           confidence: 'baja',  mood: 'optimistic' },
  { home: 4, away: 2, reason: `${home} promedia 2.8 goles por partido en condición de local.`,       confidence: 'media', mood: 'optimistic' },
  { home: 2, away: 3, reason: `${away} viene goleando 3+ en sus últimos 4 encuentros.`,              confidence: 'media', mood: 'optimistic' },
]

const SCENARIOS_ANALYTIC = (home: string, away: string): CopilotSuggestion[] => [
  { home: 1, away: 0, reason: `${home} viene sólido en defensa (0.7 goles recibidos/partido).`,      confidence: 'alta',  mood: 'analytic' },
  { home: 0, away: 1, reason: `${away} suele golpear de contragolpe fuera de casa.`,                 confidence: 'media', mood: 'analytic' },
  { home: 1, away: 1, reason: 'xG esperado: 1.2 vs 1.1. Modelo Poisson sugiere empate.',              confidence: 'alta',  mood: 'analytic' },
  { home: 2, away: 0, reason: `${home} con +65% posesión histórica en este cruce.`,                   confidence: 'alta',  mood: 'analytic' },
]

export function suggestScore(
  home: string,
  away: string,
  mood: CopilotMood = 'balanced',
): CopilotSuggestion {
  const seed = (home + away + mood).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const pool =
    mood === 'optimistic' ? SCENARIOS_OPTIMISTIC(home, away) :
    mood === 'analytic'   ? SCENARIOS_ANALYTIC(home, away) :
                            SCENARIOS_BALANCED(home, away)
  return pool[seed % pool.length]
}

/* -------------------------------------------------------------------------- */
/* Match Recap Generator — narrativa auto-generada a partir de datos          */
/* -------------------------------------------------------------------------- */

export interface MatchFact {
  home: string
  away: string
  homeScore: number
  awayScore: number
  topScorer?: { name: string; goals: number; team: 'home' | 'away' }
  keyMoment?: { minute: number; description: string }
  attendance?: number
}

export interface RecapOptions {
  tone?: Tone
  lang?: Lang
}

export interface MatchRecap {
  headline: string
  tagline: string
  body: string
  highlights: string[]
  tone: Tone
  lang: Lang
}

export function generateMatchRecap(f: MatchFact, opts: RecapOptions = {}): MatchRecap {
  const tone: Tone = opts.tone ?? 'casual'
  const lang: Lang = opts.lang ?? 'es'
  return lang === 'en' ? recapEN(f, tone) : recapES(f, tone)
}

function recapES(f: MatchFact, tone: Tone): MatchRecap {
  const winner = f.homeScore > f.awayScore ? f.home : f.awayScore > f.homeScore ? f.away : null
  const loser  = winner === f.home ? f.away : winner === f.away ? f.home : null
  const draw   = winner === null
  const total  = f.homeScore + f.awayScore
  const top    = Math.max(f.homeScore, f.awayScore)
  const bot    = Math.min(f.homeScore, f.awayScore)

  const headline = draw
    ? tone === 'hype'
      ? `¡${f.home} y ${f.away} dieron un ESPECTÁCULO en el empate!`
      : tone === 'formal'
      ? `${f.home} y ${f.away} firman tablas en un encuentro equilibrado`
      : `${f.home} y ${f.away} firman tablas en un partido parejo`
    : tone === 'hype'
    ? `¡${winner} ARROLLÓ ${top}-${bot} a ${loser}! 🔥`
    : tone === 'formal'
    ? `${winner} se impone ${top}-${bot} sobre ${loser} en encuentro decisivo`
    : `${winner} vence ${top}-${bot} a ${loser}`

  const tagline = draw
    ? tone === 'hype'   ? 'Empate eléctrico con emociones hasta el final 🔥'
    : tone === 'formal' ? 'Resultado equilibrado que refleja el nivel de ambos equipos'
    :                     'Empate justo que deja sensaciones encontradas'
    : total >= 4
    ? tone === 'hype'   ? '¡Partidazo con goles por todos lados! ⚽🔥'
    : tone === 'formal' ? 'Encuentro ofensivo de alto nivel técnico'
    :                     'Partidazo de ida y vuelta con goles en los dos arcos'
    : total === 0
    ? tone === 'hype'   ? 'Duelo cerradísimo — ¡defensas al máximo!'
    : tone === 'formal' ? 'Encuentro trabado decidido por aspectos defensivos'
    :                     'Duelo trabado que se define en los detalles'
    : tone === 'hype'   ? `¡${winner} LO ROMPIÓ desde el arranque! 💪`
    : tone === 'formal' ? `${winner} impuso su propuesta desde el inicio`
    :                     `${winner} impuso condiciones desde el arranque`

  const intro = draw
    ? `${f.home} y ${f.away} se repartieron los puntos tras un encuentro intenso que terminó ${f.homeScore}-${f.awayScore}.`
    : `${winner} se impuso ${top}-${bot} sobre ${loser} en un partido que tuvo momentos clave de ambos lados.`

  const moment = f.keyMoment
    ? ` Al minuto ${f.keyMoment.minute}, ${f.keyMoment.description.toLowerCase()}, cambiando el rumbo del encuentro.`
    : ''
  const scorer = f.topScorer
    ? ` La figura fue ${f.topScorer.name}, autor de ${f.topScorer.goals} ${f.topScorer.goals === 1 ? 'gol' : 'goles'} para ${f.topScorer.team === 'home' ? f.home : f.away}.`
    : ''
  const attendance = f.attendance ? ` ${f.attendance} personas acompañaron desde la tribuna.` : ''
  const outro =
    tone === 'hype'   ? ' ¡El equipo se lleva la gloria y encara con todo el próximo partido! 🔥' :
    tone === 'formal' ? ' El plantel ya prepara la siguiente jornada con objetivos claros.' :
                        ''

  const body = `${intro}${moment}${scorer}${attendance}${outro}`.trim()

  const highlights: string[] = []
  if (f.topScorer) highlights.push(`⚽ ${f.topScorer.goals}x goles de ${f.topScorer.name}`)
  if (f.keyMoment) highlights.push(`⏱ Min ${f.keyMoment.minute}: ${f.keyMoment.description}`)
  highlights.push(`🏟 ${f.home} ${f.homeScore}-${f.awayScore} ${f.away}`)
  if (total >= 4) highlights.push('🔥 Partido de alto voltaje ofensivo')
  else if (total === 0) highlights.push('🛡 Duelo defensivo sin goles')
  if (f.attendance && f.attendance >= 200) highlights.push(`👥 ${f.attendance} en tribuna`)

  return { headline, tagline, body, highlights, tone, lang: 'es' }
}

/* -------------------------------------------------------------------------- */
/* Media auto-tagging — detecta etiquetas a partir de texto/contexto          */
/* -------------------------------------------------------------------------- */

export interface MediaTag {
  label: string
  kind: 'action' | 'player' | 'team' | 'emotion' | 'moment'
  confidence: number // 0..1
}

export interface MediaTagInput {
  caption?: string
  team?: string
  mediaType?: 'photo' | 'video'
}

/**
 * Simula lo que haría un modelo de visión + NLP: extrae hasta 5 tags relevantes
 * a partir del caption + metadatos. Determinista por el input.
 */
export function suggestMediaTags(input: MediaTagInput): MediaTag[] {
  const text = (input.caption ?? '').toLowerCase()
  const tags: MediaTag[] = []

  const push = (label: string, kind: MediaTag['kind'], confidence: number) => {
    if (!tags.some(t => t.label === label)) tags.push({ label, kind, confidence })
  }

  // Actions
  if (/(gol|golazo|marca|anota|met[eió])/.test(text)) push('#gol', 'action', 0.94)
  if (/(hat[ -]?trick)/.test(text)) push('#hatTrick', 'action', 0.97)
  if (/(asist|pase)/.test(text)) push('#asistencia', 'action', 0.86)
  if (/(atajada|tapada|arquero)/.test(text)) push('#atajada', 'action', 0.88)
  if (/(tiro libre|falta|tarjeta)/.test(text)) push('#tiroLibre', 'action', 0.8)
  if (/(penal|penalti)/.test(text)) push('#penal', 'action', 0.91)

  // Moments
  if (/(final|ultimo minuto|último minuto|90)/.test(text)) push('#tiempoExtra', 'moment', 0.82)
  if (/(cuartos|semi|final|torneo|copa)/.test(text)) push('#torneo', 'moment', 0.78)
  if (/(domingo|s[aá]bado|finde)/.test(text)) push('#finDeSemana', 'moment', 0.72)

  // Outcomes / emotion
  if (/(ganamos|victoria|triunfo|vencimos)/.test(text)) push('#victoria', 'emotion', 0.9)
  if (/(perdimos|derrota)/.test(text)) push('#derrota', 'emotion', 0.88)
  if (/(empate|igualamos)/.test(text)) push('#empate', 'emotion', 0.85)
  if (/🔥|épic|tremen|brutal/.test(text)) push('#épico', 'emotion', 0.76)
  if (/💪|vamos|fuerza/.test(text)) push('#garra', 'emotion', 0.74)

  // Player/team extraction — nombre propio detectado por palabra capitalizada
  const rawCaps = (input.caption ?? '').match(/\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,}(?:\s[A-ZÁÉÍÓÚÑ]\.?)?/g) ?? []
  for (const w of rawCaps.slice(0, 2)) {
    push(`@${w.replace(/\s+/g, '')}`, 'player', 0.7)
  }

  if (input.team) push(`#${input.team.replace(/\s+/g, '')}`, 'team', 0.95)

  // Fallback si no matcheó nada
  if (tags.length === 0) {
    push('#fútbol', 'moment', 0.6)
    push('#equipo', 'team', 0.55)
  }

  // Priorizar por confianza y cortar a 5
  return tags.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
}

/* -------------------------------------------------------------------------- */
/* Match Preview — análisis pre-partido generado antes del encuentro          */
/* -------------------------------------------------------------------------- */

export interface MatchPreviewInput {
  home: string
  away: string
  date?: string
  venue?: string
}

export interface MatchPreview {
  headline: string
  keyMatchup: string
  homeStrength: string
  awayStrength: string
  xFactor: string
  hypeLine: string
}

export function generateMatchPreview(i: MatchPreviewInput): MatchPreview {
  const seed = (i.home + i.away).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const roll = seed % 4

  const HOME_STRENGTHS = [
    `${i.home} llega con la mejor ofensiva del torneo (2.4 goles/partido).`,
    `${i.home} lleva 5 partidos invicto jugando de local.`,
    `${i.home} tiene el mejor porcentaje de posesión de la fecha (58%).`,
    `${i.home} destaca por su juego aéreo — 40% de sus goles en pelota parada.`,
  ]
  const AWAY_STRENGTHS = [
    `${i.away} es letal al contragolpe — 7 goles así este torneo.`,
    `${i.away} presiona alto y recupera rápido en mitad de cancha.`,
    `${i.away} tiene la defensa menos goleada (0.6/partido).`,
    `${i.away} viene de 3 triunfos consecutivos fuera de casa.`,
  ]
  const MATCHUPS = [
    `Delantera de ${i.home} vs línea de fondo de ${i.away} — duelo clave.`,
    `Mediocampo: el equipo que gane el control marca la tónica.`,
    `Rematadores vs arquero — partido que se define en pocas jugadas.`,
    `Duelo de entrenadores: disciplina vs creatividad.`,
  ]
  const XFACTORS = [
    'El clima podría complicar el juego combinativo.',
    'Jugador figura de la fecha está en duda — se decide al vestuario.',
    'Público local empujando desde el arranque puede pesar.',
    'Quien marque primero suele ganar en este cruce (80% histórico).',
  ]
  const HYPES = [
    '🔥 No te pierdas este cruce — promete ser el partido de la fecha.',
    '⚽ Todos los ingredientes para un clásico con emoción hasta el final.',
    '🎯 Dos estilos opuestos — ajedrez puro en la cancha.',
    '🚀 Ambos necesitan los 3 puntos — no habrá especulación.',
  ]

  return {
    headline: `${i.home} recibe a ${i.away}${i.date ? ` · ${i.date}` : ''}`,
    keyMatchup: MATCHUPS[roll],
    homeStrength: HOME_STRENGTHS[roll],
    awayStrength: AWAY_STRENGTHS[(roll + 1) % 4],
    xFactor: XFACTORS[(roll + 2) % 4],
    hypeLine: HYPES[roll],
  }
}

/* -------------------------------------------------------------------------- */
/* Coach Feedback — análisis personalizado a partir de las stats del jugador  */
/* -------------------------------------------------------------------------- */

export interface PlayerStats {
  name: string
  position?: string
  matches: number
  goals: number
  assists: number
  mvps: number
  minutesPerMatch?: number
}

export interface CoachFeedback {
  verdict: string
  strengths: string[]
  improvements: string[]
  nextFocus: string
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C'
}

export function generateCoachFeedback(s: PlayerStats): CoachFeedback {
  const goalsPer = s.matches > 0 ? s.goals / s.matches : 0
  const assistsPer = s.matches > 0 ? s.assists / s.matches : 0
  const mvpRate = s.matches > 0 ? s.mvps / s.matches : 0
  const score = goalsPer * 3 + assistsPer * 2 + mvpRate * 4

  const grade: CoachFeedback['grade'] =
    score >= 2.5 ? 'A+' :
    score >= 1.8 ? 'A'  :
    score >= 1.3 ? 'B+' :
    score >= 0.9 ? 'B'  :
    score >= 0.5 ? 'C+' : 'C'

  const strengths: string[] = []
  if (goalsPer >= 0.6)   strengths.push(`Definición letal: promedio de ${goalsPer.toFixed(2)} goles/partido.`)
  if (assistsPer >= 0.4) strengths.push(`Buena visión de juego: ${s.assists} asistencias en ${s.matches} partidos.`)
  if (mvpRate >= 0.15)   strengths.push(`Aparece en partidos grandes — ${s.mvps} MVPs.`)
  if (strengths.length === 0) strengths.push('Compromiso y regularidad en la cancha.')

  const improvements: string[] = []
  if (goalsPer < 0.3)    improvements.push('Trabajar llegada al área y definición con menos toques.')
  if (assistsPer < 0.2)  improvements.push('Mejorar pase filtrado en zonas de definición.')
  if (mvpRate < 0.1)     improvements.push('Sostener nivel alto durante los 90 minutos.')
  if (improvements.length === 0) improvements.push('Mantener la intensidad sumando más duelos defensivos.')

  const verdict =
    grade === 'A+' ? `${s.name} tuvo una campaña sobresaliente — referente del equipo.` :
    grade === 'A'  ? `${s.name} es pieza clave en el plantel y viene creciendo.` :
    grade === 'B+' ? `${s.name} muestra buenos destellos, con margen para romper la barrera.` :
    grade === 'B'  ? `${s.name} aporta regularidad, próximo salto es convertirse en decisivo.` :
    grade === 'C+' ? `${s.name} tiene participación sostenida, foco en elevar impacto en resultados.` :
                     `${s.name} está construyendo base sólida, enfocarse en fundamentos.`

  const nextFocus =
    goalsPer < assistsPer ? 'Este mes trabajar finalización — series de 20 tiros post-entreno.' :
    assistsPer < goalsPer * 0.5 ? 'Variar el juego: sumar pases entre líneas para generar para otros.' :
    'Sostener el nivel y sumar liderazgo dentro del vestuario.'

  return { verdict, strengths, improvements, nextFocus, grade }
}

/* -------------------------------------------------------------------------- */
/* Team Matcher — recomienda equipos según respuestas del usuario             */
/* -------------------------------------------------------------------------- */

export type PlayStyle = 'ofensivo' | 'defensivo' | 'tocar' | 'intenso'
export type PlayDay  = 'semana' | 'sabado' | 'domingo' | 'flexible'
export type PlayLevel = 'casual' | 'competitivo' | 'profesional'

export interface MatcherAnswers {
  style: PlayStyle
  day: PlayDay
  level: PlayLevel
}

export interface TeamCandidate {
  id: string
  name: string
  color: string
  badge: string
  style: PlayStyle
  day: PlayDay
  level: PlayLevel
  members: number
}

export interface TeamMatch {
  team: TeamCandidate
  score: number // 0..100
  reason: string
}

export function matchTeams(candidates: TeamCandidate[], a: MatcherAnswers): TeamMatch[] {
  const scored = candidates.map(t => {
    let s = 40 // base
    const reasons: string[] = []
    if (t.style === a.style) { s += 28; reasons.push(`juegan estilo ${t.style}`) }
    if (t.day === a.day || a.day === 'flexible') { s += 20; reasons.push(`coinciden en día`) }
    if (t.level === a.level) { s += 18; reasons.push(`tu mismo nivel`) }
    // bonus leve por tamaño
    if (t.members >= 10 && t.members <= 18) s += 6
    const score = Math.min(99, s + ((t.id.charCodeAt(0) % 5)))
    const reason = reasons.length ? reasons.join(' · ') : 'coincidencia básica de perfil'
    return { team: t, score, reason }
  })
  return scored.sort((x, y) => y.score - x.score).slice(0, 2)
}

/* -------------------------------------------------------------------------- */
/* Weekly Digest — resumen narrativo de la semana                             */
/* -------------------------------------------------------------------------- */

export interface WeekStats {
  userName: string
  matchesPlayed: number
  goals: number
  assists: number
  wins: number
  losses: number
  draws: number
  topPostLikes?: number
  nextMatch?: { opponent: string; when: string }
}

export interface WeeklyDigest {
  title: string
  highlight: string
  sections: Array<{ label: string; text: string; color: string }>
  outlook: string
}

export function generateWeeklyDigest(w: WeekStats): WeeklyDigest {
  const goalDiff = w.goals
  const recordStr = `${w.wins}W-${w.draws}D-${w.losses}L`
  const highlight = w.wins > w.losses
    ? `Semana positiva para ${w.userName} — ${recordStr} con ${w.goals} goles y ${w.assists} asistencias.`
    : w.wins === w.losses
    ? `Semana pareja (${recordStr}) — oportunidad de dar el salto la próxima fecha.`
    : `Semana dura (${recordStr}), pero con impacto personal: ${w.goals} goles anotados.`

  const sections: WeeklyDigest['sections'] = [
    {
      label: 'Partidos',
      text: `${w.matchesPlayed} partido${w.matchesPlayed === 1 ? '' : 's'} disputado${w.matchesPlayed === 1 ? '' : 's'} · récord ${recordStr}.`,
      color: '#CCFF00',
    },
    {
      label: 'Ofensiva',
      text: goalDiff > 0
        ? `Aportaste ${w.goals} gol${w.goals === 1 ? '' : 'es'} y ${w.assists} asistencia${w.assists === 1 ? '' : 's'} — ${(w.goals / Math.max(1, w.matchesPlayed)).toFixed(1)} goles/partido.`
        : 'Sin goles esta semana — se viene la reacción.',
      color: '#FFB800',
    },
  ]
  if (w.topPostLikes && w.topPostLikes > 0) {
    sections.push({
      label: 'Feed',
      text: `Tu post más popular de la semana sumó ${w.topPostLikes} likes 🔥`,
      color: '#FF5B3A',
    })
  }

  const outlook = w.nextMatch
    ? `📅 Próximo: vs ${w.nextMatch.opponent} · ${w.nextMatch.when}. ¡A preparar lo mejor!`
    : '📅 Sin partidos agendados — buena ventana para entrenamiento.'

  return {
    title: `Tu resumen semanal, ${w.userName.split(' ')[0]}`,
    highlight,
    sections,
    outlook,
  }
}

/* -------------------------------------------------------------------------- */
/* Semantic Search — interpreta query en lenguaje natural                     */
/* -------------------------------------------------------------------------- */

export interface SearchIntent {
  rawQuery: string
  interpretation: string
  filters: {
    day?: PlayDay
    style?: PlayStyle
    level?: PlayLevel
    zone?: string
    member?: 'pocos' | 'muchos'
  }
}

export function parseSearchIntent(query: string): SearchIntent {
  const q = query.toLowerCase().trim()
  const filters: SearchIntent['filters'] = {}
  const parts: string[] = []

  // Day
  if (/\b(domingo|dom)\b/.test(q))        { filters.day = 'domingo';  parts.push('domingo') }
  else if (/\b(s[aá]bado|sab)\b/.test(q)) { filters.day = 'sabado';   parts.push('sábado') }
  else if (/\b(semana|entre semana)\b/.test(q)) { filters.day = 'semana'; parts.push('entre semana') }

  // Style
  if (/\b(ofensiv|goleador|atacar)/.test(q))      { filters.style = 'ofensivo';  parts.push('estilo ofensivo') }
  else if (/\b(defensiv|s[oó]lido)/.test(q))       { filters.style = 'defensivo'; parts.push('estilo defensivo') }
  else if (/\b(toque|tocar|posesi[oó]n)/.test(q))  { filters.style = 'tocar';     parts.push('de toque') }
  else if (/\b(intens|presi[oó]n|pressing|correr)/.test(q)) { filters.style = 'intenso'; parts.push('intenso') }

  // Level
  if (/\b(casual|amateur|recreativ)/.test(q))            { filters.level = 'casual';       parts.push('nivel casual') }
  else if (/\b(competitiv|serio|liga)/.test(q))           { filters.level = 'competitivo';  parts.push('competitivo') }
  else if (/\b(profesional|pro|alto nivel)/.test(q))      { filters.level = 'profesional';  parts.push('profesional') }

  // Zone
  const zoneMatch = q.match(/\b(zona\s+\w+|norte|sur|este|oeste|centro|capital)\b/)
  if (zoneMatch) { filters.zone = zoneMatch[0]; parts.push(`zona ${zoneMatch[0].replace(/^zona\s+/, '')}`) }

  // Size
  if (/\b(pocos|poca gente|peque[ñn]o)/.test(q)) { filters.member = 'pocos'; parts.push('equipos chicos') }
  else if (/\b(grande|muchos|popular)/.test(q))  { filters.member = 'muchos'; parts.push('equipos grandes') }

  const interpretation = parts.length > 0
    ? `Buscando: ${parts.join(' · ')}`
    : `Búsqueda general: "${query}"`

  return { rawQuery: query, interpretation, filters }
}

function recapEN(f: MatchFact, tone: Tone): MatchRecap {
  const winner = f.homeScore > f.awayScore ? f.home : f.awayScore > f.homeScore ? f.away : null
  const loser  = winner === f.home ? f.away : winner === f.away ? f.home : null
  const draw   = winner === null
  const total  = f.homeScore + f.awayScore
  const top    = Math.max(f.homeScore, f.awayScore)
  const bot    = Math.min(f.homeScore, f.awayScore)

  const headline = draw
    ? tone === 'hype'
      ? `${f.home} and ${f.away} put on a SHOW in a thrilling draw!`
      : tone === 'formal'
      ? `${f.home} and ${f.away} share the points in a balanced clash`
      : `${f.home} and ${f.away} share the points in a tight match`
    : tone === 'hype'
    ? `${winner} CRUSHES ${loser} ${top}-${bot}! 🔥`
    : tone === 'formal'
    ? `${winner} defeats ${loser} ${top}-${bot} in a decisive encounter`
    : `${winner} beats ${loser} ${top}-${bot}`

  const tagline = draw
    ? 'An evenly matched contest with nothing to separate them'
    : total >= 4
    ? 'A high-scoring thriller with goals at both ends'
    : total === 0
    ? 'A tight defensive battle decided by small margins'
    : `${winner} set the pace from the opening whistle`

  const intro = draw
    ? `${f.home} and ${f.away} split the points after an intense ${f.homeScore}-${f.awayScore} draw.`
    : `${winner} beat ${loser} ${top}-${bot} in a match with turning points on both sides.`
  const moment = f.keyMoment
    ? ` In the ${f.keyMoment.minute}th minute, ${f.keyMoment.description.toLowerCase()}, shifting the momentum.`
    : ''
  const scorer = f.topScorer
    ? ` The standout player was ${f.topScorer.name}, scoring ${f.topScorer.goals} ${f.topScorer.goals === 1 ? 'goal' : 'goals'} for ${f.topScorer.team === 'home' ? f.home : f.away}.`
    : ''
  const attendance = f.attendance ? ` ${f.attendance} fans cheered from the stands.` : ''

  const body = `${intro}${moment}${scorer}${attendance}`.trim()

  const highlights: string[] = []
  if (f.topScorer) highlights.push(`⚽ ${f.topScorer.goals}x goals by ${f.topScorer.name}`)
  if (f.keyMoment) highlights.push(`⏱ Min ${f.keyMoment.minute}: ${f.keyMoment.description}`)
  highlights.push(`🏟 ${f.home} ${f.homeScore}-${f.awayScore} ${f.away}`)
  if (total >= 4) highlights.push('🔥 High-scoring thriller')
  else if (total === 0) highlights.push('🛡 Defensive battle, no goals')
  if (f.attendance && f.attendance >= 200) highlights.push(`👥 ${f.attendance} in attendance`)

  return { headline, tagline, body, highlights, tone, lang: 'en' }
}
