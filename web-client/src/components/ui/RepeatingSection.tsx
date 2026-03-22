import { Fragment, type ReactNode } from 'react'
import type { ArrayPath, Control, FieldArray, FieldArrayWithId, FieldValues } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface RepeatingSectionProps<T extends FieldValues> {
  control: Control<T>
  name: ArrayPath<T>
  addLabel: string
  defaultValue: FieldArray<T, ArrayPath<T>>
  renderRow: (
    field: FieldArrayWithId<T, ArrayPath<T>>,
    index: number,
    onRemove: () => void,
  ) => ReactNode
}

export function RepeatingSection<T extends FieldValues>({
  control,
  name,
  addLabel,
  defaultValue,
  renderRow,
}: RepeatingSectionProps<T>) {
  const { fields, append, remove } = useFieldArray({ control, name })

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <Fragment key={field.id}>{renderRow(field, index, () => remove(index))}</Fragment>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start pl-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={() => append(defaultValue)}
      >
        <Plus className="mr-2 h-4 w-4" /> {addLabel}
      </Button>
    </div>
  )
}
