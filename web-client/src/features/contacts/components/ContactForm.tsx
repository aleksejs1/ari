import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useForm, useFieldArray, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

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
import { formatApiDate } from '@/lib/utils'
import { type ContactFormValues } from '@/types/models'

interface ContactFormProps {
  defaultValues?: ContactFormValues
  onSubmit: (data: ContactFormValues) => void
  isSubmitting?: boolean
}

export function ContactForm({ defaultValues, onSubmit, isSubmitting }: ContactFormProps) {
  const { t } = useTranslation()

  const contactNameSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    given: z.string().min(1, t('validation.firstNameRequired')),
    family: z.string().optional(),
  })

  const contactDateSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    date: z
      .string()
      .or(z.date())
      .transform((d) => formatApiDate(d)),
    text: z.string().min(1, t('validation.labelRequired')),
  })

  const contactPhoneNumberSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    value: z.string().min(1, t('validation.phoneNumberRequired')),
    type: z.string().min(1, t('validation.typeRequired')),
  })

  const contactEmailAdressSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    /* eslint-disable sonarjs/deprecation */
    value: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email({ message: t('validation.invalidEmail') }),
    /* eslint-enable sonarjs/deprecation */
    type: z.string().min(1, t('validation.typeRequired')),
  })

  const contactSchema = z.object({
    contactNames: z.array(contactNameSchema).min(1, t('validation.atLeastOneNameRequired')),
    contactDates: z.array(contactDateSchema),
    phoneNumbers: z.array(contactPhoneNumberSchema),
    contactEmailAdresses: z.array(contactEmailAdressSchema),
  })

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<ContactFormValues>,
    defaultValues: defaultValues || {
      contactNames: [{ given: '', family: '' }],
      contactDates: [],
      phoneNumbers: [],
      contactEmailAdresses: [],
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

  // Phone Numbers Field Array
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control: form.control,
    name: 'phoneNumbers',
  })

  // Email Addresses Field Array
  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({
    control: form.control,
    name: 'contactEmailAdresses',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Names Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('contacts.names')}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendName({ given: '', family: '' })}
            >
              <Plus className="mr-1 h-4 w-4" /> {t('contacts.addName')}
            </Button>
          </div>
          <div className="space-y-2">
            {nameFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
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
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        {/* Phone Numbers Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('contacts.phoneNumbers')}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPhone({ value: '', type: 'Mobile' })}
            >
              <Plus className="mr-1 h-4 w-4" /> {t('contacts.addPhoneNumber')}
            </Button>
          </div>
          <div className="space-y-2">
            {phoneFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name={`phoneNumbers.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={t('contacts.phoneTypePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePhone(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Email Addresses Section */}
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
                  control={form.control}
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
                  control={form.control}
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEmail(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Dates Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('contacts.dates')}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendDate({ text: t('contacts.birthday'), date: formatApiDate(new Date()) })
              }
            >
              <Plus className="mr-1 h-4 w-4" /> {t('contacts.addDate')}
            </Button>
          </div>
          <div className="space-y-4">
            {dateFields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-start gap-2">
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
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  )
}
