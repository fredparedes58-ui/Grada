import { useEffect, useState } from 'react'

const STADIUMS = [
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80', // estadio nocturno
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1600&q=80', // cancha con luces
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1600&q=80', // público
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=80', // jugador en acción
]

interface Props {
  interval?: number
  initial?: number
  showDots?: boolean
}

export default function EpicStadiumBackground({ interval = 5500, initial = 0, showDots = false }: Props) {
  const [idx, setIdx] = useState(initial)

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => (i + 1) % STADIUMS.length)
    }, interval)
    return () => clearInterval(t)
  }, [interval])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {STADIUMS.map((src, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            animation: i === idx ? 'ken-burns 12s ease-out forwards' : 'none',
          }}
        />
      ))}
      {showDots && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 6,
            zIndex: 10,
          }}
        >
          {STADIUMS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === idx ? '#CCFF00' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.4s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
