import { type ReactNode, useState } from 'react'

interface NeonInputProps {
  placeholder: string
  type?: string
  icon?: ReactNode
  value?: string
  onChange?: (v: string) => void
  error?: string
  accent?: string
}

export default function NeonInput({
  placeholder, type = 'text', icon, value, onChange, error, accent = '#CCFF00',
}: NeonInputProps) {
  const [focused, setFocused] = useState(false)
  const color = error ? '#FF5B3A' : accent

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          borderRadius: 14,
          background: focused ? 'rgba(204, 255, 0, 0.04)' : 'rgba(255, 255, 255, 0.03)',
          border: `1.5px solid ${focused ? color : 'rgba(255, 220, 180, 0.12)'}`,
          boxShadow: focused ? `0 0 0 4px ${color}22, 0 0 16px ${color}33` : 'none',
          transition: 'all 0.2s',
        }}
      >
        {icon && (
          <span
            style={{
              color: focused ? color : 'rgba(250, 245, 235, 0.5)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: 'transparent',
            outline: 'none',
            border: 'none',
            color: '#FAF5EB',
            fontSize: 15,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        />
      </div>
      {error && (
        <div
          style={{
            marginTop: 6,
            paddingLeft: 4,
            fontSize: 11,
            color: '#FF5B3A',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
