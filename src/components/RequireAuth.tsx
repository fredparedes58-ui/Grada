import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import RouteFallback from './ui/RouteFallback'
import CuentaPendiente from './CuentaPendiente'

/** Gate for private routes: waits for Firebase to resolve the session,
 *  redirects to /login when there is no user, and blocks access until the
 *  admin has approved the account (admins bypass the gate). */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, estado, esAdmin, estadoLoading } = useAuth()
  const location = useLocation()

  if (loading) return <RouteFallback />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (estadoLoading) return <RouteFallback />
  if (!esAdmin && estado === 'rechazado') return <CuentaPendiente rechazado />
  if (!esAdmin && estado !== 'aprobado') return <CuentaPendiente />
  return <>{children}</>
}
