interface Orb {
  x: number
  y: number
  size: number
  color: string
  opacity?: number
  dur?: number
}

interface FloatingOrbsProps {
  orbs: Orb[]
}

export default function FloatingOrbs({ orbs }: FloatingOrbsProps) {
  return (
    <>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: o.size,
            height: o.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${o.color}${Math.round((o.opacity ?? 0.25) * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
            filter: 'blur(24px)',
            animation: `float-drift ${o.dur ?? 14}s ease-in-out ${i * 0.6}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}
