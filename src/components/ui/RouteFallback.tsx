/** Minimal fallback shown while a lazy route chunk is fetching. */
export default function RouteFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent-primary)',
          animation: 'spin-slow 0.8s linear infinite',
        }}
      />
    </div>
  )
}
