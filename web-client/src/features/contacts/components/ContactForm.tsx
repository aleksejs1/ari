import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { useCreateGroup } from '../useContacts'

import { ContactFormAddress } from './ContactFormAddress'
import { ContactFormBiography } from './ContactFormBiography'
import { ContactFormEmail } from './ContactFormEmail'
import { ContactFormNames } from './ContactFormNames'
import { ContactFormOrganization } from './ContactFormOrganization'
import { ContactFormPhone } from './ContactFormPhone'
import { ContactFormRelations } from './ContactFormRelations'
import { ContactFormSync } from './ContactFormSync'
import { ContactGroupSelect } from './ContactGroupSelect'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { formatApiDate } from '@/lib/utils'
import { type ContactFormValues } from '@/types/models'

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
  createGroup: (data: { name: string }) => Promise<any>,
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
  const contactAddresses = data.contactAddresses.filter(
    (a) =>
      a.street?.trim() ||
      a.streetExtended?.trim() ||
      a.city?.trim() ||
      a.region?.trim() ||
      a.postalCode?.trim() ||
      a.country?.trim(),
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

export function ContactForm({ defaultValues, onSubmit, isSubmitting }: ContactFormProps) {
  const { t } = useTranslation()

  const contactNameSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    given: z.string().min(1, t('validation.firstNameRequired')),
    family: z.string().optional(),
  })

  // Relaxed validations for auto-added fields
  const contactDateSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    date: z
      .string()
      .or(z.date())
      .transform((d) => (d === '' ? '' : formatApiDate(d))),
    text: z.string(),
  })

  const contactPhoneNumberSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    value: z.string(),
    type: z.string().min(1, t('validation.typeRequired')),
  })

  const contactEmailAdressSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    /* eslint-disable sonarjs/deprecation */
    value: z.string().refine((val) => val === '' || z.string().email().safeParse(val).success, {
      message: t('validation.invalidEmail'),
    }),
    /* eslint-enable sonarjs/deprecation */ type: z.string().min(1, t('validation.typeRequired')),
  })

  const contactAddressSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    type: z.string().min(1, t('validation.typeRequired')),
    street: z.string().optional().nullable(),
    streetExtended: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    region: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    countryCode: z.string().optional().nullable(),
    contactCode: z.string().optional().nullable(),
  })

  const contactOrganizationSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    name: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    department: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    jobDescription: z.string().optional().nullable(),
    startDate: z
      .string()
      .or(z.date())
      .optional()
      .nullable()
      .transform((d) => (d ? formatApiDate(d) : null)),
    endDate: z
      .string()
      .or(z.date())
      .optional()
      .nullable()
      .transform((d) => (d ? formatApiDate(d) : null)),
    type: z.string().optional().nullable(),
  })

  const contactGroupSchema = z.object({
    groupResource: z.union([z.string(), z.object({ name: z.string() })]),
  })

  const contactBiographySchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    value: z.string(),
    type: z.string().min(1, t('validation.typeRequired')),
  })

  const contactRelationSchema = z.object({
    id: z.string().optional(),
    '@id': z.string().optional(),
    '@type': z.string().optional(),
    relatedContact: z.union([
      z.string(),
      // eslint-disable-next-line sonarjs/deprecation
      z.object({ '@id': z.string() }).passthrough(),
    ]),
    type: z.string().min(1, t('validation.typeRequired')),
    displayName: z.string().optional(),
  })

  const contactSchema = z.object({
    contactNames: z.array(contactNameSchema).min(1, t('validation.atLeastOneNameRequired')),
    contactDates: z.array(contactDateSchema),
    phoneNumbers: z.array(contactPhoneNumberSchema),
    contactEmailAdresses: z.array(contactEmailAdressSchema),
    contactAddresses: z.array(contactAddressSchema),
    contactOrganizations: z.array(contactOrganizationSchema).optional(),
    contactGroups: z.array(contactGroupSchema).optional(),
    contactBiographies: z.array(contactBiographySchema).optional(),
    contactRelations: z.array(contactRelationSchema).optional(),
  })

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<ContactFormValues>,
    values: {
      ...defaultValues,
      contactNames: defaultValues?.contactNames?.length
        ? defaultValues.contactNames
        : [{ given: '', family: '' }],
      contactDates: enforceMin(defaultValues?.contactDates, {
        text: t('contacts.birthday'),
        date: '',
      }),
      phoneNumbers: enforceMin(defaultValues?.phoneNumbers, { value: '', type: 'Mobile' }),
      contactEmailAdresses: enforceMin(defaultValues?.contactEmailAdresses, {
        value: '',
        type: 'Personal',
      }),
      contactAddresses: enforceMin(defaultValues?.contactAddresses, {
        type: 'Home',
        street: '',
        city: '',
        postalCode: '',
        country: '',
      }),
      contactOrganizations: enforceMin(defaultValues?.contactOrganizations, {
        name: '',
        title: '',
        department: '',
        type: 'Work',
        jobDescription: '',
        startDate: '',
        endDate: '',
      }),
      contactGroups: defaultValues?.contactGroups || [],
      contactBiographies: enforceMin(defaultValues?.contactBiographies, { value: '', type: 'Bio' }),
      contactRelations: defaultValues?.contactRelations || [],
    },
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
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">{t('contacts.groups')}</h3>
          </div>
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
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('common.saving') : t('common.save')}
        </Button>
      </form>
    </Form>
  )
}
