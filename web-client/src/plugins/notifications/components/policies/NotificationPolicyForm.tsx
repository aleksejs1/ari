import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  type Contact,
  type NotificationPolicyFormValues,
  notificationPolicySchema,
} from '@/types/models'

import { getHydraMember, useContacts } from '@/plugins/contacts/useContacts'
import { useGroups } from '@/plugins/groups/hooks/useGroups'

import { useNotificationChannels } from '../../hooks/useNotificationChannels'
import {
  useCreateNotificationPolicy,
  useNotificationPolicy,
  useUpdateNotificationPolicy,
} from '../../hooks/useNotificationPolicies'

import { EventTypesSection } from './form/EventTypesSection'
import { ScheduleSection } from './form/ScheduleSection'
import { TargetsSection } from './form/TargetsSection'

export default function NotificationPolicyForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const { data: policy, isLoading: isLoadingPolicy } = useNotificationPolicy(id)
  const createMutation = useCreateNotificationPolicy()
  const updateMutation = useUpdateNotificationPolicy()

  const { data: channelsData } = useNotificationChannels(1)
  const channels = channelsData ? getHydraMember(channelsData) : []

  const { data: groupsData } = useGroups()
  const groups = groupsData || []

  const { data: contactsData } = useContacts(1)
  const contacts = contactsData ? (getHydraMember(contactsData as any) as Contact[]) : []

  const form = useForm<NotificationPolicyFormValues>({
    resolver: zodResolver(notificationPolicySchema) as any,
    defaultValues: {
      name: '',
      targets: {
        type: 'all',
        ids: [],
      },
      eventTypes: ['Birthday'],
      schedule: [
        {
          offsetDays: 0,
          time: '09:00',
          channels: [],
        },
      ],
    },
  })

  useEffect(() => {
    if (policy) {
      form.reset({
        name: policy.name,
        targets: {
          type: policy.targets?.type || 'all',
          ids: policy.targets?.ids || [],
        },
        eventTypes: policy.eventTypes,
        schedule: policy.schedule,
      })
    }
  }, [policy, form])

  const onSubmit = (data: NotificationPolicyFormValues) => {
    if (isEdit && id) {
      updateMutation.mutate(
        { id, data },
        {
          onSuccess: async () => {
            await navigate('/settings/notification-policies')
          },
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: async () => {
          await navigate('/settings/notification-policies')
        },
      })
    }
  }

  if (isEdit && isLoadingPolicy) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit
            ? t('notification_policies.edit', 'Edit Notification Policy')
            : t('notification_policies.create', 'Create Notification Policy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('notification_policies.name', 'Name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('notification_policies.name', 'Policy Name')}
                      {...field}
                      data-testid="policy-name-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Selection */}
            <TargetsSection groups={groups} contacts={contacts} />

            {/* Event Types */}
            <EventTypesSection />

            {/* Schedule */}
            <ScheduleSection channels={channels} />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/settings/notification-policies')}
                data-testid="policy-form-cancel"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" data-testid="policy-form-save">
                {isEdit ? t('common.save', 'Save') : t('common.create', 'Create')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
