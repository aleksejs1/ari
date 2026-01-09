import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useCreateGroup } from '../useContacts'

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
  const d = defaultValues ?? {}

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

export function ContactForm({ defaultValues, onSubmit, isSubmitting }: ContactFormProps) {
  const { t } = useTranslation()

  const contactSchema = getContactSchema(t)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<ContactFormValues>,
    values: getContactFormDefaultValues(t, defaultValues),
  })

  const { mutateAsync: createGroup } = useCreateGroup()

  const handleFormSubmit = async (data: ContactFormValues) => {
    const contactGroups = await processContactGroups(data.contactGroups, createGroup)
    const cleanedData = cleanContactData(data)

    onSubmit({
      ...cleanedData,
      contactGroups,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ContactFormNames />
        <ContactFormPhone />
        <ContactFormEmail />
        <ContactFormAddress />
        <ContactFormBiography />
        <ContactFormOrganization />
        <ContactFormRelations />
        <ContactFormSync />

        {/* Groups Section */}
        <CollapsibleSection title={t('contacts.groups')}>
          <FormField
            control={form.control}
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
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  )
}
