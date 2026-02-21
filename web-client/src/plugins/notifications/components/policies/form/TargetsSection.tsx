import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Contact, Group, NotificationPolicyFormValues } from '@/types/models'

interface TargetsSectionProps {
  groups: Group[]
  contacts: Contact[]
}

export const TargetsSection = ({ groups, contacts }: TargetsSectionProps) => {
  const { t } = useTranslation()
  const form = useFormContext<NotificationPolicyFormValues>()
  const selectedType = form.watch('targets.type')
  const selectedIds = form.watch('targets.ids') || []

  const handleToggleId = (id: string) => {
    const currentIds = form.getValues('targets.ids') || []
    if (currentIds.includes(id)) {
      form.setValue(
        'targets.ids',
        currentIds.filter((i) => i !== id),
        { shouldValidate: true },
      )
    } else {
      form.setValue('targets.ids', [...currentIds, id], { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('notification_policies.targets', 'Targets')}</h3>

      <FormField
        control={form.control}
        name="targets.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('notification_policies.type', 'Type')}</FormLabel>
            <FormControl>
              <div className="flex gap-4">
                {['all', 'group', 'contact'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      data-testid={`target-type-${type}`}
                      checked={field.value === type}
                      onCheckedChange={() => {
                        field.onChange(type)
                        form.setValue('targets.ids', []) // Reset ids on type change
                      }}
                      className="rounded-full" // Make it look like radio
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t(`notification_policies.types.${type}`, type)}
                    </label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedType !== 'all' && (
        <FormField
          control={form.control}
          name="targets.ids"
          render={() => (
            <FormItem>
              <FormLabel>
                {selectedType === 'group'
                  ? t('common.groups', 'Groups')
                  : t('common.contacts', 'Contacts')}
              </FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedIds.map((id) => {
                      const item =
                        selectedType === 'group'
                          ? groups.find((g) => g['@id'] === id)
                          : contacts.find((c) => c['@id'] === id)
                      const label =
                        (item as Group)?.name ||
                        (item as Contact)?.displayName ||
                        (item as Contact)?.contactNames?.[0]?.given ||
                        id
                      return (
                        <Badge key={id} variant="secondary" className="pr-1">
                          {label}
                          <button
                            type="button"
                            className="ml-1 hover:text-destructive"
                            onClick={() => handleToggleId(id)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {t('common.select', 'Select...')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <div className="max-h-[300px] overflow-y-auto p-1">
                        {(selectedType === 'group' ? groups : contacts).map((item) => {
                          const id = item['@id'] || ''
                          const label =
                            (item as Group).name ||
                            (item as Contact).displayName ||
                            (item as Contact).contactNames?.[0]?.given ||
                            id
                          const isSelected = selectedIds.includes(id)
                          return (
                            <button
                              type="button"
                              key={id}
                              className={cn(
                                'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                                isSelected && 'bg-accent text-accent-foreground',
                              )}
                              onClick={() => handleToggleId(id)}
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
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
