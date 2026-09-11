import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { observarSesion, cerrarSesion } from '../lib/auth'
import { obtenerEstadoYRol } from '../lib/usuarios'
import type { User as FirebaseUser } from 'firebase/auth'

export interface User {
  uid: string
  name: string
  email: string
  avatarUrl?: string
  position?: string
  team?: string
  level?: string
  setupDone?: boolean
}

export type EstadoCuenta = 'pendiente' | 'aprobado' | 'rechazado' | null

interface AuthCtx {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  estado: EstadoCuenta
  esAdmin: boolean
  estadoLoading: boolean
  logout: () => Promise<void>
  updateUser: (patch: Partial<User>) => void
  toast: string
  setToast: (s: string) => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [estado, setEstado] = useState<EstadoCuenta>(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [estadoLoading, setEstadoLoading] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const unsub = observarSesion(async (fbUser: import('firebase/auth').User | null) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        setUser({
          uid:       fbUser.uid,
          name:      fbUser.displayName ?? fbUser.email ?? 'Jugador',
          email:     fbUser.email ?? '',
          avatarUrl: fbUser.photoURL ?? '',
        })
        setEstadoLoading(true)
        setLoading(false)
        try {
          const r = await obtenerEstadoYRol(fbUser.uid)
          setEstado(r.estado as EstadoCuenta)
          setEsAdmin(r.esAdmin)
        } catch {
          setEstado(null)
          setEsAdmin(false)
        } finally {
          setEstadoLoading(false)
        }
      } else {
        setUser(null)
        setEstado(null)
        setEsAdmin(false)
        setEstadoLoading(false)
        setLoading(false)
      }
    })
    return unsub
  }, [])

  async function logout() {
    await cerrarSesion()
    setUser(null)
    setFirebaseUser(null)
    setEstado(null)
    setEsAdmin(false)
    setToast('Sesión cerrada')
  }

  function updateUser(patch: Partial<User>) {
    setUser(prev => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <Ctx.Provider value={{ user, firebaseUser, loading, estado, esAdmin, estadoLoading, logout, updateUser, toast, setToast }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}
