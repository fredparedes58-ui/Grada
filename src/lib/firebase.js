import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const cfg = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Blindaje: si el build salió sin las VITE_FIREBASE_* (p.ej. faltan en Vercel),
// muestra un error visible en vez de matar el arranque con pantalla en blanco.
const faltan = Object.entries(cfg).filter(([, v]) => !v).map(([k]) => k)
if (faltan.length) {
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML =
      "<div style=\"font:15px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:48px;max-width:640px;margin:0 auto;color:#0A1530\">" +
      "<h1 style=\"font-size:28px;font-weight:700;letter-spacing:-.02em;margin:0 0 8px\">Configuración incompleta</h1>" +
      "<p style=\"color:#6e6e73;line-height:1.5\">Faltan variables de entorno en el build: " + faltan.join(', ') + ".</p>" +
      "</div>"
  }
  throw new Error('Firebase config incompleta: ' + faltan.join(', '))
}

const app = initializeApp(cfg)
export const auth = getAuth(app)
export const db   = getFirestore(app)
export const storage = getStorage(app)
