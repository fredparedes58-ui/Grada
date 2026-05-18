/**
 * Sprint B — Selector de posición con campo de fútbol interactivo SVG.
 * El jugador toca su zona en el campo y la posición se selecciona visualmente.
 */
interface Position {
  id: string
  emoji: string
  desc: string
  // Coordenadas en el SVG (viewBox 0 0 200 320)
  cx: number
  cy: number
  zone: string // zona pintada
}

const POSITIONS: Position[] = [
  { id: 'Portero',        emoji: '🧤', desc: 'Bajo los palos',        cx: 100, cy: 286, zone: 'gk' },
  { id: 'Defensa',        emoji: '🛡️', desc: 'La última línea',       cx: 100, cy: 234, zone: 'def' },
  { id: 'Centrocampista', emoji: '⚙️', desc: 'Motor del equipo',      cx: 100, cy: 170, zone: 'mid' },
  { id: 'Extremo',        emoji: '⚡', desc: 'Bandas y velocidad',     cx: 100, cy: 110, zone: 'wing' },
  { id: 'Delantero',      emoji: '⚽', desc: 'El gol es el destino',  cx: 100, cy: 56,  zone: 'att' },
]

// Zonas coloreadas del campo
const ZONE_COLORS: Record<string, string> = {
  att:  '#CCFF00',
  wing: '#FFB800',
  mid:  '#00D4FF',
  def:  '#B347FF',
  gk:   '#FF5B3A',
}

interface Props {
  value: string
  onChange: (pos: string) => void
}

export default function PitchPositionPicker({ value, onChange }: Props) {
  const selected = POSITIONS.find(p => p.id === value)

  return (
    <div>
      {/* Field SVG */}
      <div style={{
        position: 'relative',
        margin: '0 auto',
        maxWidth: 280,
      }}>
        <svg
          viewBox="0 0 200 320"
          style={{ width: '100%', display: 'block', borderRadius: 16, overflow: 'hidden' }}
        >
          {/* Background */}
          <rect width="200" height="320" fill="#0a1a0a" rx="8" />

          {/* Grass stripes */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <rect
              key={i}
              x={0} y={i * 54} width={200} height={27}
              fill={i % 2 === 0 ? '#0d1f0d' : '#0a1a0a'}
            />
          ))}

          {/* Outer border */}
          <rect x="12" y="12" width="176" height="296" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" rx="2" />

          {/* Center line */}
          <line x1="12" y1="160" x2="188" y2="160" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {/* Center circle */}
          <circle cx="100" cy="160" r="26" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <circle cx="100" cy="160" r="2" fill="rgba(255,255,255,0.35)" />

          {/* Top penalty area */}
          <rect x="52" y="12" width="96" height="44" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          {/* Top goal area */}
          <rect x="76" y="12" width="48" height="18" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          {/* Top goal */}
          <rect x="84" y="8" width="32" height="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

          {/* Bottom penalty area */}
          <rect x="52" y="264" width="96" height="44" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          {/* Bottom goal area */}
          <rect x="76" y="290" width="48" height="18" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          {/* Bottom goal */}
          <rect x="84" y="304" width="32" height="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

          {/* Zone highlight zones (tappable) */}
          {POSITIONS.map(p => {
            const isSelected = value === p.id
            const color = ZONE_COLORS[p.zone]
            const zoneH = p.zone === 'gk' ? 44 : p.zone === 'def' ? 54 : p.zone === 'mid' ? 52 : p.zone === 'wing' ? 54 : 44

            // Y positions for zones (bottom to top: GK→DEF→MID→WING→ATT)
            const zoneY: Record<string, number> = {
              gk:   264,
              def:  210,
              mid:  156,
              wing: 100,
              att:  56,
            }

            return (
              <g key={p.id} onClick={() => onChange(p.id)} style={{ cursor: 'pointer' }}>
                <rect
                  x="13" y={zoneY[p.zone]}
                  width="174" height={zoneH}
                  fill={isSelected ? `${color}28` : 'transparent'}
                  style={{ transition: 'fill 0.2s' }}
                />
                {isSelected && (
                  <rect
                    x="13" y={zoneY[p.zone]}
                    width="174" height={zoneH}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    style={{ opacity: 0.7 }}
                  />
                )}
              </g>
            )
          })}

          {/* Position dots */}
          {POSITIONS.map(p => {
            const isSelected = value === p.id
            const color = ZONE_COLORS[p.zone]
            return (
              <g
                key={p.id}
                onClick={() => onChange(p.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow ring when selected */}
                {isSelected && (
                  <circle
                    cx={p.cx} cy={p.cy} r={22}
                    fill={`${color}18`}
                    stroke={color}
                    strokeWidth="1"
                  />
                )}
                {/* Main circle */}
                <circle
                  cx={p.cx} cy={p.cy} r={isSelected ? 16 : 13}
                  fill={isSelected ? color : 'rgba(255,255,255,0.10)'}
                  stroke={isSelected ? color : 'rgba(255,255,255,0.25)'}
                  strokeWidth="1.5"
                  style={{ transition: 'all 0.2s' }}
                />
                {/* Emoji / initial */}
                <text
                  x={p.cx} y={p.cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isSelected ? 13 : 11}
                  style={{ transition: 'font-size 0.2s', userSelect: 'none' }}
                >
                  {p.emoji}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Position labels on the right */}
        <div style={{
          position: 'absolute',
          right: -90,
          top: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-around',
          pointerEvents: 'none',
        }}>
          {[...POSITIONS].reverse().map(p => {
            const isSelected = value === p.id
            const color = ZONE_COLORS[p.zone]
            return (
              <div
                key={p.id}
                onClick={() => onChange(p.id)}
                style={{
                  cursor: 'pointer',
                  pointerEvents: 'all',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: isSelected ? `${color}18` : 'transparent',
                  border: `1px solid ${isSelected ? color + '55' : 'transparent'}`,
                  transition: 'all 0.18s',
                }}
              >
                <div style={{
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 11,
                  color: isSelected ? color : 'rgba(250,245,235,0.55)',
                  whiteSpace: 'nowrap',
                }}>
                  {p.id}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected info */}
      {selected && (
        <div style={{
          marginTop: 16,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', borderRadius: 12,
          background: `${ZONE_COLORS[selected.zone]}12`,
          border: `1px solid ${ZONE_COLORS[selected.zone]}44`,
          animation: 'slide-up-fade 240ms ease-out both',
        }}>
          <span style={{ fontSize: 20 }}>{selected.emoji}</span>
          <div>
            <div style={{
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14,
              color: ZONE_COLORS[selected.zone],
            }}>
              {selected.id}
            </div>
            <div style={{
              fontFamily: 'Space Grotesk', fontSize: 12,
              color: 'rgba(250,245,235,0.5)',
            }}>
              {selected.desc}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
