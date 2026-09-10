import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, auth } from './firebase'

async function comprimirAWebP(file, maxPx = 1024, calidad = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url)
        if (blob) resolve(blob)
        else reject(new Error('No se pudo comprimir la imagen'))
      }, 'image/webp', calidad)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Imagen no válida')) }
    img.src = url
  })
}

export async function subirAvatar(file) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const blob = await comprimirAWebP(file, 512, 0.85)
  const storageRef = ref(storage, `avatares/${uid}/avatar.webp`)
  await uploadBytes(storageRef, blob, { contentType: 'image/webp' })
  return getDownloadURL(storageRef)
}

export async function subirEscudo(equipoId, file) {
  const blob = await comprimirAWebP(file, 512, 0.85)
  const storageRef = ref(storage, `equipos/${equipoId}/escudo.webp`)
  await uploadBytes(storageRef, blob, { contentType: 'image/webp' })
  return getDownloadURL(storageRef)
}

export async function subirImagenPublicacion(file) {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('No hay sesión')
  const uuid = crypto.randomUUID()
  const blob = await comprimirAWebP(file, 1200, 0.80)
  const storageRef = ref(storage, `publicaciones/${uid}/${uuid}.webp`)
  await uploadBytes(storageRef, blob, { contentType: 'image/webp' })
  return getDownloadURL(storageRef)
}
