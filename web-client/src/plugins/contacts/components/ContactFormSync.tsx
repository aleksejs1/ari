import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CollapsibleSection } from './CollapsibleSection'
import { NotificationSubscriptions } from './NotificationSubscriptions'

import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/DateInput'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ContactFormValues } from '@/types/models'

export function ContactFormSync() {
  const { t } = useTranslation()
  const { control } = useFormContext<ContactFormValues>()
  const [isOpen, setIsOpen] = useState(true)

  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control,
    name: 'contactDates',
  })

  return (
    <CollapsibleSection
      title={t('contacts.dates')}
      open={isOpen}
      onOpenChange={setIsOpen}
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            appendDate({ text: t('contacts.birthday'), date: '' })
            setIsOpen(true)
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> {t('contacts.addDate')}
        </Button>
      }
    >
      <div className="space-y-4">
        {dateFields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-start gap-2">
              <FormField
                control={control}
                name={`contactDates.${index}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={t('contacts.dateLabelPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`contactDates.${index}.date`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <DateInput
                        {...field}
                        value={field.value ? String(field.value).split('T')[0] : ''}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeDate(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            {(() => {
              const atId = field['@id']
              const realId = atId ? Number(atId.split('/').pop()) : null
              return realId ? (
                <NotificationSubscriptions entityType="ContactDate" entityId={realId} />
              ) : null
            })()}
          </div>
        ))}
        {dateFields.length === 0 && (
          <p className="text-sm italic text-gray-500">{t('contacts.noDates')}</p>
        )}
      </div>
    </CollapsibleSection>
  )
}
