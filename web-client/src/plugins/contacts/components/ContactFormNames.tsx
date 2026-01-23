import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CollapsibleSection } from './CollapsibleSection'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ContactFormValues } from '@/types/models'

export function ContactFormNames() {
  const { t } = useTranslation()
  const { control } = useFormContext<ContactFormValues>()
  const [isOpen, setIsOpen] = useState(true)

  const {
    fields: nameFields,
    append: appendName,
    remove: removeName,
  } = useFieldArray({
    control,
    name: 'contactNames',
  })

  return (
    <CollapsibleSection
      title={t('contacts.names')}
      open={isOpen}
      onOpenChange={setIsOpen}
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            appendName({ given: '', family: '' })
            setIsOpen(true)
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> {t('contacts.addName')}
        </Button>
      }
    >
      <div className="space-y-2">
        {nameFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`contactNames.${index}.given`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={t('contacts.givenName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`contactNames.${index}.family`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={t('contacts.familyName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeName(index)}
              disabled={nameFields.length === 1}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
