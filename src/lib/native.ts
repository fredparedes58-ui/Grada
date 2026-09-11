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
    StatusBar.setStyle({ style: Style.Light }),
    StatusBar.setBackgroundColor({ color: '#FAFBFD' }),
  ])

  await SplashScreen.hide({ fadeOutDuration: 400 })
}
