import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ContactFormValues } from '@/types/models'

import { TypeAutocomplete } from './TypeAutocomplete' // Reusing generic type autocomplete for date label?

export function ContactModalDates() {
  const { t } = useTranslation()
  const { control } = useFormContext<ContactFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactDates',
  })

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="group flex items-start gap-2">
          {/* Date Input */}
          <FormField
            control={control}
            name={`contactDates.${index}.date`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  {/* Using text type for date to allow partial dates or native date picker? 
                       Project has `DateInput.tsx`? Let's check or use simple Input type="date"
                       Model says string or Date. 
                       Existing form used specific component probably?
                   */}
                  <Input
                    type="date"
                    placeholder={t('contacts.date')}
                    {...field}
                    value={String(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Label (Birthday, Anniversary etc) */}
          <FormField
            control={control}
            name={`contactDates.${index}.text`}
            render={({ field }) => (
              <FormItem className="w-[120px]">
                <FormControl>
                  <TypeAutocomplete
                    field="dateTypes" // "Birthday", "Anniversary", etc.
                    placeholder={t('contacts.label')}
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
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start pl-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={() => append({ text: 'Birthday', date: '' })}
      >
        <Plus className="mr-2 h-4 w-4" /> {t('contacts.addDate')}
      </Button>
    </div>
  )
}
