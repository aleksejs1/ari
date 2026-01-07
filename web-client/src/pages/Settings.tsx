import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useExportContacts, useImportContacts } from '@/features/contacts/useContacts'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'

export default function SettingsPage() {
  const { t } = useTranslation()
  const {
    language,
    dateFormat,
    timeFormat,
    favouriteGroupName,
    setLanguage,
    setDateFormat,
    setTimeFormat,
    setFavouriteGroupName,
    isLoading,
  } = useUserPrefs()
  const { mutate: exportContacts, isPending: isExporting } = useExportContacts()
  const { mutate: importContacts, isPending: isImporting } = useImportContacts()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    importContacts(file, {
      onSuccess: () => {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        alert(t('settings.importSuccess'))
      },
      onError: () => {
        alert(t('settings.importError'))
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
    })
  }

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

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.timeFormat')}</CardTitle>
            <CardDescription>{t('settings.timeFormatDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={timeFormat}
              onValueChange={(val) => setTimeFormat(val)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="format-24h" />
                <Label htmlFor="format-24h">24h (21:00)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="format-12h" />
                <Label htmlFor="format-12h">12h (09:00 PM)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.favouriteGroupName')}</CardTitle>
            <CardDescription>{t('settings.favouriteGroupNameDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="fav-group-name">{t('settings.groupName')}</Label>
              <Input
                type="text"
                id="fav-group-name"
                value={favouriteGroupName}
                onChange={(e) => setFavouriteGroupName(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.exportData')}</CardTitle>
            <CardDescription>{t('settings.exportDataDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => exportContacts()} disabled={isExporting}>
              {isExporting ? t('common.loading') : t('settings.exportData')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.importData')}</CardTitle>
            <CardDescription>{t('settings.importDataDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept=".xml"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImport}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              variant="secondary"
            >
              {isImporting ? t('common.loading') : t('settings.importData')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
