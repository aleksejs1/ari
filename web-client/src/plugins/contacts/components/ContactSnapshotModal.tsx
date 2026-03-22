import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'
import { formatLocalizedDateTime } from '@/lib/utils'

interface ContactSnapshotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactId: string
  logId: number
  logDate: string
}

interface SnapshotResponse {
  snapshot: Record<string, unknown>
}

function SnapshotContent({
  isLoading,
  error,
  snapshot,
  emptyLabel,
  errorLabel,
}: {
  isLoading: boolean
  error: Error | null
  snapshot: Record<string, unknown> | undefined
  emptyLabel: string
  errorLabel: string
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-center text-sm text-red-500">{errorLabel}</div>
  }

  if (snapshot) {
    return (
      <pre className="max-h-[60vh] overflow-auto rounded bg-gray-50 p-4 text-xs leading-relaxed text-gray-800">
        {JSON.stringify(snapshot, null, 2)}
      </pre>
    )
  }

  return <div className="p-4 text-center text-sm text-gray-500">{emptyLabel}</div>
}

export function ContactSnapshotModal({
  open,
  onOpenChange,
  contactId,
  logId,
  logDate,
}: ContactSnapshotModalProps) {
  const { t, i18n } = useTranslation('contacts')

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.contacts.snapshot(contactId, logId),
    queryFn: async () => {
      const res = await api.get<SnapshotResponse>(`/contacts/${contactId}/snapshot/${logId}`)
      return res.data
    },
    enabled: open,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {t('history.snapshotTitle', { date: formatLocalizedDateTime(logDate, i18n.language) })}
          </DialogTitle>
          <DialogDescription className="sr-only">{t('history.viewSnapshot')}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto">
          <SnapshotContent
            isLoading={isLoading}
            error={error}
            snapshot={data?.snapshot}
            emptyLabel={t('history.snapshotEmpty')}
            errorLabel={t('history.snapshotError')}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
