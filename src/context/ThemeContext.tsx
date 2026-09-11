import { createContext, useContext, useEffect, type ReactNode } from 'react'

interface ThemeCtx {
  mode: 'light'
}

const Ctx = createContext<ThemeCtx | null>(null)

// Tema único claro (Krujens Light Fresh). Se incluyen todos los nombres de
// token que usan los componentes (incl. amber/coral/purple de features de main).
const TOKENS: Record<string, string> = {
  '--bg-deep':         '#FAFBFD',
  '--bg-base':         '#F0F4F8',
  '--surface-1':       '#FFFFFF',
  '--surface-2':       '#F5F7FA',
  '--bg-surface':      'rgba(16, 185, 129, 0.06)',
  '--bg-surface-alt':  'rgba(16, 185, 129, 0.10)',
  '--text-primary':    '#0A1530',
  '--text-warm':       '#0A1530',
  '--text-muted':      'rgba(10, 21, 48, 0.55)',
  '--text-dim':        'rgba(10, 21, 48, 0.35)',
  '--border':          'rgba(10, 21, 48, 0.10)',
  '--border-warm':     'rgba(16, 185, 129, 0.18)',
  '--accent-primary':  '#10B981',
  '--accent-secondary':'#5DC3FF',
  '--accent-warm':     '#34D399',
  '--accent-amber':    '#F59E0B',
  '--accent-coral':    '#FF5B3A',
  '--accent-purple':   '#B347FF',
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    Object.entries(TOKENS).forEach(([k, v]) => root.style.setProperty(k, v))
    root.setAttribute('data-theme', 'light')
    try {
      localStorage.removeItem('grada_theme_v1')
      localStorage.removeItem('grada_theme_v2')
    } catch { /* ignore */ }
  }, [])

  return (
    <Ctx.Provider value={{ mode: 'light' }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTheme() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme must be used within ThemeProvider')
  return v
}

export type ThemeMode = 'light'
