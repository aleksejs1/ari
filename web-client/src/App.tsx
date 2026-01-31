import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'

import DashboardLayout from './features/layout/DashboardLayout'
import SidebarLessLayout from './features/layout/SidebarLessLayout'

const routeRegistry = RouteRegistry.getInstance()

// Removed ContactDetailsPage import
// Removed ContactsPage import
// Removed ContactGraphPage import

// ... inside Layout
// Removed /contact-graph route
// Removed GoogleImportPage import
// Removed GroupsPage import
// Removed Notification imports
// Removed SessionsPage import
// Removed SettingsPage import
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
// Removed HomePage import
// Removed User Security imports

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
      element: <ProtectedRoute />,
      children: [
        {
          element: <SidebarLessLayout />,
          children: [...routeRegistry.getRoutes('sidebar-less')],
        },
        {
          element: <DashboardLayout />,
          children: [...routeRegistry.getRoutes('dashboard')],
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

  return <RouterProvider router={router} />
}
