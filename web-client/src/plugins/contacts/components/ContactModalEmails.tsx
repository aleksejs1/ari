import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ContactFormValues } from '@/types/models'

import { TypeAutocomplete } from './TypeAutocomplete'

export function ContactModalEmails() {
  const { t } = useTranslation()
  const { control } = useFormContext<ContactFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactEmailAdresses',
  })

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="group flex items-start gap-2">
          <FormField
            control={control}
            name={`contactEmailAdresses.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={t('contacts.email')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`contactEmailAdresses.${index}.type`}
            render={({ field }) => (
              <FormItem className="w-[120px]">
                <FormControl>
                  <TypeAutocomplete
                    field="emailTypes"
                    placeholder={t('contacts.type')}
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
        onClick={() => append({ value: '', type: 'Personal' })}
      >
        <Plus className="mr-2 h-4 w-4" /> {t('contacts.addEmail')}
      </Button>
    </div>
  )
}
