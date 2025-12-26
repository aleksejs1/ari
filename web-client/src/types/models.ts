import { z } from 'zod'

import type { components } from './schema'

export type Contact = components['schemas']['Contact.jsonld-contact.read']
export type ContactName = components['schemas']['ContactName.jsonld-contact.read']
export type ContactDate = components['schemas']['ContactDate.jsonld-contact.read']

// Zod Schemas for Forms
// These need to match the API requirements for creation/update
// Contact-contact.create usually implies nested creation

export const contactNameSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  given: z.string().min(1, 'First name is required'),
  family: z.string().optional(),
})

export const contactDateSchema = z.object({
  id: z.string().optional(),
  '@id': z.string().optional(),
  '@type': z.string().optional(),
  date: z
    .string()
    .or(z.date())
    .transform((d) => new Date(d).toISOString()),
  text: z.string().min(1, 'Label is required'),
})

export const contactSchema = z.object({
  contactNames: z.array(contactNameSchema).min(1, 'At least one name is required'),
  contactDates: z.array(contactDateSchema),
})

export type ContactFormValues = z.infer<typeof contactSchema>
