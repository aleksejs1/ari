/* eslint-disable react-refresh/only-export-components */
import type { ComponentType, ReactNode } from 'react'

import { ErrorBoundary } from '@/components/ErrorBoundary'

interface Props {
  pluginId: string
  children: ReactNode
}

/**
 * Drop-in JSX wrapper for plugin routes and widgets.
 *
 * Usage in plugin index files:
 *   element: (
 *     <PluginErrorBoundary pluginId="contacts">
 *       <Suspense fallback={<PageLoader />}>
 *         <ContactsPage />
 *       </Suspense>
 *     </PluginErrorBoundary>
 *   )
 */
export function PluginErrorBoundary({ pluginId, children }: Props) {
  return <ErrorBoundary pluginId={pluginId}>{children}</ErrorBoundary>
}

/**
 * HOC variant — wraps a component class or function with a plugin error boundary.
 * Useful when registering widget components that can't use JSX directly.
 *
 * Usage:
 *   const SafeWidget = withPluginErrorBoundary(MyWidget, 'my-plugin')
 */
export function withPluginErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  pluginId: string,
) {
  const Wrapper = (props: P) => (
    <ErrorBoundary pluginId={pluginId}>
      <Component {...props} />
    </ErrorBoundary>
  )
  Wrapper.displayName = `PluginBoundary(${Component.displayName ?? Component.name})`
  return Wrapper
}
