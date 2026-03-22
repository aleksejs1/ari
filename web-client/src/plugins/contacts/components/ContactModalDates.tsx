import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RepeatingSection } from '@/components/ui/RepeatingSection'
import type { ContactFormValues } from '@/types/models'

import { TypeAutocomplete } from './TypeAutocomplete'

export function ContactModalDates() {
  const { t } = useTranslation('contacts')
  const { control } = useFormContext<ContactFormValues>()

  return (
    <RepeatingSection
      control={control}
      name="contactDates"
      addLabel={t('addDate')}
      defaultValue={{ text: 'Birthday', date: '' }}
      renderRow={(field, index, onRemove) => (
        <div key={field.id} className="group flex items-start gap-2">
          <FormField
            control={control}
            name={`contactDates.${index}.date`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="date"
                    placeholder={t('date')}
                    {...field}
                    value={String(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`contactDates.${index}.text`}
            render={({ field }) => (
              <FormItem className="w-[120px]">
                <FormControl>
                  <TypeAutocomplete
                    field="dateTypes"
                    placeholder={t('label')}
                    className="h-9 border-none px-0 shadow-none focus-visible:ring-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={onRemove}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      )}
    />
  )
}
