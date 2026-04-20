import { type CSSProperties } from 'react'

interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: number | string
  style?: CSSProperties
}

/** Base shimmer bar. Combine sizes/shapes to compose post/card/list skeletons. */
export function Skeleton({ width = '100%', height = 14, radius = 8, style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          'linear-gradient(90deg, rgba(255, 220, 180, 0.04) 0%, rgba(255, 220, 180, 0.12) 50%, rgba(255, 220, 180, 0.04) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

/** Circular skeleton for avatars / badges. */
export function SkeletonCircle({ size = 44, style }: { size?: number; style?: CSSProperties }) {
  return <Skeleton width={size} height={size} radius="50%" style={style} />
}

/** Glass-card shell with skeleton rows inside — used as placeholder for GlassCard content. */
export function SkeletonCard({
  height = 120,
  children,
}: {
  height?: number
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        padding: 14,
        minHeight: height,
        borderRadius: 14,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 220, 180, 0.06)',
        backdropFilter: 'blur(12px) saturate(140%)',
        WebkitBackdropFilter: 'blur(12px) saturate(140%)',
      }}
    >
      {children}
    </div>
  )
}
