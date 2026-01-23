import { useRef, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'
import { useExportContacts, useImportContacts } from '@/plugins/contacts/useContacts'

export function DataSettings() {
  const { t } = useTranslation()
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

  // Import Data Click Handler
  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const settings = useMemo(() => {
    const settingsContainer: SettingConfig[] = []

    // Export Data
    new Setting(settingsContainer)
      .setName(t('settings.exportData'))
      .setDesc(t('settings.exportDataDescription'))
      .addButton((btn) =>
        btn
          .setButtonText(isExporting ? t('common.loading') : t('settings.exportData'))
          .setDisabled(isExporting)
          .onClick(() => exportContacts()),
      )

    // Import Data
    new Setting(settingsContainer)
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

    return settingsContainer
  }, [t, isExporting, isImporting, exportContacts, handleImportClick])

  return (
    <div className="space-y-6">
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
