import {
  collection, doc, query, where, orderBy, limit,
  getDoc, setDoc, addDoc, serverTimestamp, writeBatch, onSnapshot,
} from 'firebase/firestore'
import { db, auth } from './firebase'

// Id determinista para un DM (una sola conversación por par).
function idDM(a, b) {
  return 'dm__' + [a, b].sort().join('__')
}

/** Abre (o crea) el DM con otro miembro del equipo. Devuelve el convId. */
export async function abrirDM({ otroUid, otroNombre, equipoId, miNombre }) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const convId = idDM(uid, otroUid)
  const ref = doc(db, 'conversaciones', convId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      tipo: 'directo',
      equipoId,
      participantes: [uid, otroUid],
      nombres: { [uid]: miNombre || 'Yo', [otroUid]: otroNombre || 'Jugador' },
      creadorUid: uid,
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
      ultimoMensaje: null,
    })
  }
  return convId
}

/** Crea un chat de grupo del equipo con los participantes dados. */
export async function crearGrupo({ nombre, equipoId, participantes }) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const parts = [...new Set([uid, ...(participantes || [])])]
  const ref = await addDoc(collection(db, 'conversaciones'), {
    tipo: 'grupo',
    equipoId,
    nombre: nombre || 'Grupo',
    participantes: parts,
    creadorUid: uid,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
    ultimoMensaje: null,
  })
  return ref.id
}

/** Envía un mensaje: crea el doc + actualiza preview/orden en la conversación. */
export async function enviarMensaje(convId, texto) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const t = (texto || '').trim()
  if (!t) return
  const batch = writeBatch(db)
  const msgRef = doc(collection(db, 'conversaciones', convId, 'mensajes'))
  batch.set(msgRef, { senderUid: uid, texto: t, creadoEn: serverTimestamp() })
  batch.update(doc(db, 'conversaciones', convId), {
    actualizadoEn: serverTimestamp(),
    ultimoMensaje: { texto: t, senderUid: uid },
  })
  await batch.commit()
}

/** Listener en vivo de los mensajes de una conversación (asc). */
export function escucharMensajes(convId, cb, onError) {
  const q = query(
    collection(db, 'conversaciones', convId, 'mensajes'),
    orderBy('creadoEn', 'asc'),
    limit(300),
  )
  return onSnapshot(
    q,
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err => onError && onError(err),
  )
}

/** Listener de mis conversaciones (donde soy participante), más reciente primero. */
export function escucharConversaciones(cb, onError) {
  const uid = auth.currentUser?.uid
  if (!uid) return () => {}
  const q = query(
    collection(db, 'conversaciones'),
    where('participantes', 'array-contains', uid),
    orderBy('actualizadoEn', 'desc'),
    limit(100),
  )
  return onSnapshot(
    q,
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err => onError && onError(err),
  )
}

/** Marca la conversación como leída ahora (para el cálculo de no-leídos). */
export async function marcarLeido(convId) {
  const uid = auth.currentUser?.uid
  if (!uid) return
  await setDoc(
    doc(db, 'conversaciones', convId, 'lecturas', uid),
    { ultimoLeidoEn: serverTimestamp() },
    { merge: true },
  )
}

/** Lectura puntual de mi última lectura de una conversación. */
export async function obtenerMiLectura(convId) {
  const uid = auth.currentUser?.uid
  if (!uid) return null
  const snap = await getDoc(doc(db, 'conversaciones', convId, 'lecturas', uid))
  return snap.exists() ? snap.data() : null
}

/** Mi última lectura de una conversación (para pintar el badge de no-leídos). */
export function escucharMiLectura(convId, cb) {
  const uid = auth.currentUser?.uid
  if (!uid) return () => {}
  return onSnapshot(doc(db, 'conversaciones', convId, 'lecturas', uid), snap => {
    cb(snap.exists() ? snap.data() : null)
  })
}
