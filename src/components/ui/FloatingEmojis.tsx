import { useMemo } from 'react'

interface FloatingEmojisProps {
  emojis?: string[]
  count?: number
  duration?: number
}

export default function FloatingEmojis({
  emojis = ['⚽', '🔥', '⭐', '🏆'],
  count = 10,
  duration = 12,
}: FloatingEmojisProps) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        e: emojis[i % emojis.length],
        left: Math.random() * 100,
        delay: Math.random() * duration,
        size: 18 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 60,
        dur: duration + Math.random() * 4,
      })),
    [count, duration, emojis]
  )

  return (
    <>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${it.left}%`,
            top: 0,
            fontSize: it.size,
            opacity: 0,
            animation: `float-up ${it.dur}s linear ${it.delay}s infinite`,
            // @ts-expect-error — custom CSS var
            '--drift': `${it.drift}px`,
            pointerEvents: 'none',
          }}
        >
          {it.e}
        </div>
      ))}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(110vh) translateX(0) scale(0.6); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-20vh) translateX(var(--drift, 30px)) scale(1); opacity: 0; }
        }
      `}</style>
    </>
  )
}
