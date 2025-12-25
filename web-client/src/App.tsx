import { useTranslation } from 'react-i18next'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'

import DashboardLayout from './components/layout/DashboardLayout'
import ContactsPage from './features/contacts/ContactsPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import { useAuth } from '@/hooks/useAuth'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()
  if (isLoading) return <div>{t('app.loading')}</div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useTranslation()
  if (isLoading) return <div>{t('app.loading')}</div>
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />
}

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation()

  const router = createBrowserRouter([
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <DashboardLayout />,
          children: [
            {
              path: '/',
              element: <ContactsPage />,
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
          element: <LoginPage />,
        },
        {
          path: '/register',
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: '*',
      element: <div>404 Not Found</div>, // cannot use hook easily here without wrapper component, skipping for now or making a wrapper
    },
  ])

  return <RouterProvider router={router} />
}
