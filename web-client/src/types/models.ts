import { z } from 'zod'

import type { components } from './schema'

import { formatApiDate } from '@/lib/utils'

export type Contact = components['schemas']['Contact.jsonld-contact.read']
export type ContactName = components['schemas']['ContactName.jsonld-contact.read']
export type ContactDate = components['schemas']['ContactDate.jsonld-contact.read']
export type NotificationChannel =
  components['schemas']['NotificationChannel.jsonld-notification_channel.read']
export type NotificationSubscription =
  components['schemas']['NotificationSubscription.jsonld-notification_subscription.read']

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

export const contactSchema = z.object({
  contactNames: z.array(contactNameSchema).min(1),
  contactDates: z.array(contactDateSchema),
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
