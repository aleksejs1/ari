import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { NotificationPolicyFormValues } from '@/types/models'

import { useNotificationPolicyEventTypes } from '../../../hooks/useNotificationPolicies'

export const EventTypesSection = () => {
  const { t } = useTranslation()
  const form = useFormContext<NotificationPolicyFormValues>()
  const { data: eventTypesSuggestions } = useNotificationPolicyEventTypes()
  const selectedEventTypes = form.watch('eventTypes') || []

  const handleToggleEventType = (et: string) => {
    const current = form.getValues('eventTypes') || []
    if (current.includes(et)) {
      form.setValue(
        'eventTypes',
        current.filter((item) => item !== et),
        { shouldValidate: true },
      )
    } else {
      form.setValue('eventTypes', [...current, et], { shouldValidate: true })
    }
  }

  const handleAddCustom = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const value = e.currentTarget.value.trim()
      if (value && !selectedEventTypes.includes(value)) {
        form.setValue('eventTypes', [...selectedEventTypes, value], { shouldValidate: true })
        e.currentTarget.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('notification_policies.events', 'Event Types')}</h3>
      <FormField
        control={form.control}
        name="eventTypes"
        render={() => (
          <FormItem>
            <FormLabel>{t('notification_policies.event_type', 'Event Type')}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedEventTypes.length > 0 ? (
                    selectedEventTypes.map((et) => (
                      <Badge key={et} variant="secondary" className="pr-1">
                        {et}
                        <button
                          type="button"
                          className="ml-1 hover:text-destructive"
                          onClick={() => handleToggleEventType(et)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm italic text-muted-foreground">
                      {t('notification_policies.all_events', 'All events')}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                      >
                        {t('common.select', 'Select...')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <div className="max-h-[300px] overflow-y-auto p-1">
                        {(eventTypesSuggestions || []).map((et) => {
                          const isSelected = selectedEventTypes.includes(et)
                          return (
                            <button
                              type="button"
                              key={et}
                              className={cn(
                                'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                                isSelected && 'bg-accent text-accent-foreground',
                              )}
                              onClick={() => handleToggleEventType(et)}
                            >
                              <div
                                className={cn(
                                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                  isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'opacity-50 [&_svg]:invisible',
                                )}
                              >
                                <Check className={cn('h-4 w-4')} />
                              </div>
                              {et}
                            </button>
                          )
                        })}
                        {(eventTypesSuggestions || []).length === 0 && (
                          <div className="p-2 text-sm text-muted-foreground">
                            {t('common.noResults', 'No suggestions')}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Input
                    placeholder={t('notification_policies.add_custom_event', 'Add custom...')}
                    onKeyDown={handleAddCustom}
                    className="flex-1"
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
