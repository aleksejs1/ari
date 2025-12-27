import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NotificationChannelForm } from './components/NotificationChannelForm'
import { NotificationChannelsTable } from './components/NotificationChannelsTable'
import {
  useNotificationChannels,
  useCreateNotificationChannel,
  useUpdateNotificationChannel,
  useDeleteNotificationChannel,
} from './useNotificationChannels'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type NotificationChannel, type NotificationChannelFormValues } from '@/types/models'

export default function NotificationChannelsPage() {
  const { t } = useTranslation()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<NotificationChannel | null>(null)

  const { data, isLoading, error } = useNotificationChannels()
  const createMutation = useCreateNotificationChannel()
  const updateMutation = useUpdateNotificationChannel()
  const deleteMutation = useDeleteNotificationChannel()

  const handleCreate = () => {
    setEditingChannel(null)
    setIsSheetOpen(true)
  }

  const handleEdit = (channel: NotificationChannel) => {
    setEditingChannel(channel)
    setIsSheetOpen(true)
  }

  const handleDelete = async (channel: NotificationChannel) => {
    if (
      window.confirm(
        t('notificationChannels.deleteConfirm', 'Are you sure you want to delete this channel?'),
      )
    ) {
      try {
        await deleteMutation.mutateAsync(channel['@id'])
      } catch (err) {
        console.error('Failed to delete channel:', err)
      }
    }
  }

  const handleSubmit = async (values: NotificationChannelFormValues) => {
    try {
      if (editingChannel) {
        await updateMutation.mutateAsync({
          id: editingChannel['@id'],
          data: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      setIsSheetOpen(false)
    } catch (err) {
      console.error('Failed to save channel:', err)
    }
  }

  if (isLoading) return <div>{t('app.loading')}</div>
  if (error) return <div>{t('notificationChannels.error', 'Error loading channels.')}</div>

  const channels = data?.['member'] || data?.member || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('notificationChannels.title', 'Notification Channels')}
          </h1>
          <p className="text-muted-foreground">
            {t('notificationChannels.description', 'Manage how you receive notifications.')}
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('notificationChannels.add', 'Add Channel')}
        </Button>
      </div>

      <NotificationChannelsTable data={channels} onEdit={handleEdit} onDelete={handleDelete} />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {editingChannel
                ? t('notificationChannels.edit', 'Edit Channel')
                : t('notificationChannels.add', 'Add Channel')}
            </SheetTitle>
            <SheetDescription>
              {t(
                'notificationChannels.formDescription',
                'Fill in the details below to configure your notification channel.',
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <NotificationChannelForm
              defaultValues={
                editingChannel
                  ? {
                      type: 'telegram',
                      config: editingChannel.config as { botToken: string; chatId: string },
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
