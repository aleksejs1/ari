import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { useContactGraph } from '../api/useContactGraph'

import { ContactGraph } from './ContactGraph'

interface ContactGraphWidgetProps {
  contactId: string
}

export const ContactGraphWidget = ({ contactId }: ContactGraphWidgetProps) => {
  const { t } = useTranslation()
  const { data, isLoading, error } = useContactGraph({ contactId, level: 2 })

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('common.error')}</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    )
  }

  if (!data || data.nodes.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed text-gray-500">
        {t('contactGraph.noConnections', 'No connections found')}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[300px] overflow-hidden rounded-lg border shadow-sm dark:border-gray-800">
        <ContactGraph data={data} />
      </div>
      <div className="flex justify-end">
        <Button variant="link" asChild className="h-auto p-0 text-xs text-muted-foreground">
          <Link to={`/contact-graph?focus=${contactId}`}>
            {t('contactGraph.viewFullGraph', 'View Full Graph')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
