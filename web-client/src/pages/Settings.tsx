import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useUserPrefs } from '@/hooks/useUserPrefs'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { language, dateFormat, setLanguage, setDateFormat, isLoading } = useUserPrefs()

  if (isLoading) {
    return <div>{t('app.loading')}</div>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">{t('settings.title')}</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.language')}</CardTitle>
            <CardDescription>{t('settings.languageDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={language}
              onValueChange={(val) => setLanguage(val)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ru" id="lang-ru" />
                <Label htmlFor="lang-ru">Русский</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.dateFormat')}</CardTitle>
            <CardDescription>{t('settings.dateFormatDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={dateFormat}
              onValueChange={(val) => setDateFormat(val)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mm/dd/yyyy" id="format-us" />
                <Label htmlFor="format-us">MM/DD/YYYY (12/31/2024)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dd.mm.yyyy" id="format-eu" />
                <Label htmlFor="format-eu">DD.MM.YYYY (31.12.2024)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
