import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CollapsibleSection } from '../../components/CollapsibleSection'
import { ContactGroupSelect } from '../../components/ContactGroupSelect'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { type ContactFormValues } from '@/types/models'

export function GroupsSection() {
  const { control } = useFormContext<ContactFormValues>()
  const { t } = useTranslation()

  return (
    <CollapsibleSection title={t('contacts.groups')}>
      <FormField
        control={control}
        name="contactGroups"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ContactGroupSelect value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CollapsibleSection>
  )
}
