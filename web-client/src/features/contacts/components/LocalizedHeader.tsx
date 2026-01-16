import { useTranslation } from 'react-i18next'

interface LocalizedHeaderProps {
  name: string
}

export function LocalizedHeader({ name }: LocalizedHeaderProps) {
  const { t } = useTranslation()
  return <>{t(name)}</>
}
