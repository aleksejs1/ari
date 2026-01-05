import type { Control } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import type { NotificationChannel, NotificationPolicyFormValues } from '@/types/models'

export const ChannelItem = ({
  channel,
  control,
  name,
}: {
  channel: NotificationChannel
  control: Control<NotificationPolicyFormValues>
  name: `schedule.${number}.channels`
}) => {
  if (!channel) {
    return null
  }
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value?.includes(channel['@id'] || '')}
                onCheckedChange={(checked) => {
                  return checked
                    ? field.onChange([...(field.value || []), channel['@id'] || ''])
                    : field.onChange(
                        (field.value || []).filter((value: string) => value !== channel['@id']),
                      )
                }}
              />
            </FormControl>
            <FormLabel className="font-normal">
              {channel.type} - {channel.config?.chatId}
            </FormLabel>
          </FormItem>
        )
      }}
    />
  )
}
