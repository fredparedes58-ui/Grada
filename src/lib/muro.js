import {
  collection, doc, query, orderBy, limit, startAfter,
  getDocs, addDoc, serverTimestamp, writeBatch, increment,
} from 'firebase/firestore'
import { db, auth } from './firebase'

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
