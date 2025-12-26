import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { notificationChannelSchema, type NotificationChannelFormValues } from '@/types/models'

interface NotificationChannelFormProps {
  defaultValues?: NotificationChannelFormValues
  onSubmit: (data: NotificationChannelFormValues) => void
  isSubmitting?: boolean
}

export function NotificationChannelForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: NotificationChannelFormProps) {
  const { t } = useTranslation()
  const form = useForm<NotificationChannelFormValues>({
    resolver: zodResolver(notificationChannelSchema),
    defaultValues: defaultValues || {
      type: 'telegram',
      config: {
        botToken: '',
        chatId: '',
      },
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        aria-label="notification-channel-form"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="type-select">{t('notificationChannels.type', 'Type')}</FormLabel>
              <FormControl>
                <select
                  {...field}
                  id="type-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="telegram">Telegram</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="config.botToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="bot-token">
                {t('notificationChannels.botToken', 'Bot Token')}
              </FormLabel>
              <FormControl>
                <Input
                  id="bot-token"
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="config.chatId"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="chat-id">{t('notificationChannels.chatId', 'Chat ID')}</FormLabel>
              <FormControl>
                <Input id="chat-id" placeholder="-123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
        </Button>
      </form>
    </Form>
  )
}
