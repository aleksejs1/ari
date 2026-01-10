import { Trash2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteProfile } from '@/features/users/hooks/useDeleteProfile'

export default function DeleteAccountPage() {
  const { t } = useTranslation()
  const { mutate: deleteAccount, isPending } = useDeleteProfile()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDelete = () => {
    deleteAccount()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700 dark:text-red-400">
            {t('settings.deleteAccount.title', 'Delete Account')}
          </CardTitle>
          <CardDescription className="text-red-600/80 dark:text-red-400/80">
            {t(
              'settings.deleteAccount.description',
              'Once you delete your account, there is no going back. Please be certain.',
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t(
              'settings.deleteAccount.warning',
              'Deleting your account will permanently remove all your contacts, groups, settings, and activity history from our servers. This action cannot be undone.',
            )}
          </p>
          <Button variant="destructive" onClick={() => setIsModalOpen(true)} className="gap-2">
            <Trash2 className="h-4 w-4" />
            {t('settings.deleteAccount.button', 'Delete My Account')}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('settings.deleteAccount.modalTitle', 'Are you absolutely sure?')}
            </DialogTitle>
            <DialogDescription>
              {t(
                'settings.deleteAccount.modalDescription',
                'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isPending}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending
                ? t('common.saving')
                : t('settings.deleteAccount.confirmButton', 'Yes, delete my account')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
