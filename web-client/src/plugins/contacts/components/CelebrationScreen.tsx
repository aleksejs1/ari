import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface Props {
  onDismiss: () => void
}

export function CelebrationScreen({ onDismiss }: Props) {
  const { t } = useTranslation('contacts')

  return (
    <div
      data-testid="celebration-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-sm"
    >
      <p className="text-6xl">🎉</p>
      <h2 className="text-2xl font-bold">{t('playbook.celebration.headline')}</h2>
      <p className="max-w-sm text-center text-muted-foreground">{t('playbook.celebration.body')}</p>
      <Button onClick={onDismiss}>{t('playbook.celebration.dismiss')}</Button>
    </div>
  )
}
