import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ContactFormValues } from '@/types/models'

import { CollapsibleSection } from './CollapsibleSection'

const LOCALE_OPTIONS = ['ru', 'lv', 'en', 'de', 'fr', 'lt', 'et', 'pl', 'uk']

export function ContactFormNames() {
  const { t } = useTranslation('contacts')
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
      title={t('names')}
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
          <Plus className="mr-1 h-4 w-4" /> {t('addName')}
        </Button>
      }
    >
      <div className="space-y-3">
        {nameFields.map((field, index) => (
          <div key={field.id} className="space-y-2 rounded-md border p-2">
            <div className="flex items-start gap-2">
              <FormField
                control={control}
                name={`contactNames.${index}.given`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={t('givenName')} {...field} />
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
                      <Input placeholder={t('familyName')} {...field} />
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
            <div className="flex items-start gap-2">
              <FormField
                control={control}
                name={`contactNames.${index}.nameType`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder={t('contactName.nameTypePlaceholder')}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`contactNames.${index}.locale`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <select
                        {...field}
                        value={field.value ?? ''}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">{t('contactName.localePlaceholder')}</option>
                        {LOCALE_OPTIONS.map((code) => (
                          <option key={code} value={code}>
                            {t(`contactName.localeOptions.${code}`, code)}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
