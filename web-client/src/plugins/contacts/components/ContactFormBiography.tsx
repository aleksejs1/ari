import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { type ContactFormValues } from '@/types/models'

import { CollapsibleSection } from './CollapsibleSection'
import { TypeAutocomplete } from './TypeAutocomplete'

export function ContactFormBiography() {
  const { t } = useTranslation('contacts')
  const { control } = useFormContext<ContactFormValues>()
  const [isOpen, setIsOpen] = useState(false)

  const {
    fields: biographyFields,
    append: appendBiography,
    remove: removeBiography,
  } = useFieldArray({
    control,
    name: 'contactBiographies',
  })

  return (
    <CollapsibleSection
      title={t('biography')}
      open={isOpen}
      onOpenChange={setIsOpen}
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            appendBiography({ value: '', type: 'Bio' })
            setIsOpen(true)
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> {t('addBiography')}
        </Button>
      }
    >
      <div className="space-y-4">
        {biographyFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`contactBiographies.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder={t('biographyPlaceholder')}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`contactBiographies.${index}.type`}
              render={({ field }) => (
                <FormItem className="w-[150px]">
                  <FormControl>
                    <TypeAutocomplete
                      field="biographyTypes"
                      placeholder={t('typePlaceholder')}
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
              onClick={() => removeBiography(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
