import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type ContactFormValues } from '@/types/models'

export function ContactFormEmail() {
  const { t } = useTranslation()
  const { control } = useFormContext<ContactFormValues>()

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control,
    name: 'contactEmailAdresses',
  })

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">{t('contacts.emailAddresses')}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendEmail({ value: '', type: 'Personal' })}
        >
          <Plus className="mr-1 h-4 w-4" /> {t('contacts.addEmailAddress')}
        </Button>
      </div>
      <div className="space-y-2">
        {emailFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`contactEmailAdresses.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={t('contacts.emailAddress')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`contactEmailAdresses.${index}.type`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={t('contacts.emailTypePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
