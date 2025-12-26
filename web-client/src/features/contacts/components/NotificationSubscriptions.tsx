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
  }, [entityType, entityId])

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
    return <div className="text-xs text-gray-500 italic">{t('app.loading')}</div>
  }

  return (
    <div className="mt-2 pl-4 border-l-2 border-gray-100">
      <div className="flex flex-col gap-2 mb-2">
        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider">
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
              <Plus className="w-3 h-3 mr-1" />
              {t('contacts.addSubscription')} ({channel.type})
            </Button>
          ))}
          {channels.length === 0 && (
            <p className="text-[10px] text-gray-400 italic">
              {t('notificationChannels.noChannels', 'No channels available')}
            </p>
          )}
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <p className="text-xs text-gray-400 italic">{t('contacts.noSubscriptions')}</p>
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
              <div key={sub.id} className="flex items-center justify-between group">
                <div className="flex items-center text-xs text-gray-600">
                  <Bell className="w-3 h-3 mr-2 text-blue-500" />
                  <span>
                    ID: {sub.id} {channelInfo && `(${channelInfo})`}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => sub.id && handleDelete(sub.id)}
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
