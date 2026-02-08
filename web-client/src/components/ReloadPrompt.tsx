import { useTranslation } from 'react-i18next'
import { RotateCw } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useReload } from '@/contexts/ReloadContext'

export function ReloadPrompt() {
  const { t } = useTranslation()
  const { reloadNeeded } = useReload()

  if (!reloadNeeded) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in slide-in-from-bottom-5">
      <Alert className="border-primary bg-background shadow-lg">
        <RotateCw className="h-4 w-4" />
        <AlertTitle>{t('app.reloadRequired')}</AlertTitle>
        <AlertDescription className="mt-2 flex items-center justify-between gap-4">
          <span>{t('app.reloadDescription')}</span>
          <Button size="sm" onClick={() => window.location.reload()}>
            {t('app.reload')}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
