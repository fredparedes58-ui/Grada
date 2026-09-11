import { useEffect } from 'react'

interface ToastProps {
  msg: string
  onClose: () => void
  duration?: number
}

export default function Toast({ msg, onClose, duration = 2400 }: ToastProps) {
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [msg, duration, onClose])

  if (!msg) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        padding: '12px 20px',
        borderRadius: 999,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        boxShadow: '0 8px 32px rgba(10,21,48,0.16), 0 0 24px rgba(16, 185, 129, 0.15)',
        color: 'var(--text-primary)',
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'Space Grotesk, sans-serif',
        whiteSpace: 'nowrap',
        animation: 'slide-up-fade 280ms cubic-bezier(.2,.8,.2,1)',
      }}
    >
      {msg}
    </div>
  )
}
