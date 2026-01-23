import { Loader2 } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'

import DashboardLayout from './features/layout/DashboardLayout'
import SidebarLessLayout from './features/layout/SidebarLessLayout'

import { useAuth } from '@/hooks/useAuth'
import { RouteRegistry } from '@/lib/routing/RouteRegistry'

const routeRegistry = RouteRegistry.getInstance()

const ContactDetailsPage = lazy(() => import('./features/contacts/ContactDetailsPage'))
const ContactsPage = lazy(() => import('./features/contacts/ContactsPage'))
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
const HomePage = lazy(() => import('./pages/HomePage'))
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

export default function App() {
  useTranslation()

  const router = createBrowserRouter([
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <SidebarLessLayout />,
          children: [
            {
              path: '/',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <HomePage />
                </Suspense>
              ),
            },
            {
              path: '/contacts',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <ContactsPage />
                </Suspense>
              ),
            },
            {
              path: '/contacts/:id',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <ContactDetailsPage />
                </Suspense>
              ),
            },
            ...routeRegistry.getRoutes('sidebar-less'),
          ],
        },
        {
          element: <DashboardLayout />,
          children: [
            ...routeRegistry.getRoutes('dashboard'),
            {
              /* Removed Groups route */
            },
            {
              /* Removed GoogleImport route */
            },
            {
              /* Removed Sessions route */
            },
            {
              /* Removed Settings route */
            },
            {
              /* Removed User Security routes */
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
      element: <div>404 Not Found</div>,
    },
  ])

  return <RouterProvider router={router} />
}
