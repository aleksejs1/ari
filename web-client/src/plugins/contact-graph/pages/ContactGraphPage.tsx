import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useContactGraph } from '../api/useContactGraph'
import { ContactGraph } from '../components/ContactGraph'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ContactGraphPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useContactGraph()

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('contactGraph.title')}</h1>
      </div>
      <div className="min-h-0 flex-1">{data ? <ContactGraph data={data} /> : null}</div>
    </div>
  )
}
