import { z } from 'zod'

import type { components } from './schema'

import { formatApiDate } from '@/lib/utils'

export type Contact = components['schemas']['Contact.jsonld-contact.read']
export type ContactName = components['schemas']['ContactName.jsonld-contact.read']
export type ContactDate = components['schemas']['ContactDate.jsonld-contact.read']
export type ContactPhoneNumber = components['schemas']['ContactPhoneNumber.jsonld-contact.read']
export type ContactEmailAdress = components['schemas']['ContactEmailAdress.jsonld-contact.read']
export type ContactAddress = components['schemas']['ContactAddress.jsonld-contact.read']
export type NotificationChannel =
  components['schemas']['NotificationChannel.jsonld-notification_channel.read']
export type NotificationSubscription =
  components['schemas']['NotificationSubscription.jsonld-notification_subscription.read']
export type ContactGroup = components['schemas']['ContactGroup.jsonld-contact.read']
export type ContactOrganization = components['schemas']['ContactOrganization.jsonld-contact.read']
export type Group = components['schemas']['Group.jsonld-group.read']

// Zod Schemas for Forms
// These need to match the API requirements for creation/update
// Contact-contact.create usually implies nested creation

export const contactNameSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  given: z.string().min(1),
  family: z.string().optional(),
})

export const contactDateSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  date: z
    .string()
    .or(z.date())
    .transform((d) => formatApiDate(d)),
  text: z.string().min(1),
})

export const contactPhoneNumberSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  value: z.string().min(1),
  type: z.string().min(1),
})

export const contactEmailAdressSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  // eslint-disable-next-line sonarjs/deprecation
  value: z.string().min(1).email({}),
  type: z.string().min(1),
})

export const contactAddressSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  type: z.string().min(1),
  street: z.string().optional().nullable(),
  streetExtended: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  countryCode: z.string().optional().nullable(),
})

export const contactGroupSchema = z.object({
  id: z.number().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  groupResource: z.union([z.string(), z.object({ name: z.string() })]),
})

export const contactOrganizationSchema = z.object({
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

export const contactSchema = z.object({
  contactNames: z.array(contactNameSchema).min(1),
  contactDates: z.array(contactDateSchema),
  phoneNumbers: z.array(contactPhoneNumberSchema),
  contactEmailAdresses: z.array(contactEmailAdressSchema),
  contactAddresses: z.array(contactAddressSchema),
  contactGroups: z.array(contactGroupSchema).optional(),
  contactOrganizations: z.array(contactOrganizationSchema).optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export interface ContactTimeline {
  id: number
  logs: TimelineEvent[]
}

export interface TimelineEvent {
  id: number
  action: string
  entityType: string
  entityId?: number
  ownerEntityType?: string
  ownerEntityId?: number
  changes?: Record<string, unknown> | null
  snapshotBefore?: Record<string, unknown> | null
  snapshotAfter?: Record<string, unknown> | null
  createdAt: string
  user?: string
}

export const notificationChannelSchema = z.object({
  id: z.number().optional(),
  type: z.literal('telegram'),
  config: z.object({
    botToken: z.string().min(1),
    chatId: z.string().min(1),
  }),
})

export type NotificationChannelFormValues = z.infer<typeof notificationChannelSchema>
