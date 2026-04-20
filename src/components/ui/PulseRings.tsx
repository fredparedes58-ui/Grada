interface PulseRingsProps {
  size?: number
  color?: string
  count?: number
}

export default function PulseRings({ size = 60, color = '#CCFF00', count = 3 }: PulseRingsProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `1.5px solid ${color}`,
            animation: `pulse-ring 2.4s ease-out ${i * 0.8}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}
