import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { registerDashboardWidgets } from './features/dashboard/widgets/registerWidgets'
import { UserPrefsProvider } from './hooks/useUserPrefs'
import './index.css'
import './lib/i18n'
import { AuditLogsPlugin } from './plugins/audit-logs'
import { ContactGraphPlugin } from './plugins/contact-graph'
import { ContactsPlugin } from './plugins/contacts'
import { GoogleImportPlugin } from './plugins/google-import'
import { GroupsPlugin } from './plugins/groups'
import { NotificationsPlugin } from './plugins/notifications'
import { SessionsPlugin } from './plugins/sessions'
import { SettingsPlugin } from './plugins/settings/index'
import { UserSecurityPlugin } from './plugins/user-security'

// Register Settings Tabs
// Tabs are now registered by SettingsPlugin

// Register Plugins
new ContactsPlugin().register()
new AuditLogsPlugin().register()
new ContactGraphPlugin().register()
new GoogleImportPlugin().register()
new GroupsPlugin().register()
new NotificationsPlugin().register()
new SessionsPlugin().register()
new UserSecurityPlugin().register()
new SettingsPlugin().register()

registerDashboardWidgets()

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserPrefsProvider>
          <App />
        </UserPrefsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
