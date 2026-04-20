import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  height?: string | number
  accent?: string
}

export default function BottomSheet({
  open, onClose, title, children, height = '75%', accent = '#CCFF00',
}: BottomSheetProps) {
  // Block body scroll while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          maxWidth: 430,
          margin: '0 auto',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 280ms cubic-bezier(.2,.8,.2,1)',
          zIndex: 80,
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          maxWidth: 430,
          margin: '0 auto',
          height,
          background: 'var(--bg-base, #141009)',
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          border: '1px solid rgba(255, 220, 180, 0.1)',
          borderBottom: 'none',
          boxShadow: `0 -20px 60px rgba(0,0,0,0.6), 0 0 32px ${accent}22`,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 340ms cubic-bezier(.2,.8,.2,1)',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Grab handle */}
        <div
          style={{
            padding: '10px 0 6px',
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: 'rgba(250, 245, 235, 0.25)',
            }}
          />
        </div>

        {/* Header */}
        {title && (
          <div
            style={{
              padding: '8px 20px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 220, 180, 0.06)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 800,
                fontSize: 18,
                color: '#FAF5EB',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 220, 180, 0.08)',
                color: 'rgba(250, 245, 235, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className="screen-scroll"
          style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 24px' }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
