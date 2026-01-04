import type React from 'react'

export const DisplayItem = ({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: React.ElementType
  label?: string
  value?: string | null
  subValue?: string | null
}) => {
  if (!value) {
    return null
  }
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-1 rounded-md bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 space-y-1">
        {!!label && <p className="text-xs font-medium text-muted-foreground">{label}</p>}
        <p className="text-sm font-medium leading-none">{value}</p>
        {!!subValue && <p className="text-sm text-muted-foreground">{subValue}</p>}
      </div>
    </div>
  )
}
