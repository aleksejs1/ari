import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { DataSettingsTab } from './features/settings/DataSettingsTab'
import { GeneralSettingsTab } from './features/settings/GeneralSettingsTab'
import { RegionalSettingsTab } from './features/settings/RegionalSettingsTab'
import { UserPrefsProvider } from './hooks/useUserPrefs'
import './index.css'
import './lib/i18n'
import { settingsRegistry } from './lib/settings/SettingsRegistry'

// Register Settings Tabs
settingsRegistry.registerTab(new GeneralSettingsTab())
settingsRegistry.registerTab(new RegionalSettingsTab())
settingsRegistry.registerTab(new DataSettingsTab())

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
