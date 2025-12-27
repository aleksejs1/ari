import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NotificationSubscriptions } from './NotificationSubscriptions'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // FormLabel, // Unused
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { contactSchema, type ContactFormValues } from '@/types/models'

interface ContactFormProps {
  defaultValues?: ContactFormValues
  onSubmit: (data: ContactFormValues) => void
  isSubmitting?: boolean
}

export function ContactForm({ defaultValues, onSubmit, isSubmitting }: ContactFormProps) {
  const { t } = useTranslation()
  const form = useForm<ContactFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema) as any,
    defaultValues: defaultValues || {
      contactNames: [{ given: '', family: '' }],
      contactDates: [],
    },
  })

  // Names Field Array
  const {
    fields: nameFields,
    append: appendName,
    remove: removeName,
  } = useFieldArray({
    control: form.control,
    name: 'contactNames',
  })

  // Dates Field Array
  const {
    fields: dateFields,
    append: appendDate,
    remove: removeDate,
  } = useFieldArray({
    control: form.control,
    name: 'contactDates',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Names Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{t('contacts.names')}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendName({ given: '', family: '' })}
            >
              <Plus className="w-4 h-4 mr-1" /> {t('contacts.addName')}
            </Button>
          </div>
          <div className="space-y-2">
            {nameFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Dates Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{t('contacts.dates')}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendDate({ text: 'Birthday', date: new Date().toISOString() })}
            >
              <Plus className="w-4 h-4 mr-1" /> {t('contacts.addDate')}
            </Button>
          </div>
          <div className="space-y-4">
            {dateFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name={`contactDates.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          {/* Simple text input for date for now, could be DatePicker */}
                          <Input
                            type="date"
                            {...field}
                            value={field.value ? field.value.split('T')[0] : ''}
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
                    onClick={() => removeDate(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                {(() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const atId = (field as any)['@id']
                  const realId = atId ? Number(atId.split('/').pop()) : null
                  return realId ? (
                    <NotificationSubscriptions entityType="ContactDate" entityId={realId} />
                  ) : null
                })()}
              </div>
            ))}
            {dateFields.length === 0 && (
              <p className="text-sm text-gray-500 italic">{t('contacts.noDates')}</p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  )
}
