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
  // Double glow (ring sharp + halo medio + halo lejano) + inner highlight superior
  // + drop shadow de profundidad. Cuando hay accent el halo toma su color.
  const borderColor = accent ? `${accent}30` : 'var(--border)'
  const ringSharp   = accent ? `0 0 0 1px ${accent}25`      : '0 0 0 1px var(--bg-surface)'
  const haloMid     = accent ? `0 0 22px ${accent}20`       : '0 2px 12px var(--border)'
  const haloFar     = accent ? `0 0 58px ${accent}10`       : '0 4px 24px rgba(10,21,48,0.05)'
  const innerTop    = 'inset 0 1px 0 rgba(255, 255, 255, 0.90)'
  const innerBot    = 'inset 0 -1px 0 var(--bg-surface)'
  const depth       = '0 1px 3px rgba(10, 21, 48, 0.05)'

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        background: 'var(--bg-surface-alt)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${borderColor}`,
        borderRadius: 18,
        padding,
        boxShadow: [ringSharp, haloMid, haloFar, innerTop, innerBot, depth].join(', '),
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.25s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
