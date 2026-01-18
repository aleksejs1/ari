import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useCreateGroup, useUploadContactAvatar } from '../useContacts'

import { AvatarUpload } from './AvatarUpload'
import { CollapsibleSection } from './CollapsibleSection'
import { ContactFormAddress } from './ContactFormAddress'
import { ContactFormBiography } from './ContactFormBiography'
import { ContactFormEmail } from './ContactFormEmail'
import { ContactFormNames } from './ContactFormNames'
import { ContactFormOrganization } from './ContactFormOrganization'
import { ContactFormPhone } from './ContactFormPhone'
import { ContactFormRelations } from './ContactFormRelations'
import { getContactSchema } from './ContactFormSchemas'
import { ContactFormSync } from './ContactFormSync'
import { ContactGroupSelect } from './ContactGroupSelect'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { type ContactFormValues, type Group } from '@/types/models'

interface ContactFormProps {
  defaultValues?: ContactFormValues
  onSubmit: (data: ContactFormValues) => void
  isSubmitting?: boolean
}

const enforceMin = <T,>(arr: T[] | undefined, defaultItem: T): T[] => {
  if (!arr || arr.length === 0) {
    return [defaultItem]
  }
  return arr
}

const processContactGroups = async (
  groups: ContactFormValues['contactGroups'],
  createGroup: (data: { name: string }) => Promise<Group>,
) => {
  const processed: { groupResource: string }[] = []
  if (!groups) {
    return processed
  }

  for (const group of groups) {
    if (typeof group.groupResource === 'object' && group.groupResource.name) {
      try {
        const newGroup = await createGroup({ name: group.groupResource.name })
        if (newGroup['@id']) {
          processed.push({ groupResource: newGroup['@id'] })
        }
      } catch {
        // ignore
      }
    } else if (typeof group.groupResource === 'string') {
      processed.push({ groupResource: group.groupResource })
    }
  }
  return processed
}

const cleanContactData = (data: ContactFormValues) => {
  const contactRelations = data.contactRelations?.map((relation) => ({
    ...relation,
    relatedContact:
      typeof relation.relatedContact === 'object'
        ? relation.relatedContact['@id']
        : relation.relatedContact,
  }))

  const phoneNumbers = data.phoneNumbers.filter((p) => p.value.trim() !== '')
  const contactEmailAdresses = data.contactEmailAdresses.filter((e) => e.value.trim() !== '')
  const contactBiographies = data.contactBiographies?.filter((b) => b.value.trim() !== '')
  const contactOrganizations = data.contactOrganizations?.filter(
    (o) =>
      o.name?.trim() ||
      o.title?.trim() ||
      o.department?.trim() ||
      o.jobDescription?.trim() ||
      o.startDate ||
      o.endDate,
  )
  const contactAddresses = data.contactAddresses.filter((a) =>
    [a.street, a.streetExtended, a.city, a.region, a.postalCode, a.country].some((v) => v?.trim()),
  )
  const contactDates = data.contactDates.filter((d) => d.text.trim() !== '' && d.date !== '')

  return {
    ...data,
    contactRelations,
    phoneNumbers,
    contactEmailAdresses,
    contactBiographies,
    contactOrganizations,
    contactAddresses,
    contactDates,
  }
}

const getContactFormDefaultValues = (
  t: (key: string) => string,
  defaultValues?: ContactFormValues,
): ContactFormValues => {
  const d = (defaultValues ?? {}) as Partial<ContactFormValues>

  return {
    ...d,
    contactNames: d.contactNames?.length ? d.contactNames : [{ given: '', family: '' }],
    contactDates: enforceMin(d.contactDates, {
      text: t('contacts.birthday'),
      date: '',
    }),
    phoneNumbers: enforceMin(d.phoneNumbers, { value: '', type: 'Mobile' }),
    contactEmailAdresses: enforceMin(d.contactEmailAdresses, {
      value: '',
      type: 'Personal',
      '@type': 'ContactEmailAdress',
    }),
    contactAddresses: enforceMin(d.contactAddresses, {
      type: 'Home',
      street: '',
      city: '',
      postalCode: '',
      country: '',
    }),
    contactOrganizations: enforceMin(d.contactOrganizations, {
      name: '',
      title: '',
      department: '',
      type: 'Work',
      jobDescription: '',
      startDate: '',
      endDate: '',
    }),
    contactGroups: d.contactGroups || [],
    contactBiographies: enforceMin(d.contactBiographies, { value: '', type: 'Bio' }),
    contactRelations: d.contactRelations || [],
  }
}

function ContactFormAvatarSection({
  defaultValues,
  uploadAvatar,
}: {
  defaultValues?: ContactFormValues
  uploadAvatar: (params: { id: string; file: File }) => Promise<any>
}) {
  const contactId = defaultValues?.['@id']
  const firstNames = defaultValues?.contactNames?.[0]
  const displayName = firstNames?.given || firstNames?.family

  const handleUpload = async (file: File) => {
    if (contactId) {
      await uploadAvatar({ id: contactId, file })
    }
  }

  return (
    <div className="flex justify-center">
      <AvatarUpload
        currentAvatar={defaultValues?.avatar}
        displayName={displayName}
        contactId={contactId}
        disabled={!contactId}
        onUpload={handleUpload}
      />
    </div>
  )
}

function ContactFormGroupsSection({ control }: { control: any }) {
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

export function ContactForm({ defaultValues, onSubmit, isSubmitting }: ContactFormProps) {
  const { t, form, uploadAvatar, handleFormSubmit } = useContactForm(defaultValues, onSubmit)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ContactFormAvatarSection defaultValues={defaultValues} uploadAvatar={uploadAvatar} />
        <ContactFormNames />
        <ContactFormPhone />
        <ContactFormEmail />
        <ContactFormAddress />
        <ContactFormBiography />
        <ContactFormOrganization />
        <ContactFormRelations />
        <ContactFormSync />

        <ContactFormGroupsSection control={form.control} />

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
