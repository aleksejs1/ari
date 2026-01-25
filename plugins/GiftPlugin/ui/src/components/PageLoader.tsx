import { Skeleton } from '@crm/ui'

export function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  )
}
