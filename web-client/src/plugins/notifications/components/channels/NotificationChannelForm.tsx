import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { type NotificationChannelFormValues } from '@/types/models'

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

  const notificationChannelSchema = z.object({
    id: z.number().optional(),
    type: z.enum(['telegram', 'web', 'email']),
    config: z
      .object({
        botToken: z.string().optional(),
        chatId: z.string().optional(),
        email: z.string().optional(),
        mapping: z.string().optional(),
      })
      .optional()
      .nullable(),
  })

  const form = useForm<NotificationChannelFormValues>({
    resolver: zodResolver(notificationChannelSchema),
    defaultValues: defaultValues ?? {
      type: 'telegram',
      config: {
        botToken: '',
        chatId: '',
      },
    },
  })

  const selectedType = useWatch({
    control: form.control,
    name: 'type',
  })

  const handleSubmit = (data: NotificationChannelFormValues) => {
    const cleanedData = { ...data }
    if (cleanedData.config) {
      if (cleanedData.type === 'email') {
        const { email } = cleanedData.config
        cleanedData.config = { email }
      } else if (cleanedData.type === 'telegram') {
        const { botToken, chatId, mapping } = cleanedData.config
        cleanedData.config = { botToken, chatId, mapping }
      } else if (cleanedData.type === 'web') {
        cleanedData.config = {}
      }
    }
    onSubmit(cleanedData)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        aria-label="notification-channel-form"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="type-select">{t('notificationChannels.type')}</FormLabel>
              <FormControl>
                <select
                  {...field}
                  id="type-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="telegram">Telegram</option>
                  <option value="web">Web</option>
                  <option value="email">Email</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === 'email' && (
          <FormField
            control={form.control}
            name="config.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('notificationChannels.email')}</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    value={field.value ?? ''}
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  )
}
