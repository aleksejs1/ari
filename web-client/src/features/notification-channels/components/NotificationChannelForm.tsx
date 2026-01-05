import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
import { Input } from '@/components/ui/input'
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

  const notificationChannelSchema = React.useMemo(
    () =>
      z
        .object({
          id: z.number().optional(),
          type: z.enum(['telegram', 'web']),
          config: z
            .object({
              botToken: z.string().optional(),
              chatId: z.string().optional(),
            })
            .optional()
            .nullable(),
        })
        .superRefine((data, ctx) => {
          if (data.type === 'telegram') {
            if (!data.config?.botToken) {
              ctx.addIssue({
                code: 'custom',
                message: t('validation.botTokenRequired'),
                path: ['config', 'botToken'],
              })
            }
            if (!data.config?.chatId) {
              ctx.addIssue({
                code: 'custom',
                message: t('validation.chatIdRequired'),
                path: ['config', 'chatId'],
              })
            }
          }
        }),
    [t],
  )

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
              <FormLabel htmlFor="type-select">{t('notificationChannels.type')}</FormLabel>
              <FormControl>
                <select
                  {...field}
                  id="type-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="telegram">Telegram</option>
                  <option value="web">Web</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === 'telegram' && (
          <>
            <FormField
              control={form.control}
              name="config.botToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="bot-token">{t('notificationChannels.botToken')}</FormLabel>
                  <FormControl>
                    <Input
                      id="bot-token"
                      placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                      {...field}
                      value={(field.value as string) || ''}
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
                  <FormLabel htmlFor="chat-id">{t('notificationChannels.chatId')}</FormLabel>
                  <FormControl>
                    <Input
                      id="chat-id"
                      placeholder="-123456789"
                      {...field}
                      value={(field.value as string) || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  )
}
