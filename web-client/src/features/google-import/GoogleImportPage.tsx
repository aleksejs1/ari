import { Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { api } from '@/lib/axios'

export default function GoogleImportPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [authSuccess, setAuthSuccess] = useState(false)
  const [importCount, setImportCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const code = searchParams.get('code')

  useEffect(() => {
    const handleAuthCheck = async (authCode: string) => {
      setIsAuthenticating(true)
      setError(null)
      try {
        await api.get('../connect/google', {
          params: { code: authCode },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        setAuthSuccess(true)
        // Clear code from URL
        setSearchParams({})
      } catch (err) {
        console.error('Auth verification failed', err)
        setError(t('googleImport.error'))
      } finally {
        setIsAuthenticating(false)
      }
    }

    if (code) {
      handleAuthCheck(code)
    }
  }, [code, setSearchParams, t])

  const handleAuthorize = async () => {
    setError(null)
    try {
      const response = await api.get('../connect/google', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (response.data.url) {
        window.open(response.data.url, '_blank')
      }
    } catch (err) {
      console.error('Failed to get auth URL', err)
      setError(t('googleImport.error'))
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    setError(null)
    setImportCount(null)
    try {
      const response = await api.post(
        '/google/import',
        {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      setImportCount(response.data.imported || 0)
    } catch (err) {
      console.error('Import failed', err)
      setError(t('googleImport.error'))
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('googleImport.title')}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {t('googleImport.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {t(
              'googleImport.description',
              'Connect your Google account to import contacts directly into ari CRM.',
            )}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              onClick={handleAuthorize}
              disabled={isAuthenticating || isImporting}
              variant={authSuccess ? 'outline' : 'default'}
            >
              {isAuthenticating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('googleImport.authorize')}
            </Button>

            <Button onClick={handleImport} disabled={isImporting} variant="default">
              {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('googleImport.import')}
            </Button>
          </div>

          {authSuccess && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('googleImport.authSuccess')}</span>
            </div>
          )}

          {importCount !== null && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('googleImport.success', { count: importCount })}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mt-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
