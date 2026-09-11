import {
  doc, getDoc, getDocs, collection, query, where, updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// Estado de la cuenta: 'pendiente' | 'aprobado' | 'rechazado' | null (sin doc)
export async function obtenerEstado(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid))
  return snap.exists() ? (snap.data().estado ?? 'pendiente') : null
}

// ¿El uid está en config/roles.admins?
export async function esAdmin(uid) {
  const snap = await getDoc(doc(db, 'config', 'roles'))
  if (!snap.exists()) return false
  const admins = snap.data().admins ?? []
  return Array.isArray(admins) ? admins.includes(uid) : admins[uid] === true
}

// Estado + rol admin en una sola llamada (para el AuthContext).
export async function obtenerEstadoYRol(uid) {
  const [estado, admin] = await Promise.all([obtenerEstado(uid), esAdmin(uid)])
  return { estado, esAdmin: admin }
}

export async function obtenerPendientes() {
  const snap = await getDocs(query(collection(db, 'usuarios'), where('estado', '==', 'pendiente')))
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}

export async function aprobarUsuario(uid) {
  await updateDoc(doc(db, 'usuarios', uid), { estado: 'aprobado' })
}

export async function rechazarUsuario(uid) {
  await updateDoc(doc(db, 'usuarios', uid), { estado: 'rechazado' })
}
