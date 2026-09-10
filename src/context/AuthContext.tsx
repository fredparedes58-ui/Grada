import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { observarSesion, cerrarSesion } from '../lib/auth'
import type { User as FirebaseUser } from 'firebase/auth'

export interface User {
  uid: string
  name: string
  email: string
  avatarUrl?: string
  position?: string
  team?: string
}

interface AuthCtx {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
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
  const [toast, setToast] = useState('')

  useEffect(() => {
    const unsub = observarSesion((fbUser: import('firebase/auth').User | null) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        setUser({
          uid:       fbUser.uid,
          name:      fbUser.displayName ?? fbUser.email ?? 'Jugador',
          email:     fbUser.email ?? '',
          avatarUrl: fbUser.photoURL ?? '',
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function logout() {
    await cerrarSesion()
    setUser(null)
    setFirebaseUser(null)
    setToast('Sesión cerrada')
  }

  function updateUser(patch: Partial<User>) {
    setUser(prev => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <Ctx.Provider value={{ user, firebaseUser, loading, logout, updateUser, toast, setToast }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}
