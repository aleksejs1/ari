import { Bell, Trash2, Plus } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import type { NotificationChannel, NotificationSubscription } from '@/types/models'

interface NotificationSubscriptionsProps {
  entityType: string
  entityId: number
}

export function NotificationSubscriptions({
  entityType,
  entityId,
}: NotificationSubscriptionsProps) {
  const { t } = useTranslation()
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>([])
  const [channels, setChannels] = useState<NotificationChannel[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [subsRes, channelsRes] = await Promise.all([
        api.get('/notification_subscriptions', {
          params: {
            entityType,
            entityId,
          },
        }),
        api.get('/notification_channels'),
      ])
      setSubscriptions(subsRes.data['member'] || [])
      setChannels(channelsRes.data['member'] || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [entityType, entityId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAdd = async (channelId: string) => {
    try {
      await api.post('/notification_subscriptions', {
        entityType,
        entityId,
        channel: channelId,
        enabled: 1,
      })
      fetchData()
    } catch (error) {
      console.error('Error adding subscription:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/notification_subscriptions/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting subscription:', error)
    }
  }

  if (loading) {
    return <div className="text-xs italic text-gray-500">{t('app.loading')}</div>
  }

  return (
    <div className="mt-2 border-l-2 border-gray-100 pl-4">
      <div className="mb-2 flex flex-col gap-2">
        <h4 className="text-xs font-medium uppercase tracking-wider text-gray-600">
          {t('contacts.subscriptions')}
        </h4>
        <div className="flex flex-wrap gap-1">
          {channels.map((channel) => (
            <Button
              key={channel['@id']}
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => channel['@id'] && handleAdd(channel['@id'])}
            >
              <Plus className="mr-1 h-3 w-3" />
              {t('contacts.addSubscription')} ({channel.type})
            </Button>
          ))}
          {channels.length === 0 && (
            <p className="text-[10px] italic text-gray-400">
              {t('notificationChannels.noChannels', 'No channels available')}
            </p>
          )}
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <p className="text-xs italic text-gray-400">{t('contacts.noSubscriptions')}</p>
      ) : (
        <div className="space-y-1">
          {subscriptions.map((sub) => {
            // Extract channel info from sub if available
            // In API Platform, sub.channel might be an IRI or the full object depending on normalization
            const subChannelIri =
              typeof sub.channel === 'string' ? sub.channel : sub.channel?.['@id']
            const channelInfo = subChannelIri
              ? channels.find((c) => c['@id'] === subChannelIri)?.type
              : null

            return (
              <div key={sub.id} className="group flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-600">
                  <Bell className="mr-2 h-3 w-3 text-blue-500" />
                  <span>
                    ID: {sub.id} {channelInfo && `(${channelInfo})`}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => sub.id && handleDelete(sub.id)}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
