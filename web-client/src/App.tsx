import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ReloadPrompt } from '@/components/ReloadPrompt'
import { ReloadProvider } from '@/contexts/ReloadContext'
import { useAuth } from '@/hooks/useAuth'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'

import AppLayout from './features/layout/AppLayout'
import { SettingsLayout } from './plugins/settings/components/SettingsLayout'

const routeRegistry = RouteRegistry.getInstance()

const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()
  if (isLoading) {
    return <div>{t('app.loading')}</div>
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()
  if (isLoading) {
    return <div>{t('app.loading')}</div>
  }
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />
}

const PageLoader = () => (
  <div className="flex h-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
)

const NotFound = () => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <div>404 Not Found</div>
}

export default function App() {
  useTranslation()
  const { isAuthenticated, arePluginsLoaded } = useAuth()

  if (isAuthenticated && !arePluginsLoaded) {
    return <PageLoader />
  }

  const router = createBrowserRouter([
    {
      element: (
        <ReloadProvider>
          <ReloadPrompt />
          <ProtectedRoute />
        </ReloadProvider>
      ),
      children: [
        {
          element: <AppLayout />,
          children: [
            ...routeRegistry.getRoutes('main'),
            {
              path: '/settings',
              element: <SettingsLayout />,
              children: routeRegistry.getRoutes('settings'),
            },
          ],
        },
      ],
    },
    {
      element: <PublicRoute />,
      children: [
        {
          path: '/login',
          element: (
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          ),
        },
        {
          path: '/register',
          element: (
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ])

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
