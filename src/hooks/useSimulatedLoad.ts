import { useEffect, useState } from 'react'

/**
 * Simulates a loading state for N ms. Used to demo skeleton screens
 * before real API wiring — replace with a real query hook later.
 */
export function useSimulatedLoad(ms = 700) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])
  return loading
}
