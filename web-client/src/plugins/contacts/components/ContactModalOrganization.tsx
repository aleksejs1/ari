import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { ContactFormValues } from '@/types/models'

interface ContactModalOrganizationProps {
  onRemove: () => void
}

export function ContactModalOrganization({ onRemove }: ContactModalOrganizationProps) {
  const { t } = useTranslation('contacts')
  const { control } = useFormContext<ContactFormValues>()

  // We assume only 1 organization is allowed, so we access index 0
  const index = 0

  return (
    <div className="group flex items-start gap-2">
      <div className="flex-1 space-y-2">
        <FormField
          control={control}
          name={`contactOrganizations.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t('companyName')} {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={control}
            name={`contactOrganizations.${index}.title`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={t('jobTitle')} {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`contactOrganizations.${index}.department`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={t('department')} {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="opacity-0 transition-opacity group-hover:opacity-100"
        onClick={onRemove}
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  )
}
