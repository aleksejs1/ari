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

window.React = React
window.ReactDOM = { ...ReactDOM, ...ReactDOMClient }
window.ReactQuery = ReactQuery
window.i18n = i18n
window.ReactI18next = ReactI18next
window.ReactRouterDOM = ReactRouterDOM
window.ReactJSX = ReactJSX

import { AuthProvider } from './contexts/AuthContext'
import { UserPrefsProvider } from './hooks/useUserPrefs'
import { UpgradeModalProvider } from './lib/entitlements/UpgradeModalContext'
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
    createRoot(rootElement).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UserPrefsProvider>
              <UpgradeModalProvider>
                <App />
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
