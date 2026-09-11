import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, writeBatch, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

const ERRORES = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email',
  'auth/invalid-email': 'El email no es válido',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
  'auth/user-not-found': 'No existe ninguna cuenta con ese email',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-credential': 'Email o contraseña incorrectos',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos',
  'auth/network-request-failed': 'Error de conexión. Comprueba tu red',
}

function traducir(error) {
  return ERRORES[error.code] ?? 'Error inesperado. Inténtalo de nuevo'
}

export async function registrar({ email, password, nombre, apodo, ciudad, posicion }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password).catch(e => {
    throw new Error(traducir(e))
  })
  const uid = cred.user.uid
  await updateProfile(cred.user, { displayName: nombre })

  const batch = writeBatch(db)
  batch.set(doc(db, 'usuarios', uid), {
    uid,
    nombre,
    apodo: apodo || nombre,
    ciudad: ciudad || '',
    posicion: posicion || '',
    pieHabil: '',
    bio: '',
    avatarUrl: '',
    creadoEn: serverTimestamp(),
  })
  batch.set(doc(db, 'usuarios', uid, 'privado', 'contacto'), {
    email,
    telefono: '',
    ajustes: {},
  })
  await batch.commit()
  return cred.user
}

export async function actualizarFotoPerfil(url) {
  const usuario = auth.currentUser
  if (!usuario) throw new Error('No hay sesión')
  await updateProfile(usuario, { photoURL: url })
  await updateDoc(doc(db, 'usuarios', usuario.uid), { avatarUrl: url })
}

export async function acceder({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password).catch(e => {
    throw new Error(traducir(e))
  })
  return cred.user
}

export async function cerrarSesion() {
  await signOut(auth)
}

export async function recuperarContrasena(email) {
  await sendPasswordResetEmail(auth, email).catch(e => {
    throw new Error(traducir(e))
  })
}

export function observarSesion(callback) {
  return onAuthStateChanged(auth, callback)
}
