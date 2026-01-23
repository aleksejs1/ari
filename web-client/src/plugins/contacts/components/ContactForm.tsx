import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { registerDefaultContactFormSections } from '../defaults_form'
import { cleanContactData, getContactFormDefaultValues, processContactGroups } from '../form/utils'
import { useCreateGroup, useUploadContactAvatar } from '../useContacts'

import { getContactSchema } from './ContactFormSchemas'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ContactFormRegistry } from '@/lib/contacts/form/ContactFormRegistry'
import { type ContactFormValues } from '@/types/models'

// Register sections immediately
registerDefaultContactFormSections()

interface ContactFormProps {
  defaultValues?: ContactFormValues
  onSubmit: (data: ContactFormValues) => void
  isSubmitting?: boolean
}

export function ContactForm({ defaultValues, onSubmit, isSubmitting }: ContactFormProps) {
  const { t, form, handleFormSubmit } = useContactForm(defaultValues, onSubmit)
  const registry = ContactFormRegistry.getInstance()
  const sections = registry.getAll()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {sections.map((section) => {
          const Component = section.component
          return <Component key={section.id} />
        })}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  )
}

function useContactForm(
  defaultValues: ContactFormValues | undefined,
  onSubmit: (data: ContactFormValues) => void,
) {
  const { t } = useTranslation()
  const contactSchema = getContactSchema(t)
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as any,
    values: getContactFormDefaultValues(t, defaultValues),
  }) as any

  const { mutateAsync: createGroup } = useCreateGroup()
  const { mutateAsync: uploadAvatar } = useUploadContactAvatar()

  const handleFormSubmit = async (data: ContactFormValues) => {
    const contactGroups = await processContactGroups(data.contactGroups, createGroup)
    const cleanedData = cleanContactData(data)
    onSubmit({ ...cleanedData, contactGroups })
  }

  return { t, form, uploadAvatar, handleFormSubmit }
}
