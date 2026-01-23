import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ContactFormValues } from '@/types/models'

import { CollapsibleSection } from './CollapsibleSection'
import { TypeAutocomplete } from './TypeAutocomplete'

export function ContactFormPhone() {
  const { t } = useTranslation()
  const { control } = useFormContext<ContactFormValues>()
  const [isOpen, setIsOpen] = useState(true)

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: 'phoneNumbers',
  })

  return (
    <CollapsibleSection
      title={t('contacts.phoneNumbers')}
      open={isOpen}
      onOpenChange={setIsOpen}
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            appendPhone({ value: '', type: 'Mobile' })
            setIsOpen(true)
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> {t('contacts.addPhoneNumber')}
        </Button>
      }
    >
      <div className="space-y-2">
        {phoneFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`phoneNumbers.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={t('contacts.phoneNumber')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`phoneNumbers.${index}.type`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <TypeAutocomplete
                      field="phoneTypes"
                      placeholder={t('contacts.phoneTypePlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
