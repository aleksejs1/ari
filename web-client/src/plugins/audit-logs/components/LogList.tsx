import { useTranslation } from 'react-i18next'

import { LogItem } from './LogItem'

import { type TimelineEvent } from '@/types/models'

interface LogListProps {
  logs: TimelineEvent[]
  isPlaceholderData: boolean
  language: string
}

export const LogList = ({ logs, isPlaceholderData, language }: LogListProps) => {
  const { t } = useTranslation()

  if (logs.length === 0) {
    return <div className="p-12 text-center text-gray-500">{t('auditLogs.noLogs')}</div>
  }

  return (
    <div
      className={`divide-y divide-gray-200 dark:divide-gray-700 ${
        isPlaceholderData ? 'opacity-50' : ''
      }`}
    >
      {logs.map((log) => (
        <LogItem key={log.id} log={log} language={language} />
      ))}
    </div>
  )
}
