import { z } from 'zod'

import type { components } from './schema'

import type { HydraCollection } from '@/features/contacts/utils'
import { formatApiDate } from '@/lib/utils'

export type { HydraCollection }

export type Contact = components['schemas']['Contact.jsonld-contact.read'] & {
  displayName?: string
  contactRelations?: ContactRelation[]
}
export type ContactName = components['schemas']['ContactName.jsonld-contact.read']
export type ContactDate = components['schemas']['ContactDate.jsonld-contact.read'] & {
  yearsPassed?: number | null
  nextAnniversaryDate?: string | null
  yearsAtNextAnniversary?: number | null
  contact?: Contact
}

export type ContactPhoneNumber = components['schemas']['ContactPhoneNumber.jsonld-contact.read']
export type ContactEmailAdress = components['schemas']['ContactEmailAdress.jsonld-contact.read']
export type ContactAddress = components['schemas']['ContactAddress.jsonld-contact.read']
export type NotificationSubscription =
  components['schemas']['NotificationSubscription.jsonld-notification_subscription.read']
export type ContactGroup = z.infer<typeof contactGroupSchema>
export type ContactOrganization = components['schemas']['ContactOrganization.jsonld-contact.read']
export type ContactBiography = components['schemas']['ContactBiography.jsonld-contact.read']

export type ActivityFeed = components['schemas']['ActivityFeed.jsonld-activity_feed.read']
export type Stats = components['schemas']['Stats.jsonld-stats.read']

export interface ContactRelation {
  id?: string
  '@id'?: string
  '@type'?: string
  relatedContact: string | Contact
  type: string
  displayName?: string
}

export const PREDEFINED_RELATIONS = [
  'husband',
  'wife',
  'spouse',
  'brother',
  'sister',
  'sibling',
  'son',
  'daughter',
  'child',
  'father',
  'mother',
  'parent',
]

export type Group = components['schemas']['Group.jsonld-group.read'] & {
  contactsCount?: number
}

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
  type: z.string(),
})

export const contactEmailAdressSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  // eslint-disable-next-line sonarjs/deprecation
  value: z.string().min(1).email({}),
  type: z.string(),
})

export const contactAddressSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  type: z.string(),
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

export const contactBiographySchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  value: z.string().min(1),
  type: z.string(),
})

export const contactRelationSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  relatedContact: z.union([z.string(), z.object({ id: z.string().optional(), '@id': z.string() })]),
  type: z.string().min(1),
  displayName: z.string().optional(),
})

export const contactSchema = z.object({
  contactNames: z.array(contactNameSchema).min(1),
  contactDates: z.array(contactDateSchema),
  phoneNumbers: z.array(contactPhoneNumberSchema),
  contactEmailAdresses: z.array(contactEmailAdressSchema),
  contactAddresses: z.array(contactAddressSchema),
  contactGroups: z.array(contactGroupSchema).optional(),
  contactOrganizations: z.array(contactOrganizationSchema).optional(),
  contactBiographies: z.array(contactBiographySchema).optional(),
  contactRelations: z.array(contactRelationSchema).optional(),
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
  '@id': z.string().optional(),
  type: z.enum(['telegram', 'web']),
  config: z
    .object({
      botToken: z.string().optional(),
      chatId: z.string().optional(),
      mapping: z.string().optional(),
    })
    .optional()
    .nullable(),
  verifiedAt: z.string().optional().nullable(),
})

export type NotificationChannelFormValues = z.infer<typeof notificationChannelSchema>
export type NotificationChannel = z.infer<typeof notificationChannelSchema> & {
  '@id'?: string
}

export type NotificationPolicyType = 'all' | 'group' | 'contact'

export interface NotificationSchedule {
  offsetDays: number
  time: string // H:MM
  channels: string[] // NotificationChannel IRIs
}

export interface NotificationPolicy {
  id?: number
  '@id'?: string
  '@type'?: string
  name: string
  targets: {
    type: NotificationPolicyType
    ids?: string[] // IRIs of groups or contacts
  }
  eventTypes: string[]
  schedule: NotificationSchedule[]
}

// Zod schema for Notification Policy
export const notificationPolicySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  targets: z
    .object({
      type: z.enum(['all', 'group', 'contact']),
      ids: z.array(z.string()).optional(),
    })
    .refine(
      (data) => {
        if (data.type === 'all') {
          return true
        }
        return data.ids && data.ids.length > 0
      },
      {
        message: 'Targets must be selected for group or contact policies',
        path: ['ids'],
      },
    ),
  eventTypes: z.array(z.string()),
  schedule: z
    .array(
      z.object({
        offsetDays: z.preprocess((v) => Number(v), z.number()),
        time: z.string().regex(/^([0-1]?\d|2[0-3]):[0-5]\d$/, 'Invalid time format (H:MM)'),
        channels: z.array(z.string()).min(1, 'At least one channel must be selected'),
      }),
    )
    .min(1, 'At least one schedule is required'),
})

export type NotificationPolicyFormValues = z.infer<typeof notificationPolicySchema>
