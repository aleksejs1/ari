import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { Loader2, Upload } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

import type { SmsBackupImportOptions } from '../hooks/useSmsBackupImport'
import { useSmsBackupImport } from '../hooks/useSmsBackupImport'

const DEFAULT_OPTIONS: SmsBackupImportOptions = {
  unknownNumbers: 'skip',
  nameConflict: 'keep',
  skipAlphanumeric: true,
  duplicateStrategy: 'skip',
}

type ImportState = 'idle' | 'queued' | 'error'

export function PhoneBackupImportSection() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [options, setOptions] = useState<SmsBackupImportOptions>(DEFAULT_OPTIONS)
  const [importState, setImportState] = useState<ImportState>('idle')
  const [apiErrorDetail, setApiErrorDetail] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const { mutate: runImport, isPending } = useSmsBackupImport()

  useEffect(() => {
    return () => {
      if (successTimerRef.current !== null) {
        clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 2)
    setSelectedFiles(files)
    setImportState('idle')
  }

  const handleDropzoneClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
      .filter((f) => f.name.toLowerCase().endsWith('.xml'))
      .slice(0, 2)
    if (files.length === 0) {
      return
    }
    setSelectedFiles(files)
    setImportState('idle')
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleSubmit = () => {
    if (selectedFiles.length === 0 || isPending) {
      return
    }

    runImport(
      { files: selectedFiles, options },
      {
        onSuccess: () => {
          setImportState('queued')
          setApiErrorDetail(null)
          setSelectedFiles([])
          setOptions(DEFAULT_OPTIONS)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          if (successTimerRef.current !== null) {
            clearTimeout(successTimerRef.current)
          }
          successTimerRef.current = setTimeout(() => {
            setImportState('idle')
          }, 10000)
        },
        onError: (error) => {
          let detail: string | null = null
          if (axios.isAxiosError(error) && error.response?.data) {
            const data = error.response.data as { detail?: string }
            if (typeof data.detail === 'string' && data.detail.length > 0) {
              detail = data.detail
            }
          }
          setApiErrorDetail(detail)
          setImportState('error')
        },
      },
    )
  }

  const setUnknownNumbers = (value: SmsBackupImportOptions['unknownNumbers']) => {
    setOptions((prev) => ({ ...prev, unknownNumbers: value }))
  }

  const setNameConflict = (value: SmsBackupImportOptions['nameConflict']) => {
    setOptions((prev) => ({ ...prev, nameConflict: value }))
  }

  const setSkipAlphanumeric = (checked: boolean) => {
    setOptions((prev) => ({ ...prev, skipAlphanumeric: checked }))
  }

  const setDuplicateStrategy = (value: SmsBackupImportOptions['duplicateStrategy']) => {
    setOptions((prev) => ({ ...prev, duplicateStrategy: value }))
  }

  const fileLabel =
    selectedFiles.length > 0
      ? selectedFiles.map((f) => f.name).join(', ')
      : t('settings.phoneBackup.dropzone')

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium">{t('settings.phoneBackup.title')}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t('settings.phoneBackup.description')}
        </p>
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        className={[
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/30 hover:border-muted-foreground/60',
        ].join(' ')}
        onClick={handleDropzoneClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleDropzoneClick()
          }
        }}
      >
        <Upload className="mb-2 h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium">{fileLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('settings.phoneBackup.dropzoneHint')}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">{t('settings.phoneBackup.dropzoneHelper')}</p>

      <input
        type="file"
        accept=".xml"
        multiple
        className="hidden"
        ref={fileInputRef}
        data-testid="phone-backup-file-input"
        aria-label={t('settings.phoneBackup.dropzone')}
        onChange={handleFileChange}
      />

      {/* Options */}
      <div className="space-y-4">
        {/* Unknown contacts */}
        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium">
            {t('settings.phoneBackup.options.unknownNumbers')}
          </legend>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            {(['skip', 'create'] as const).map((v) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="unknownNumbers"
                  value={v}
                  checked={options.unknownNumbers === v}
                  onChange={() => setUnknownNumbers(v)}
                  className="accent-primary"
                />
                {t(`settings.phoneBackup.options.unknownNumbers.${v}`)}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Name conflict */}
        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium">
            {t('settings.phoneBackup.options.nameConflict')}
          </legend>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            {(['keep', 'add', 'replace'] as const).map((v) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="nameConflict"
                  value={v}
                  checked={options.nameConflict === v}
                  onChange={() => setNameConflict(v)}
                  className="accent-primary"
                />
                {t(`settings.phoneBackup.options.nameConflict.${v}`)}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Skip alphanumeric */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="skipAlphanumeric"
            checked={options.skipAlphanumeric}
            onCheckedChange={(checked) => setSkipAlphanumeric(checked === true)}
          />
          <Label htmlFor="skipAlphanumeric" className="cursor-pointer text-sm font-normal">
            {t('settings.phoneBackup.options.skipAlphanumeric')}
          </Label>
        </div>

        {/* Duplicate strategy */}
        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium">
            {t('settings.phoneBackup.options.duplicateStrategy')}
          </legend>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
            {(['skip', 'create'] as const).map((v) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="duplicateStrategy"
                  value={v}
                  checked={options.duplicateStrategy === v}
                  onChange={() => setDuplicateStrategy(v)}
                  className="accent-primary"
                />
                {t(`settings.phoneBackup.options.duplicateStrategy.${v}`)}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={selectedFiles.length === 0 || isPending}
        data-testid="phone-backup-import-button"
        aria-label={isPending ? t('settings.phoneBackup.processing') : undefined}
        className="w-full sm:w-auto"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>{t('settings.phoneBackup.processing')}</span>
          </>
        ) : (
          t('settings.phoneBackup.submit')
        )}
      </Button>

      {/* Result banners */}
      {importState === 'queued' ? (
        <Alert data-testid="phone-backup-import-success">
          <AlertDescription>{t('settings.phoneBackup.queued')}</AlertDescription>
        </Alert>
      ) : null}

      {importState === 'error' ? (
        <Alert variant="destructive" data-testid="phone-backup-import-error">
          <AlertTitle>{t('settings.phoneBackup.error')}</AlertTitle>
          {apiErrorDetail !== null ? <AlertDescription>{apiErrorDetail}</AlertDescription> : null}
        </Alert>
      ) : null}
    </div>
  )
}
