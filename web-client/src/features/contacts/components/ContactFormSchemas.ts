import { type TFunction } from 'i18next'
import { z } from 'zod'

import { formatApiDate } from '@/lib/utils'

export const getContactSchema = (t: TFunction) => {
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

  return z.object({
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
}
