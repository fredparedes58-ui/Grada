/**
 * Inicialización de plugins nativos de Capacitor.
 * Solo se ejecuta en iOS/Android, no en web.
 */
import { Capacitor } from '@capacitor/core'

export async function initNative() {
  if (!Capacitor.isNativePlatform()) return

  const [{ StatusBar, Style }, { SplashScreen }] = await Promise.all([
    import('@capacitor/status-bar'),
    import('@capacitor/splash-screen'),
  ])

  await Promise.all([
    StatusBar.setStyle({ style: Style.Dark }),
    StatusBar.setBackgroundColor({ color: '#0F0D0A' }),
  ])

  await SplashScreen.hide({ fadeOutDuration: 400 })
}
