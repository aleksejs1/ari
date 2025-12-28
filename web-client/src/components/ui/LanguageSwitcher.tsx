import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en'
    void i18n.changeLanguage(newLang)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="w-full justify-start gap-2"
    >
      <span className="text-lg">{i18n.language === 'en' ? '🇷🇺' : '🇺🇸'}</span>
      <span>{i18n.language === 'en' ? 'Rus' : 'Eng'}</span>
    </Button>
  )
}
