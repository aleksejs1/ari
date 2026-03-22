/**
 * Monitoring service abstraction.
 *
 * Currently logs to console. Replace the body of `captureException` with a
 * real integration (Sentry, Datadog, etc.) when a monitoring backend is
 * available. The call sites — `ErrorBoundary.componentDidCatch` and any
 * future error paths — must not be changed when switching the backend.
 *
 * Usage:
 *   import { monitoringService } from '@/lib/monitoring'
 *   monitoringService.captureException(error, { tags: { pluginId: 'contacts' } })
 */

interface CaptureContext {
  tags?: Record<string, string>
  extra?: Record<string, unknown>
}

function captureException(error: Error, context: CaptureContext = {}): void {
  // Replace with a real monitoring integration (Sentry, Datadog, etc.) when a backend is available.
  console.error('[monitoring] captureException', error, context)
}

export const monitoringService = { captureException }
