import { Icons, useTranslation } from '@ari/plugin-sdk'
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@ari/ui'
import { useState } from 'react'

import { GiftListDialog } from '../components/GiftListDialog'
import { PageLoader } from '../components/PageLoader'
import { useDeleteGiftList, useGiftLists } from '../hooks/useGiftLists'
import type { GiftList } from '../types'

export default function GiftListsPage() {
  const { t } = useTranslation('gift-plugin')
  const { data: giftLists, isLoading } = useGiftLists()
  const [listToEdit, setListToEdit] = useState<GiftList | undefined>()
  const { mutate: deleteGiftList } = useDeleteGiftList()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // ... create/edit handlers ...

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteGiftList(deleteId)
      setDeleteId(null)
    }
  }



  const handleCreate = () => {
    setListToEdit(undefined)
    setIsDialogOpen(true)
  }

  const handleEdit = (list: GiftList) => {
    setListToEdit(list)
    setIsDialogOpen(true)
  }

  // ... (delete handlers remain same)

  if (isLoading) {
    // ... (skeleton remains same)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('title', 'Gift Lists')}</h1>
        <Button onClick={handleCreate}>
          <Icons.Plus className="mr-2 h-4 w-4" />
          {t('common.create', 'Create')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <PageLoader />
        ) : giftLists?.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <Icons.Gift className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">{t('empty.title', 'No gift lists yet')}</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                {t('empty.description', 'Create your first gift list to get started.')}
              </p>
              <Button onClick={handleCreate}>
                <Icons.Plus className="mr-2 h-4 w-4" />
                {t('common.create', 'Create List')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          giftLists?.map((list) => (
            <Card key={list.id} className="group relative overflow-hidden transition-all hover:shadow-md">
              <div onClick={() => handleEdit(list)} className="cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between pr-8">
                    <span className="truncate">{list.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {list.eventDate && (
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      {new Date(list.eventDate).toLocaleDateString()}
                    </p>
                  )}
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {list.description || t('noDescription', 'No description')}
                  </p>
                </CardContent>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 bg-background/80 p-1 rounded-md backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(list)
                  }}
                >
                  <Icons.Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteId(list.id)
                  }}
                >
                  <Icons.Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <GiftListDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        listToEdit={listToEdit}
      />

      <Dialog
        open={!!deleteId} // Changed to deleteId
        onOpenChange={(open: boolean) => !open && setDeleteId(null)} // Changed to setDeleteId
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
            <Button variant="outline" onClick={() => setDeleteId(null)}> {/* Changed to setDeleteId */}
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
