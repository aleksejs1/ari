import { zodResolver } from '@hookform/resolvers/zod'
import {
  Briefcase,
  Building2,
  Calendar,
  CircleUser,
  Mail,
  Phone,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useCreateGroup } from '../useContacts'

import { getContactSchema } from './ContactFormSchemas'
import { ContactGroupSelect } from './ContactGroupSelect'
import { ContactModalBiography } from './ContactModalBiography'
import { ContactModalDates } from './ContactModalDates'
import { ContactModalEmails } from './ContactModalEmails'
import { ContactModalName } from './ContactModalName'
import { ContactModalOrganization } from './ContactModalOrganization'
import { ContactModalPhones } from './ContactModalPhones'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ContactFormValues, Group } from '@/types/models'

interface ContactModalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
    contactOrganizations: d.contactOrganizations || [], // Start empty for single field logic check
    contactGroups: d.contactGroups || [],
    contactBiographies: d.contactBiographies || [], // Start empty
    contactRelations: d.contactRelations || [],
  }
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

export function ContactModalForm({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isSubmitting,
}: ContactModalFormProps) {
  const { t } = useTranslation()
  const contactSchema = getContactSchema(t)
  const { mutateAsync: createGroup } = useCreateGroup()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: getContactFormDefaultValues(t, defaultValues),
  })

  // Track visibility of optional sections
  const [showOrganization, setShowOrganization] = useState(false)
  const [showBiography, setShowBiography] = useState(false)
  const [showGroups, setShowGroups] = useState(false)

  // Reset form when opening or defaultValues change
  React.useEffect(() => {
    if (open) {
      const defaults = getContactFormDefaultValues(t, defaultValues)
      form.reset(defaults)
      setShowOrganization(
        !!(defaults.contactOrganizations && defaults.contactOrganizations.length > 0),
      )
      setShowBiography(!!(defaults.contactBiographies && defaults.contactBiographies.length > 0))
      setShowGroups(!!(defaults.contactGroups && defaults.contactGroups.length > 0))
    }
  }, [open, defaultValues, form, t])

  const handleFormSubmit = async (data: ContactFormValues) => {
    const contactGroups = await processContactGroups(data.contactGroups, createGroup)
    const cleanedData = cleanContactData(data)

    onSubmit({
      ...cleanedData,
      contactGroups,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden bg-background p-0 sm:max-w-[600px]">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>
            {defaultValues?.['@id'] ? t('contacts.editContact') : t('contacts.createContact')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <ScrollArea className="h-[70vh] px-6 py-4">
              <div className="grid grid-cols-[40px_1fr] gap-x-2 gap-y-4">
                {/* Photo / Name */}
                <div className="flex justify-center pt-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <CircleUser className="h-6 w-6" />
                  </div>
                </div>
                <div className="min-w-0 pr-10">
                  <ContactModalName />
                </div>

                {/* Phones */}
                <div className="flex justify-center pt-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <ContactModalPhones />
                </div>

                {/* Emails */}
                <div className="flex justify-center pt-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <ContactModalEmails />
                </div>

                {/* Dates */}
                <div className="flex justify-center pt-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <ContactModalDates />
                </div>

                {/* Company */}
                <div className="flex justify-center pt-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  {showOrganization ? (
                    <ContactModalOrganization
                      onRemove={() => {
                        form.setValue('contactOrganizations', [])
                        setShowOrganization(false)
                      }}
                    />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto justify-start px-2 py-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                      onClick={() => {
                        setShowOrganization(true)
                        form.setValue('contactOrganizations', [
                          { name: '', title: '', department: '', type: 'Work' },
                        ])
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> {t('contacts.addCompany')}
                    </Button>
                  )}
                </div>

                {/* Bio */}
                <div className="flex justify-center pt-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  {showBiography ? (
                    <ContactModalBiography
                      onRemove={() => {
                        form.setValue('contactBiographies', [])
                        setShowBiography(false)
                      }}
                    />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto justify-start px-2 py-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                      onClick={() => {
                        setShowBiography(true)
                        form.setValue('contactBiographies', [{ value: '', type: 'Bio' }])
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> {t('contacts.addBio')}
                    </Button>
                  )}
                </div>

                {/* Groups */}
                <div className="flex justify-center pt-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  {showGroups ? (
                    <div className="group/groups relative min-w-0 pr-10">
                      <FormField
                        control={form.control}
                        name="contactGroups"
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            <FormControl>
                              <ContactGroupSelect value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 opacity-0 transition-opacity group-hover/groups:opacity-100"
                        onClick={() => {
                          form.setValue('contactGroups', [])
                          setShowGroups(false)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto justify-start px-2 py-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                      onClick={() => {
                        setShowGroups(true)
                        // Do not set value here, keep it empty array but show field
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> {t('contacts.addGroup')}
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="border-t px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.saving') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
