import { useTranslation } from 'react-i18next'
import { Check, LayoutGrid, RotateCcw, X } from 'lucide-react'

interface DashboardEditToolbarProps {
  onSave: () => void
  onCancel: () => void
  onReset: () => void
  onChangeLayout: () => void
}

export default function DashboardEditToolbar({
  onSave,
  onCancel,
  onReset,
  onChangeLayout,
}: DashboardEditToolbarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onChangeLayout}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      >
        <LayoutGrid className="h-4 w-4" />
        {t('dashboard.edit.changeLayout', 'Layout')}
      </button>
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      >
        <RotateCcw className="h-4 w-4" />
        {t('dashboard.edit.reset', 'Reset')}
      </button>
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <X className="h-4 w-4" />
        {t('dashboard.edit.cancel', 'Cancel')}
      </button>
      <button
        onClick={onSave}
        className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
      >
        <Check className="h-4 w-4" />
        {t('dashboard.edit.done', 'Done')}
      </button>
    </div>
  )
}
