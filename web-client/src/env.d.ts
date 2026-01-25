import type React from 'react'
import type * as ReactJSX from 'react/jsx-runtime'
import type ReactDOM from 'react-dom'
import type * as ReactDOMClient from 'react-dom/client'
import type * as ReactI18next from 'react-i18next'
import type * as ReactRouterDOM from 'react-router-dom'
import type * as ReactQuery from '@tanstack/react-query'
import type i18n from 'i18next'

declare global {
  interface Window {
    React: typeof React
    ReactDOM: typeof ReactDOM & typeof ReactDOMClient
    ReactQuery: typeof ReactQuery
    i18n: typeof i18n
    ReactI18next: typeof ReactI18next
    ReactRouterDOM: typeof ReactRouterDOM
    ReactJSX: typeof ReactJSX
  }
}
