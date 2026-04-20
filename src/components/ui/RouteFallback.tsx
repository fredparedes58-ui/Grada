/** Minimal fallback shown while a lazy route chunk is fetching. */
export default function RouteFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0F0D0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid rgba(204, 255, 0, 0.15)',
          borderTopColor: '#CCFF00',
          animation: 'spin-slow 0.8s linear infinite',
          boxShadow: '0 0 20px rgba(204, 255, 0, 0.25)',
        }}
      />
    </div>
  )
}
