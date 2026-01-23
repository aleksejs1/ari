import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'

import { useMarkAsRead, useNotifications } from '@/features/activity-feed/useNotifications'

import { NotificationItem } from './NotificationItem'

export function NotificationList() {
  const { t } = useTranslation()
  const { data: notifications, isLoading, isError } = useNotifications()
  const { mutate: markAsRead } = useMarkAsRead()

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-sm text-destructive">
        {t('notifications.errorLoading', 'Failed to load notifications')}
      </div>
    )
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t('notifications.empty', 'No notifications')}
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="flex flex-col">
        {notifications.map((item) => (
          <NotificationItem
            key={item.id ?? item['@id']} // Use ID, fallback to IRI
            item={item}
            onRead={(id) => markAsRead(id)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
