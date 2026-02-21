import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ContactFormValues } from '@/types/models'

import { TypeAutocomplete } from './TypeAutocomplete'

export function ContactModalPhones() {
  const { t } = useTranslation('contacts')
  const { control } = useFormContext<ContactFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phoneNumbers',
  })

  // Ensure there's always at least one empty field if list is empty?
  // Logic from requirements: "Default ... then phone, then button to add next phone"
  // So we handle dynamic list.

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="group flex items-center gap-2">
          <FormField
            control={control}
            name={`phoneNumbers.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={t('phone')} {...field} data-testid="contact-phone-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`phoneNumbers.${index}.type`}
            render={({ field }) => (
              <FormItem className="w-[120px]">
                <FormControl>
                  {/* Reusing TypeAutocomplete but might need styling tweaks */}
                  <TypeAutocomplete
                    field="phoneTypes"
                    placeholder={t('type')} // "Label" in Google
                    className="h-9 border-none px-0 shadow-none focus-visible:ring-0" // Inline style look?
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
            className="w-8 opacity-0 transition-opacity group-hover:opacity-100"
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
        onClick={() => append({ value: '', type: 'Mobile' })}
      >
        <Plus className="mr-2 h-4 w-4" /> {t('addPhone')}
      </Button>
    </div>
  )
}
