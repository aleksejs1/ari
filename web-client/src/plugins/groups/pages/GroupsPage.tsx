import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Plus, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type Group } from '@/types/models'

import { GroupDialog } from '../components/GroupDialog'
import { GroupsTable } from '../components/GroupsTable'
import { useGroups } from '../hooks/useGroups'

export default function GroupsPage() {
  const { t } = useTranslation()
  const { data: groups, isLoading, error } = useGroups()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)

  const handleCreate = () => {
    setEditingGroup(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (group: Group) => {
    setEditingGroup(group)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{t('errors.failedToLoadGroups')}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            {t('groups.title', 'Contact Groups')}
          </h1>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('groups.createGroup', 'Create Group')}
        </Button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <GroupsTable groups={groups || []} onEdit={handleEdit} />
      </div>

      <GroupDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingGroup(null)
          }
        }}
        group={editingGroup}
      />
    </div>
  )
}
