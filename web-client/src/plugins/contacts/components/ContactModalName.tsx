import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ContactFormValues } from '@/types/models'

export function ContactModalName() {
  const { t } = useTranslation('contacts')
  const { control } = useFormContext<ContactFormValues>()

  return (
    <div className="space-y-2">
      <FormField
        control={control}
        name="contactNames.0.given"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder={t('firstName')} {...field} data-testid="contact-first-name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contactNames.0.family"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder={t('lastName')} {...field} data-testid="contact-last-name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
