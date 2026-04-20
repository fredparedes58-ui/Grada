import { type ReactNode, type CSSProperties } from 'react'

interface GlassCardProps {
  children: ReactNode
  accent?: string
  padding?: number | string
  style?: CSSProperties
  onClick?: () => void
}

export default function GlassCard({
  children, accent, padding = 16, style, onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'rgba(26, 22, 18, 0.55)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${accent ? `${accent}55` : 'rgba(255, 220, 180, 0.08)'}`,
        borderRadius: 18,
        padding,
        boxShadow: accent
          ? `0 0 24px ${accent}20, 0 8px 24px rgba(0,0,0,0.3)`
          : '0 8px 24px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
