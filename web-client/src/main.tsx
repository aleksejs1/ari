import './lib/i18n'

import React, { StrictMode } from 'react'
import * as ReactJSX from 'react/jsx-runtime'
import ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import * as ReactI18next from 'react-i18next'
import * as ReactRouterDOM from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as ReactQuery from '@tanstack/react-query'
import i18n from 'i18next'
import { Toaster } from 'sonner'

import { AuthProvider } from './contexts/AuthContext'
import { UserPrefsProvider } from './hooks/useUserPrefs'
import { UpgradeModalProvider } from './lib/entitlements/UpgradeModalContext'
import App from './App.tsx'

import './index.css'

// Expose shared libraries on window so community plugins can import them
// without bundling their own copies. Only enabled in development or when
// explicitly opted in (set VITE_EXPOSE_GLOBALS=true in your .env).
if (import.meta.env.VITE_EXPOSE_GLOBALS === 'true') {
  window.React = React
  window.ReactDOM = { ...ReactDOM, ...ReactDOMClient }
  window.ReactQuery = ReactQuery
  window.i18n = i18n
  window.ReactI18next = ReactI18next
  window.ReactRouterDOM = ReactRouterDOM
  window.ReactJSX = ReactJSX
}

// registerDashboardWidgets() is now called inside DashboardPlugin.register()

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const initApp = async () => {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UserPrefsProvider>
              <UpgradeModalProvider>
                <App />
                <Toaster richColors position="bottom-right" />
              </UpgradeModalProvider>
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
