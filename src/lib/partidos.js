import {
  collection, doc, query, orderBy, limit, where,
  getDocs, addDoc, serverTimestamp, writeBatch, increment,
} from 'firebase/firestore'
import { db, auth } from './firebase'

export async function obtenerPartidos({ equipoId = null, ciudad = null } = {}) {
  let q = query(collection(db, 'partidos'), orderBy('fecha', 'asc'), limit(50))
  if (equipoId) q = query(q, where('equipoId', '==', equipoId))
  if (ciudad)   q = query(q, where('ciudad', '==', ciudad))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function crearPartido({ titulo, fecha, ubicacion, ciudad, plazas, equipoId = null }) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  await addDoc(collection(db, 'partidos'), {
    organizadorUid: uid,
    titulo,
    fecha,
    ubicacion,
    ciudad,
    plazas,
    equipoId,
    numInscritos: 0,
  })
}

export async function inscribirse(partidoId, estado = 'si') {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const batch = writeBatch(db)
  batch.set(doc(db, 'partidos', partidoId, 'inscripciones', uid), {
    estado,
    creadoEn: serverTimestamp(),
  })
  batch.update(doc(db, 'partidos', partidoId), { numInscritos: increment(1) })
  await batch.commit()
}

export async function desinscribirse(partidoId) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const batch = writeBatch(db)
  batch.delete(doc(db, 'partidos', partidoId, 'inscripciones', uid))
  batch.update(doc(db, 'partidos', partidoId), { numInscritos: increment(-1) })
  await batch.commit()
}

export async function miInscripcion(partidoId) {
  const uid = auth.currentUser?.uid
  if (!uid) return null
  const { getDoc } = await import('firebase/firestore')
  const snap = await getDoc(doc(db, 'partidos', partidoId, 'inscripciones', uid))
  return snap.exists() ? snap.data() : null
}
