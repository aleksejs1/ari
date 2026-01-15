import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useExportContacts, useImportContacts } from '@/features/contacts/useContacts'
import { useNotificationPolicies } from '@/features/notification-policies/useNotificationPolicies'
import { useUserPrefs } from '@/hooks/useUserPrefs.hook'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

export default function SettingsPage() {
  const { t } = useTranslation()
  const {
    language,
    dateFormat,
    timeFormat,
    favouriteGroupName,
    googleSyncOnUpdate,
    setLanguage,
    setDateFormat,
    setTimeFormat,
    setFavouriteGroupName,
    setGoogleSyncOnUpdate,

    dashboardNotificationPolicy,
    setDashboardNotificationPolicy,
    isLoading,
  } = useUserPrefs()
  const { data: notificationPolicies } = useNotificationPolicies()
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

  const settings: SettingConfig[] = []

  // Language
  new Setting(settings)
    .setName(t('settings.language'))
    .setDesc(t('settings.languageDescription'))
    .addRadio((radio) =>
      radio
        .addOption('en', 'English')
        .addOption('ru', 'Русский')
        .setValue(language)
        .onChange((val) => setLanguage(val)),
    )

  // Date Format
  new Setting(settings)
    .setName(t('settings.dateFormat'))
    .setDesc(t('settings.dateFormatDescription'))
    .addRadio((radio) =>
      radio
        .addOption('mm/dd/yyyy', 'MM/DD/YYYY (12/31/2024)')
        .addOption('dd.mm.yyyy', 'DD.MM.YYYY (31.12.2024)')
        .setValue(dateFormat)
        .onChange((val) => setDateFormat(val)),
    )

  // Time Format
  new Setting(settings)
    .setName(t('settings.timeFormat'))
    .setDesc(t('settings.timeFormatDescription'))
    .addRadio((radio) =>
      radio
        .addOption('24h', '24h (21:00)')
        .addOption('12h', '12h (09:00 PM)')
        .setValue(timeFormat)
        .onChange((val) => setTimeFormat(val)),
    )

  // Favourite Group Name
  new Setting(settings)
    .setName(t('settings.favouriteGroupName'))
    .setDesc(t('settings.favouriteGroupNameDescription'))
    .addText((text) =>
      text
        .setLabel(t('settings.groupName'))
        .setValue(favouriteGroupName)
        .onChange((val) => setFavouriteGroupName(val)),
    )

  // Google Sync
  new Setting(settings)
    .setName(t('settings.googleSyncOnUpdate'))
    .setDesc(t('settings.googleSyncOnUpdateDescription'))
    .addRadio((radio) =>
      radio
        .addOption('1', t('settings.enabled'))
        .addOption('0', t('settings.disabled'))
        .setValue(googleSyncOnUpdate)
        .onChange((val) => setGoogleSyncOnUpdate(val)),
    )

  // Dashboard Notification Policy
  const notificationPolicyBuilder = new Setting(settings)
    .setName(t('settings.dashboardNotificationPolicy'))
    .setDesc(t('settings.dashboardNotificationPolicyDescription'))

  notificationPolicyBuilder.addDropdown((dropdown) => {
    dropdown
      .addOption('', t('common.none'))
      .setValue(dashboardNotificationPolicy)
      .onChange((val) => setDashboardNotificationPolicy(val))

    if (notificationPolicies) {
      notificationPolicies.forEach((p) => {
        dropdown.addOption(String(p.id), p.name || '')
      })
    }
  })

  // Export Data
  new Setting(settings)
    .setName(t('settings.exportData'))
    .setDesc(t('settings.exportDataDescription'))
    .addButton((btn) =>
      btn
        .setButtonText(isExporting ? t('common.loading') : t('settings.exportData'))
        .setDisabled(isExporting)
        .onClick(() => exportContacts()),
    )

  // Import Data
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  new Setting(settings)
    .setName(t('settings.importData'))
    .setDesc(t('settings.importDataDescription'))
    // eslint-disable-next-line
    .addButton((btn) =>
      btn
        .setButtonText(isImporting ? t('common.loading') : t('settings.importData'))
        .setVariant('secondary')
        .setDisabled(isImporting)
        .onClick(handleImportClick),
    )

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">{t('settings.title')}</h1>

      <div className="grid gap-6">
        {settings.map((setting, idx) => (
          <SettingItem key={idx} setting={setting} />
        ))}
      </div>

      <input
        type="file"
        accept=".xml"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImport}
      />
    </div>
  )
}
