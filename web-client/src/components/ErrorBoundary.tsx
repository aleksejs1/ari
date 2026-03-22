import { Component, type ErrorInfo, type ReactElement, type ReactNode } from 'react'
import i18next from 'i18next'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { monitoringService } from '@/lib/monitoring'

interface Props {
  children: ReactNode
  /** Plugin ID used as a tag in monitoring reports. Defaults to 'core'. */
  pluginId?: string
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    monitoringService.captureException(error, {
      tags: { pluginId: this.props.pluginId ?? 'core' },
      extra: { componentStack: info.componentStack ?? '' },
    })
  }

  override render(): ReactElement {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          <p className="text-sm font-medium">
            {i18next.t('app.errorBoundary.message', 'Something went wrong.')}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {i18next.t('app.errorBoundary.reload', 'Reload page')}
          </Button>
        </div>
      )
    }
    return <>{this.props.children}</>
  }
}
