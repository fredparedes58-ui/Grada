import {
  collection, doc, query, orderBy, limit, startAfter,
  getDoc, getDocs, addDoc, serverTimestamp, writeBatch, increment,
} from 'firebase/firestore'
import { db, auth } from './firebase'

// Resuelve los datos públicos de autor (nombre/apodo/avatar) para una lista de uids.
// Las reglas permiten leer usuarios/{uid} a cualquier usuario autenticado.
export async function obtenerAutores(uids) {
  const unicos = [...new Set(uids)]
  const docs = await Promise.all(unicos.map(uid => getDoc(doc(db, 'usuarios', uid))))
  const mapa = {}
  docs.forEach((d, i) => { mapa[unicos[i]] = d.exists() ? d.data() : null })
  return mapa
}

// Devuelve un Set con los ids de publicaciones que el usuario actual ha likeado.
export async function obtenerMisLikes(postIds) {
  const uid = auth.currentUser?.uid
  if (!uid || postIds.length === 0) return new Set()
  const docs = await Promise.all(
    postIds.map(pid => getDoc(doc(db, 'publicaciones', pid, 'likes', uid))),
  )
  const set = new Set()
  docs.forEach((d, i) => { if (d.exists()) set.add(postIds[i]) })
  return set
}

export async function obtenerPublicaciones(ultimaDoc = null, pagSize = 20) {
  let q = query(
    collection(db, 'publicaciones'),
    orderBy('creadoEn', 'desc'),
    limit(pagSize),
  )
  if (ultimaDoc) q = query(q, startAfter(ultimaDoc))
  const snap = await getDocs(q)
  return {
    posts: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    ultimo: snap.docs[snap.docs.length - 1] ?? null,
  }
}

/** @param {{ texto: string, imagenUrl?: string | null }} datos */
export async function publicar({ texto, imagenUrl = null }) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  await addDoc(collection(db, 'publicaciones'), {
    autorUid: uid,
    texto,
    imagenUrl,
    creadoEn: serverTimestamp(),
    numLikes: 0,
    numComentarios: 0,
  })
}

export async function darLike(postId) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const batch = writeBatch(db)
  batch.set(doc(db, 'publicaciones', postId, 'likes', uid), { creadoEn: serverTimestamp() })
  batch.update(doc(db, 'publicaciones', postId), { numLikes: increment(1) })
  await batch.commit()
}

export async function quitarLike(postId) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const batch = writeBatch(db)
  batch.delete(doc(db, 'publicaciones', postId, 'likes', uid))
  batch.update(doc(db, 'publicaciones', postId), { numLikes: increment(-1) })
  await batch.commit()
}

export async function comentar(postId, texto) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const batch = writeBatch(db)
  const comentarioRef = doc(collection(db, 'publicaciones', postId, 'comentarios'))
  batch.set(comentarioRef, { autorUid: uid, texto, creadoEn: serverTimestamp() })
  batch.update(doc(db, 'publicaciones', postId), {
    numComentarios: increment(1),
    refComentario: comentarioRef.id,
  })
  await batch.commit()
}

export async function obtenerComentarios(postId) {
  const snap = await getDocs(
    query(collection(db, 'publicaciones', postId, 'comentarios'), orderBy('creadoEn', 'asc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
