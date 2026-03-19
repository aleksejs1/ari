import { useTranslation } from 'react-i18next'

import { useContactReciprocity } from '../hooks/useContactReciprocity'

interface Props {
  contactId: string | number
}

export function ReciprocityIndicator({ contactId }: Props) {
  const { t } = useTranslation('contacts')
  const { data } = useContactReciprocity(contactId)

  if (!data || (data.me === 0 && data.them === 0)) {
    return null
  }

  return (
    <p className="text-xs text-muted-foreground" data-testid="reciprocity-indicator">
      {t('playbook.reciprocity.label', { me: data.me, them: data.them, days: data.days })}
    </p>
  )
}
