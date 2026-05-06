import { lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { PredictionsProvider } from './context/PredictionsContext'
import { ThemeProvider } from './context/ThemeContext'
import Toast from './components/ui/Toast'
import PageTransition from './components/ui/PageTransition'
import RouteFallback from './components/ui/RouteFallback'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Keep onboarding/login/register/setup eager (first paint), lazy-load the rest
import OnboardingPage from './pages/OnboardingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SetupPage from './pages/SetupPage'

const HomePage         = lazy(() => import('./pages/HomePage'))
const ChatPage         = lazy(() => import('./pages/ChatPage'))
const ConversationPage = lazy(() => import('./pages/ConversationPage'))
const CommunityPage    = lazy(() => import('./pages/CommunityPage'))
const LeaguePage       = lazy(() => import('./pages/LeaguePage'))
const ProfilePage      = lazy(() => import('./pages/ProfilePage'))
const LandingPage      = lazy(() => import('./pages/LandingPage'))

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

function AnimatedRoutes() {
  const location = useLocation()
  const path = location.pathname

  const variant: 'slide' | 'fade' | 'scale' =
    path === '/' || path === '/login' || path === '/register' || path === '/setup' ? 'fade' :
    path === '/chat/conversation' ? 'scale' :
    'slide'

  return (
    <AnimatePresence mode="wait" initial={false}>
      <ErrorBoundary>
      <Routes location={location} key={path}>
        <Route path="/"          element={<PageTransition variant={variant}><OnboardingPage /></PageTransition>} />
        <Route path="/login"     element={<PageTransition variant={variant}><LoginPage /></PageTransition>} />
        <Route path="/register"  element={<PageTransition variant={variant}><RegisterPage /></PageTransition>} />
        <Route path="/setup"     element={<PageTransition variant={variant}><ProtectedRoute><SetupPage /></ProtectedRoute></PageTransition>} />
        <Route path="/home"      element={<PageTransition variant={variant}><ProtectedRoute><Suspense fallback={<RouteFallback />}><HomePage /></Suspense></ProtectedRoute></PageTransition>} />
        <Route path="/chat"      element={<PageTransition variant={variant}><ProtectedRoute><Suspense fallback={<RouteFallback />}><ChatPage /></Suspense></ProtectedRoute></PageTransition>} />
        <Route path="/chat/conversation" element={<PageTransition variant={variant}><ProtectedRoute><Suspense fallback={<RouteFallback />}><ConversationPage /></Suspense></ProtectedRoute></PageTransition>} />
        <Route path="/community" element={<PageTransition variant={variant}><ProtectedRoute><Suspense fallback={<RouteFallback />}><CommunityPage /></Suspense></ProtectedRoute></PageTransition>} />
        <Route path="/league"    element={<PageTransition variant={variant}><ProtectedRoute><Suspense fallback={<RouteFallback />}><LeaguePage /></Suspense></ProtectedRoute></PageTransition>} />
        <Route path="/profile"   element={<PageTransition variant={variant}><ProtectedRoute><Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense></ProtectedRoute></PageTransition>} />
        <Route path="/landing"   element={<PageTransition variant="fade"><Suspense fallback={<RouteFallback />}><LandingPage /></Suspense></PageTransition>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
      </ErrorBoundary>
    </AnimatePresence>
  )
}

function AppFrame() {
  const { toast, setToast } = useAuth()
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        maxWidth: 430,
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <AnimatedRoutes />
      <Toast msg={toast} onClose={() => setToast('')} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>
          <PredictionsProvider>
            <AppFrame />
          </PredictionsProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
