import { Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

import { GiftListDialog } from '../components/GiftListDialog'
import { useDeleteGiftList, useGiftLists } from '../hooks/useGiftLists'
import type { GiftList } from '../types'

export default function GiftListsPage() {
  const { t } = useTranslation('gift-plugin')
  const { data: giftLists, isLoading } = useGiftLists()
  const deleteMutation = useDeleteGiftList()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingList, setEditingList] = useState<GiftList | undefined>(undefined)
  const [deletingListId, setDeletingListId] = useState<number | null>(null)

  const handleCreate = () => {
    setEditingList(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (list: GiftList) => {
    setEditingList(list)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (id: number) => {
    setDeletingListId(id)
  }

  const confirmDelete = async () => {
    if (deletingListId) {
      await deleteMutation.mutateAsync(deletingListId)
      setDeletingListId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('title', 'Gift Lists')}</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('actions.addList', 'Add List')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {giftLists?.map((list) => (
          <Card key={list.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">{list.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {list.description ? (
                <p className="mb-2 text-sm text-gray-500">{list.description}</p>
              ) : null}
              {list.eventDate ? (
                <p className="mb-4 text-sm text-gray-400">
                  {new Date(list.eventDate).toLocaleDateString()}
                </p>
              ) : null}
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(list)}>
                  <Edit className="mr-1 h-4 w-4" />
                  {t('actions.edit', 'Edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleDeleteClick(list.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {t('actions.delete', 'Delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <GiftListDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} listToEdit={editingList} />

      <Dialog
        open={!!deletingListId}
        onOpenChange={(open: boolean) => !open && setDeletingListId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.areYouSure', 'Are you sure?')}</DialogTitle>
            <DialogDescription>
              {t(
                'deleteConfirm',
                'This action cannot be undone. This will permanently delete the gift list.',
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingListId(null)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t('common.delete', 'Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
