import { useId } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import type { ControlConfig, SettingConfig } from '../types'

interface SettingItemProps {
  setting: SettingConfig
}

export function SettingItem({ setting }: SettingItemProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{setting.name}</CardTitle>
        <CardDescription>{setting.desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {setting.controls.map((control, idx) => (
          <ControlRenderer key={idx} control={control} />
        ))}
      </CardContent>
    </Card>
  )
}

function ControlRenderer({ control }: { control: ControlConfig }) {
  const uniqueId = useId()

  switch (control.type) {
    case 'text':
      return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          {control.label ? <Label htmlFor={uniqueId}>{control.label}</Label> : null}
          <Input
            id={uniqueId}
            placeholder={control.placeholder}
            value={control.value || ''}
            onChange={(e) => control.onChange?.(e.target.value)}
          />
        </div>
      )
    case 'radio':
      // RadioGroup handles its own internal IDs if we don't provide them,
      // but we need to label the options.
      return (
        <RadioGroup
          value={control.value}
          onValueChange={control.onChange}
          className="flex flex-col space-y-1"
        >
          {control.options.map((opt) => {
            const radioId = `${uniqueId}-${opt.value}`
            return (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={radioId} />
                <Label htmlFor={radioId}>{opt.label}</Label>
              </div>
            )
          })}
        </RadioGroup>
      )
    case 'dropdown':
      return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          {control.label ? <Label htmlFor={uniqueId}>{control.label}</Label> : null}
          <select
            id={uniqueId}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={control.value || ''}
            onChange={(e) => control.onChange?.(e.target.value)}
          >
            {control.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )
    case 'button':
      return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Button variant={control.variant} onClick={control.onClick} disabled={control.disabled}>
            {control.label}
          </Button>
        </div>
      )
    default:
      return null
  }
}
