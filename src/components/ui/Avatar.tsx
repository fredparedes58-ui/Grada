import { useState, type CSSProperties } from 'react'

function iniciales(nombre: string): string {
  return nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

interface AvatarProps {
  src?: string
  nombre: string
  size?: number
  radius?: number | string
  /** Fondo/acento mostrado tras las iniciales (o si la imagen falla). */
  bg?: string
  fontSize?: number
  style?: CSSProperties
}

/** Avatar con fallback a iniciales cuando no hay imagen o esta falla al cargar. */
export default function Avatar({
  src, nombre, size = 40, radius = '50%',
  bg = 'var(--accent-primary)', fontSize = 14, style,
}: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImg = !!src && !failed
  return (
    <div
      aria-hidden
      style={{
        width: size, height: size, borderRadius: radius, overflow: 'hidden', flexShrink: 0,
        background: bg, color: '#091A12',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Fraunces, Georgia, serif', fontWeight: 700, fontSize,
        ...style,
      }}
    >
      {showImg
        ? <img src={src} alt="" onError={() => setFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : iniciales(nombre)}
    </div>
  )
}
