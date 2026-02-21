import { useTranslation } from 'react-i18next'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Group } from '@/types/models'

import { useDeleteGroup } from '../hooks/useGroups'

interface GroupsTableProps {
  groups: Group[]
  onEdit: (group: Group) => void
}

export function GroupsTable({ groups, onEdit }: GroupsTableProps) {
  const { t } = useTranslation()
  const deleteMutation = useDeleteGroup()

  const handleDelete = async (id: number) => {
    if (confirm(t('groups.deleteConfirmation', 'Are you sure you want to delete this group?'))) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('groups.fields.color', 'Color')}</TableHead>
            <TableHead>{t('groups.fields.name', 'Name')}</TableHead>
            <TableHead className="w-[100px] text-right">{t('common.actions', 'Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id} data-testid={`group-row-${group.id}`}>
              <TableCell>
                <div
                  className="h-6 w-6 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: group.color || '#cccccc' }}
                />
              </TableCell>
              <TableCell className="font-medium">{group.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(group)}
                    data-testid={`group-edit-${group.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => group.id && handleDelete(group.id)}
                    data-testid={`group-delete-${group.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {groups.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                {t('groups.noGroups', 'No groups found.')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
