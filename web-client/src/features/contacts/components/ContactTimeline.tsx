import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/lib/axios' // Verify if it exports 'api' or default
import { type ContactTimeline, type TimelineEvent } from '@/types/models' // We need to verify where this type is/define it

// Temporary mock type if generated types are not sufficient yet
// based on: /api/contacts/{id}/timeline
// and AuditLog schema

// Helper to format change values, handling DateTime objects from API
const formatChangeValue = (val: unknown): string => {
  if (val === null || val === undefined) return ''

  if (typeof val === 'object') {
    // Audit logs often return [old, new] array for updates
    if (Array.isArray(val)) {
      return val.map(formatChangeValue).join(' → ')
    }

    // Check for DateTime object structure
    const valid = val as Record<string, unknown>
    if (valid.date && typeof valid.date === 'string') {
      try {
        return format(new Date(valid.date), 'PPP')
      } catch {
        return valid.date
      }
    }

    return JSON.stringify(val)
  }

  return String(val)
}

interface ContactTimelineProps {
  contactId: string
}

export function ContactTimeline({ contactId }: ContactTimelineProps) {
  const { t } = useTranslation()

  const {
    data: timeline,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contact', contactId, 'timeline'],
    queryFn: async () => {
      // Using fetch directly as fallback if client abstraction doesn't support this yet
      // Adjust based on actual project API usage patterns
      const res = await api.get<ContactTimeline>(`/contacts/${contactId}/timeline`)
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 text-center">
        {t('errors.failedToLoadTimeline', 'Failed to load history')}
      </div>
    )
  }

  // Assuming structure based on API response
  const logs = Array.isArray(timeline?.logs) ? timeline.logs : []

  if (logs.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        {t('contacts.noHistory', 'No history available')}
      </div>
    )
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-sm font-medium mb-3">{t('contacts.timeline', 'Activity History')}</h3>
      <div className="h-[300px] pr-4 overflow-y-auto">
        <div className="relative border-l border-gray-200 ml-2 space-y-6 pb-4">
          {logs.map(
            (
              log: TimelineEvent, // Replace 'any' with proper type
            ) => (
              <div key={log.id} className="mb-6 ml-4 relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">
                    {format(new Date(log.createdAt), 'PPP p')}
                  </span>
                  <p className="text-sm font-medium text-gray-900">
                    {log.action} {log.entityType}
                  </p>
                  {/* Basic rendering of changes */}
                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-1">
                      {Object.entries(log.changes as Record<string, unknown>).map(([key, val]) => (
                        <div key={key}>
                          <span className="font-semibold">{key}:</span> {formatChangeValue(val)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
