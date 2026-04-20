import { useEffect, useState } from 'react'

interface LikeBurstProps {
  show: boolean
  color?: string
}

/** Emits a one-shot burst of particles when `show` flips to true. */
export default function LikeBurst({ show, color = '#FF5B3A' }: LikeBurstProps) {
  const [burstKey, setBurstKey] = useState(0)

  useEffect(() => {
    if (show) setBurstKey(k => k + 1)
  }, [show])

  if (!burstKey) return null

  return (
    <div
      key={burstKey}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2
        const dist = 22 + Math.random() * 10
        const tx = Math.cos(angle) * dist
        const ty = Math.sin(angle) * dist
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 6px ${color}`,
              // @ts-expect-error — custom CSS vars
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              animation: 'burst-out 600ms ease-out forwards',
            }}
          />
        )
      })}
      <style>{`
        @keyframes burst-out {
          0% { transform: translate(0, 0) scale(0.6); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
