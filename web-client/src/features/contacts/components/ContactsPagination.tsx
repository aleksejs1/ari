import { Button } from '@/components/ui/button'

interface ContactsPaginationProps {
  onPrevious: () => void
  onNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}

export function ContactsPagination({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ContactsPaginationProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onPrevious} disabled={!hasPrevious}>
        Previous
      </Button>
      <Button variant="outline" onClick={onNext} disabled={!hasNext}>
        Next
      </Button>
    </div>
  )
}
