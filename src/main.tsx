import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Analytics } from '@vercel/analytics/react'
import { initNative } from './lib/native.ts'

try {
  initNative()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </StrictMode>,
  )
} catch (e) {
  const root = document.getElementById('root')
  if (root && !root.innerHTML) {
    root.innerHTML =
      "<div style=\"font:15px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:48px;max-width:640px;margin:0 auto;color:#0A1530\">" +
      "<h1 style=\"font-size:24px;font-weight:700;margin:0 0 8px\">No se pudo iniciar la app</h1>" +
      "<p style=\"color:#6e6e73;line-height:1.5\">" + (e instanceof Error ? e.message : String(e)) + "</p>" +
      "</div>"
  }
  throw e
}
