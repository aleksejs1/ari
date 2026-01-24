import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { ContactFormValues } from '@/types/models'

interface ContactModalBiographyProps {
  onRemove: () => void
}

export function ContactModalBiography({ onRemove }: ContactModalBiographyProps) {
  const { t } = useTranslation('contacts')
  const { control } = useFormContext<ContactFormValues>()

  // We assume only 1 biography is allowed, so we access index 0
  const index = 0

  return (
    <div className="group flex items-start gap-2">
      <FormField
        control={control}
        name={`contactBiographies.${index}.value`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Textarea placeholder={t('biography')} className="resize-none" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
