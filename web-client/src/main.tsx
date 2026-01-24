import './lib/i18n'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from './contexts/AuthContext'
// import { registerDashboardWidgets } from './features/dashboard/widgets/registerWidgets'
import { UserPrefsProvider } from './hooks/useUserPrefs'
import { PluginLoader } from './lib/core/PluginLoader'
import App from './App.tsx'

import './index.css'

// ... existing imports ...

// registerDashboardWidgets() is now called inside DashboardPlugin.register()

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const initApp = async () => {
  try {
    await PluginLoader.getInstance().init()

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
  } catch (error) {
    console.error('Failed to initialize application:', error)
  }
}

void initApp()
