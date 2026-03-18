import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/axios'

export interface SmsBackupImportOptions {
  unknownNumbers: 'skip' | 'create'
  nameConflict: 'keep' | 'add' | 'replace'
  skipAlphanumeric: boolean
  duplicateStrategy: 'skip' | 'create'
}

export interface SmsBackupImportResult {
  status: 'queued'
  message: string
}

export function useSmsBackupImport() {
  return useMutation({
    mutationFn: async ({
      files,
      options,
    }: {
      files: File[]
      options: SmsBackupImportOptions
    }): Promise<SmsBackupImportResult> => {
      const formData = new FormData()
      for (const file of files) {
        formData.append('files[]', file)
      }
      formData.append('unknownNumbers', options.unknownNumbers)
      formData.append('nameConflict', options.nameConflict)
      formData.append('skipAlphanumeric', options.skipAlphanumeric ? 'true' : 'false')
      formData.append('duplicateStrategy', options.duplicateStrategy)

      const response = await api.post<SmsBackupImportResult>('/sms_backup/import', formData)
      return response.data
    },
  })
}
