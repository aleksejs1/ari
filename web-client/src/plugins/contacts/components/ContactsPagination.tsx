import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

interface ContactsPaginationProps {
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
  totalPages: number
}

export function ContactsPagination({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  currentPage,
  totalPages,
}: ContactsPaginationProps) {
  const { t } = useTranslation('contacts')

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {t('pagination.pageInfo', {
          current: currentPage,
          total: totalPages,
        })}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="bg-white px-4 py-2 dark:bg-gray-800"
        >
          {t('pagination.previous')}
        </Button>
        <Button
          variant="outline"
          onClick={onNext}
          disabled={!hasNext}
          className="bg-white px-4 py-2 dark:bg-gray-800"
        >
          {t('pagination.next')}
        </Button>
      </div>
    </div>
  )
}
