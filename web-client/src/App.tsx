import { useTranslation } from 'react-i18next'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'

import AuditLogsPage from './features/audit-logs/AuditLogsPage'
import ContactDetailsPage from './features/contacts/ContactDetailsPage'
import ContactsPage from './features/contacts/ContactsPage'
import ContactTimelinePage from './features/contacts/ContactTimelinePage'
import GoogleImportPage from './features/google-import/GoogleImportPage'
import GroupsPage from './features/groups/GroupsPage'
import DashboardLayout from './features/layout/DashboardLayout'
import SidebarLessLayout from './features/layout/SidebarLessLayout'
import NotificationChannelsPage from './features/notification-channels/NotificationChannelsPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import HomePage from './pages/HomePage'
import NotificationPoliciesPage from './pages/NotificationPoliciesPage'
import NotificationPolicyFormPage from './pages/NotificationPolicyFormPage'
import SettingsPage from './pages/Settings'

import { useAuth } from '@/hooks/useAuth'

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
              element: <HomePage />,
            },
            {
              path: '/contacts',
              element: <ContactsPage />,
            },
            {
              path: '/contacts/:id',
              element: <ContactDetailsPage />,
            },
            {
              path: '/contacts/:id/timeline',
              element: <ContactTimelinePage />,
            },
          ],
        },
        {
          element: <DashboardLayout />,
          children: [
            {
              path: '/audit-logs',
              element: <AuditLogsPage />,
            },
            {
              path: '/notification-channels',
              element: <NotificationChannelsPage />,
            },
            {
              path: '/groups',
              element: <GroupsPage />,
            },
            {
              path: '/google-import',
              element: <GoogleImportPage />,
            },
            {
              path: '/settings',
              element: <SettingsPage />,
            },
            {
              path: '/settings/notification-policies',
              element: <NotificationPoliciesPage />,
            },
            {
              path: '/settings/notification-policies/new',
              element: <NotificationPolicyFormPage />,
            },
            {
              path: '/settings/notification-policies/:id',
              element: <NotificationPolicyFormPage />,
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
      element: <div>404 Not Found</div>,
    },
  ])

  return <RouterProvider router={router} />
}
