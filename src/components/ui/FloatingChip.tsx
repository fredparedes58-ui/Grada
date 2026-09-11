import { type ReactNode, type CSSProperties } from 'react'

interface FloatingChipProps {
  icon?: ReactNode
  label: string
  value: string
  color?: string
  style?: CSSProperties
}

export default function FloatingChip({
  icon, label, value, color = '#10B981', style,
}: FloatingChipProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 999,
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${color}40`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.3), 0 0 12px ${color}25`,
        animation: 'float-slow 4s ease-in-out infinite',
        ...style,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 12,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </span>
    </div>
  )
}
