import { useTranslation } from 'react-i18next'
import { formatDistanceToNow } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'
import { Mail, MailOpen } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ActivityFeed } from '@/types/models'

interface NotificationItemProps {
  item: ActivityFeed
  onRead: (id: number) => void
}

export function NotificationItem({ item, onRead }: NotificationItemProps) {
  const { i18n } = useTranslation()
  const isUnread = !item.isRead

  return (
    <button
      type="button"
      className={cn(
        'flex w-full cursor-pointer items-start gap-3 border-b p-3 text-left transition-colors hover:bg-muted/50',
        isUnread ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'bg-background',
      )}
      onClick={() => {
        if (isUnread && item.id) {
          onRead(item.id)
        }
      }}
    >
      <div className={cn('mt-1', isUnread ? 'text-blue-500' : 'text-gray-400')}>
        {isUnread ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-1">
        <p className={cn('text-sm font-medium leading-none', isUnread && 'font-semibold')}>
          {item.title}
        </p>
        <p className="text-sm text-muted-foreground">{item.message}</p>
        {!!item.createdAt && (
          <p className="text-xs text-muted-foreground/60">
            {formatDistanceToNow(new Date(item.createdAt), {
              addSuffix: true,
              locale: i18n.language === 'ru' ? ru : enUS,
            })}
          </p>
        )}
      </div>
      {isUnread ? <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" title="Unread" /> : null}
    </button>
  )
}
