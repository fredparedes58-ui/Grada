import {
  collection, doc, query, orderBy, limit,
  getDocs, getDoc, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db, auth } from './firebase'

export async function obtenerEquipos(lim = 50) {
  const snap = await getDocs(query(collection(db, 'equipos'), orderBy('nombre'), limit(lim)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function obtenerEquipo(equipoId) {
  const snap = await getDoc(doc(db, 'equipos', equipoId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function crearEquipo({ nombre, ciudad, categoria, escudoUrl = '' }) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const batch = writeBatch(db)
  const equipoRef = doc(collection(db, 'equipos'))
  batch.set(equipoRef, {
    creadorUid: uid,
    nombre,
    ciudad,
    categoria,
    escudoUrl,
    creadoEn: serverTimestamp(),
  })
  // El creador como admin va en el mismo batch — las reglas lo exigen
  batch.set(doc(db, 'equipos', equipoRef.id, 'miembros', uid), {
    rol: 'admin',
    dorsal: null,
    desde: serverTimestamp(),
  })
  await batch.commit()
  return equipoRef.id
}

export async function obtenerMiembros(equipoId) {
  const snap = await getDocs(collection(db, 'equipos', equipoId, 'miembros'))
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }))
}

export async function solicitarUnirse(equipoId, mensaje = '') {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const batch = writeBatch(db)
  batch.set(doc(db, 'equipos', equipoId, 'solicitudes', uid), {
    mensaje,
    creadoEn: serverTimestamp(),
  })
  await batch.commit()
}
