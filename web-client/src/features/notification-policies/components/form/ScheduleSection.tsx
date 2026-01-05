import { subDays } from 'date-fns'
import { Plus, X } from 'lucide-react'
import { useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ChannelItem } from './ChannelItem'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import type { NotificationChannel, NotificationPolicyFormValues } from '@/types/models'

const SchedulePreview = () => {
  const { t } = useTranslation()
  const { formatDate } = useUserPrefs()
  const form = useFormContext<NotificationPolicyFormValues>()
  const schedules = form.watch('schedule') || []

  const sampleDate = useMemo(() => new Date(2027, 0, 5), []) // 05.01.2027

  if (schedules.length === 0) {
    return null
  }

  return (
    <div className="rounded-md bg-muted p-4 text-sm">
      <h4 className="mb-2 font-medium">{t('notification_policies.preview', 'Sample Schedule')}</h4>
      <p className="mb-2 text-muted-foreground">
        {t('notification_policies.preview_description', { date: formatDate(sampleDate) })}
      </p>
      <ul className="list-inside list-disc space-y-1">
        {schedules.map((sch, index) => {
          const date = subDays(sampleDate, sch.offsetDays || 0)
          return (
            <li key={index}>
              {formatDate(date)} {t('notification_policies.at', 'at')} {sch.time || '00:00'}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

interface ScheduleSectionProps {
  channels: NotificationChannel[]
}

export const ScheduleSection = ({ channels }: ScheduleSectionProps) => {
  const { t } = useTranslation()
  const form = useFormContext<NotificationPolicyFormValues>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedule',
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('notification_policies.schedule', 'Schedule')}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ offsetDays: 0, time: '09:00', channels: [] })}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('notification_policies.add_schedule', 'Add Schedule')}
        </Button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-destructive"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`schedule.${index}.offsetDays`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('notification_policies.offset_days', 'Days Before')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`schedule.${index}.time`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('notification_policies.time', 'Time')}</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name={`schedule.${index}.channels`}
                  render={() => (
                    <FormItem>
                      <FormLabel>{t('notification_policies.channels', 'Channels')}</FormLabel>
                      <div className="grid grid-cols-2 gap-2 rounded-md border p-4">
                        {(channels || []).filter(Boolean).map((channel) => (
                          <ChannelItem
                            key={channel.id}
                            channel={channel}
                            control={form.control}
                            name={`schedule.${index}.channels`}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SchedulePreview />
    </div>
  )
}
