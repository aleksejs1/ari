import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SettingItem } from '@/lib/settings/components/SettingItem'
import { Setting } from '@/lib/settings/Setting'
import type { SettingConfig } from '@/lib/settings/types'

import { useExportContacts, useImportContacts } from '@/plugins/contacts/useContacts'

interface SkippedContact {
  name: string
  email: string
}

type ImportResult =
  | { status: 'success' }
  | { status: 'partial'; imported: number; skipped: number; skippedContacts: SkippedContact[] }
  | { status: 'quota_exceeded' }
  | { status: 'error' }

export function DataSettings() {
  const { t } = useTranslation()
  const { mutate: exportContacts, isPending: isExporting } = useExportContacts()
  const { mutate: importContacts, isPending: isImporting } = useImportContacts()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    setImportResult(null)

    importContacts(file, {
      onSuccess: (data) => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        const result = data as
          | { imported: number; skipped: number; skippedContacts: SkippedContact[] }
          | null
          | undefined
        if (result && typeof result === 'object' && result.skipped > 0) {
          setImportResult({
            status: 'partial',
            imported: result.imported,
            skipped: result.skipped,
            skippedContacts: result.skippedContacts ?? [],
          })
        } else {
          setImportResult({ status: 'success' })
        }
      },
      onError: (error) => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          setImportResult({ status: 'quota_exceeded' })
        } else {
          setImportResult({ status: 'error' })
        }
      },
    })
  }

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
          .setTestId('export-data-button')
          .onClick(() => exportContacts()),
      )

    // Import Data
    new Setting(settingsContainer)
      .setName(t('settings.importData'))
      .setDesc(t('settings.importDataDescription'))
      .addButton((btn) =>
        btn
          .setButtonText(isImporting ? t('common.loading') : t('settings.importData'))
          .setVariant('secondary')
          .setDisabled(isImporting)
          .setTestId('import-data-button')
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

      {importResult?.status === 'success' ? (
        <Alert>
          <AlertDescription>{t('settings.importSuccess')}</AlertDescription>
        </Alert>
      ) : null}

      {importResult?.status === 'quota_exceeded' ? (
        <Alert variant="destructive">
          <AlertTitle>{t('settings.importQuotaExceeded')}</AlertTitle>
        </Alert>
      ) : null}

      {importResult?.status === 'error' ? (
        <Alert variant="destructive">
          <AlertDescription>{t('settings.importError')}</AlertDescription>
        </Alert>
      ) : null}

      {importResult?.status === 'partial' ? (
        <Alert>
          <AlertTitle>
            {t('settings.importPartial', {
              imported: importResult.imported,
              skipped: importResult.skipped,
            })}
          </AlertTitle>
          {importResult.skippedContacts.length > 0 ? (
            <AlertDescription>
              <p className="mb-1 mt-2 font-medium">{t('settings.importSkippedContacts')}</p>
              <ul className="space-y-0.5 text-xs">
                {importResult.skippedContacts.map((c, i) => (
                  <li key={i}>
                    {c.name}
                    {c.email ? ` — ${c.email}` : ''}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          ) : null}
        </Alert>
      ) : null}

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
