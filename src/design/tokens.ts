/**
 * Design token references — CSS variable names managed by ThemeContext.
 * Use these constants in inline styles instead of hardcoded hex values.
 *
 * Background:     t.bgDeep, t.bgBase, t.surface1, t.surface2
 * Text:           t.textPrimary, t.textMuted, t.textDim
 * Accent:         t.accentPrimary, t.accentSecondary, t.accentWarm
 * Border:         t.border, t.borderWarm
 * Surfaces:       t.bgSurface, t.bgSurfaceAlt
 */
export const t = {
  // Backgrounds
  bgDeep:        'var(--bg-deep)',
  bgBase:        'var(--bg-base)',
  surface1:      'var(--surface-1)',
  surface2:      'var(--surface-2)',
  bgSurface:     'var(--bg-surface)',
  bgSurfaceAlt:  'var(--bg-surface-alt)',

  // Text
  textPrimary:   'var(--text-primary)',
  textWarm:      'var(--text-warm)',
  textMuted:     'var(--text-muted)',
  textDim:       'var(--text-dim)',

  // Borders
  border:        'var(--border)',
  borderWarm:    'var(--border-warm)',

  // Accents
  accentPrimary:   'var(--accent-primary)',
  accentSecondary: 'var(--accent-secondary)',
  accentWarm:      'var(--accent-warm)',

  // Gradients (not CSS variables — these are value-level)
  gradientMint:  'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
  gradientMintH: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
} as const
