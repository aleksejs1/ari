import { Loader2 } from 'lucide-react'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'

import DashboardLayout from './features/layout/DashboardLayout'
import SidebarLessLayout from './features/layout/SidebarLessLayout'

import { useAuth } from '@/hooks/useAuth'

const AuditLogsPage = lazy(() => import('./features/audit-logs/AuditLogsPage'))
const ContactDetailsPage = lazy(() => import('./features/contacts/ContactDetailsPage'))
const ContactsPage = lazy(() => import('./features/contacts/ContactsPage'))
const ContactTimelinePage = lazy(() => import('./features/contacts/ContactTimelinePage'))
const ContactGraphPage = lazy(() => import('./features/contact-graph/ContactGraphPage'))
const GoogleImportPage = lazy(() => import('./features/google-import/GoogleImportPage'))
const GroupsPage = lazy(() => import('./features/groups/GroupsPage'))
const NotificationChannelsPage = lazy(
  () => import('./features/notification-channels/NotificationChannelsPage'),
)
const NotificationPoliciesPage = lazy(() => import('./pages/NotificationPoliciesPage'))
const NotificationPolicyFormPage = lazy(() => import('./pages/NotificationPolicyFormPage'))
const SessionsPage = lazy(() => import('./pages/SessionsPage'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const ChangePasswordPage = lazy(() => import('@/features/users/ChangePasswordPage'))
const DeleteAccountPage = lazy(() => import('@/features/users/DeleteAccountPage'))

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
            {
              path: '/contacts/:id/timeline',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <ContactTimelinePage />
                </Suspense>
              ),
            },
            {
              path: '/contact-graph',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <ContactGraphPage />
                </Suspense>
              ),
            },
          ],
        },
        {
          element: <DashboardLayout />,
          children: [
            {
              path: '/audit-logs',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <AuditLogsPage />
                </Suspense>
              ),
            },
            {
              path: '/notification-channels',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <NotificationChannelsPage />
                </Suspense>
              ),
            },
            {
              path: '/groups',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <GroupsPage />
                </Suspense>
              ),
            },
            {
              path: '/google-import',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <GoogleImportPage />
                </Suspense>
              ),
            },
            {
              path: '/sessions',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <SessionsPage />
                </Suspense>
              ),
            },
            {
              path: '/settings',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              ),
            },
            {
              path: '/change-password',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <ChangePasswordPage />
                </Suspense>
              ),
            },
            {
              path: '/delete-account',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <DeleteAccountPage />
                </Suspense>
              ),
            },
            {
              path: '/settings/notification-policies',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <NotificationPoliciesPage />
                </Suspense>
              ),
            },
            {
              path: '/settings/notification-policies/new',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <NotificationPolicyFormPage />
                </Suspense>
              ),
            },
            {
              path: '/settings/notification-policies/:id',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <NotificationPolicyFormPage />
                </Suspense>
              ),
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
