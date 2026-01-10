import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CollapsibleSection } from './CollapsibleSection'
import { ContactAutocomplete } from './ContactAutocomplete'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ContactFormValues, PREDEFINED_RELATIONS } from '@/types/models'

export function ContactFormRelations() {
  const { t } = useTranslation()
  const { control, getValues } = useFormContext<ContactFormValues>()
  const [isOpen, setIsOpen] = useState(false)
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactRelations',
  })

  return (
    <CollapsibleSection
      title={t('contacts.relations')}
      open={isOpen}
      onOpenChange={setIsOpen}
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            append({ relatedContact: '', type: '', displayName: '' })
            setIsOpen(true)
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> {t('contacts.addRelation')}
        </Button>
      }
    >
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1 space-y-2">
              <FormField
                control={control}
                name={`contactRelations.${index}.relatedContact`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormControl>
                      <ContactAutocomplete
                        value={formField.value as any}
                        onChange={formField.onChange}
                        initialLabel={getValues(`contactRelations.${index}.displayName`)}
                      // exclude contact itself? need ID from context or something, but form values might have it
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 space-y-2">
              <FormField
                control={control}
                name={`contactRelations.${index}.type`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...formField}
                          placeholder={t('contacts.relationTypePlaceholder')}
                          className="pr-8" // Make space for eventual clear button or similar if needed but simple input is fine
                          list={`relation-types-${index}`}
                        />
                        <datalist id={`relation-types-${index}`}>
                          {PREDEFINED_RELATIONS.map((type) => (
                            <option key={type} value={type}>
                              {t(`contacts.relationTypes.${type}`)}
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-2 shrink-0 sm:mt-0"
              onClick={() => remove(index)}
              aria-label={t('common.delete')}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
