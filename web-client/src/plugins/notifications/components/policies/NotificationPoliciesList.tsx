import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Edit, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { type Contact, type Group, type NotificationPolicy } from '@/types/models'

import { getHydraMember, useContacts } from '@/plugins/contacts/useContacts'
import { useGroups } from '@/plugins/groups/hooks/useGroups'

import {
  useDeleteNotificationPolicy,
  useNotificationPolicies,
} from '../../hooks/useNotificationPolicies'

const getContactLabel = (contact: Contact, id: string): string => {
  const names = contact.contactNames || []
  const givenName = names.length > 0 ? names[0]?.given : undefined
  return contact.displayName || givenName || id
}

const getFirstTargetLabel = (
  targets: NonNullable<NotificationPolicy['targets']>,
  contacts: Contact[],
  groups: Group[],
): string => {
  const ids = targets.ids || []
  if (ids.length === 0) {
    return ''
  }
  const firstId = ids[0]

  if (targets.type === 'group') {
    return groups.find((g) => g['@id'] === firstId)?.name || firstId
  }

  if (targets.type === 'contact') {
    const contact = contacts.find((c) => c['@id'] === firstId)
    return contact ? getContactLabel(contact, firstId) : firstId
  }

  return firstId
}

const TargetDisplay = ({
  policy,
  contacts,
  groups,
}: {
  policy: NotificationPolicy
  contacts: Contact[]
  groups: Group[]
}) => {
  const targets = policy.targets
  if (!targets || targets.type === 'all') {
    return null
  }

  const ids = targets.ids || []
  if (ids.length === 0) {
    return null
  }

  const firstLabel = getFirstTargetLabel(targets, contacts, groups)

  if (ids.length === 1) {
    return <span>{firstLabel}</span>
  }

  return (
    <div className="flex items-center gap-1">
      <span>{firstLabel}</span>
      <Badge variant="secondary">+{ids.length - 1}</Badge>
    </div>
  )
}

export default function NotificationPoliciesList() {
  const { t } = useTranslation()
  const { formatTime } = useUserPrefs()
  const { data: policies, isLoading: policiesLoading } = useNotificationPolicies()
  const { data: contactsData, isLoading: contactsLoading } = useContacts()
  const { data: groupsData, isLoading: groupsLoading } = useGroups()
  const deleteMutation = useDeleteNotificationPolicy()

  const contacts = useMemo(() => getHydraMember(contactsData as any) as Contact[], [contactsData])
  const groups = useMemo(() => groupsData || [], [groupsData])

  const isLoading = policiesLoading || contactsLoading || groupsLoading

  if (isLoading) {
    return <div>{t('common.loading')}</div>
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('common.confirm_delete', 'Are you sure?'))) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('notification_policies.title', 'Notification Policies')}</CardTitle>
        <Button asChild>
          <Link to="/settings/notification-policies/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('common.create', 'Create')}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('notification_policies.name', 'Name')}</TableHead>
              <TableHead>{t('notification_policies.type', 'Type')}</TableHead>
              <TableHead>{t('notification_policies.targets', 'Targets')}</TableHead>
              <TableHead>{t('notification_policies.events', 'Event Types')}</TableHead>
              <TableHead>{t('notification_policies.schedule', 'Schedule')}</TableHead>
              <TableHead className="w-[100px]">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies?.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>{policy.name}</TableCell>
                <TableCell className="capitalize">
                  {policy.targets?.type
                    ? t(`notification_policies.types.${policy.targets.type}`, policy.targets.type)
                    : null}
                </TableCell>
                <TableCell>
                  <TargetDisplay policy={policy} contacts={contacts} groups={groups} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const ets = policy.eventTypes || []
                      if (ets.length === 0) {
                        return (
                          <span className="text-xs italic text-muted-foreground">
                            {t('notification_policies.all_events', 'All events')}
                          </span>
                        )
                      }
                      if (ets.length === 1) {
                        return <Badge variant="secondary">{ets[0]}</Badge>
                      }
                      return (
                        <>
                          <Badge variant="secondary">{ets[0]}</Badge>
                          <Badge variant="secondary">+{ets.length - 1}</Badge>
                        </>
                      )
                    })()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {(policy.schedule || []).map((sch, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-medium">
                          {t('notification_policies.days_before', 'Days before')}:
                        </span>{' '}
                        {sch.offsetDays}, {formatTime(sch.time)}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/settings/notification-policies/${policy.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => policy.id && handleDelete(policy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {policies?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {t('common.no_data', 'No policies found')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
