import { useState } from 'react'

import { Input } from './input'

import { cn } from '@/lib/utils'

interface TimeInputProps {
  value?: string // 24h format HH:mm
  onChange: (value: string) => void
  format: '12h' | '24h'
  className?: string
}

const parseTime = (value: string): { h: number; mStr: string } | null => {
  if (!value) {
    return null
  }
  const [hStr, mStr] = value.split(':')
  const h = parseInt(hStr, 10)
  if (isNaN(h)) {
    return null
  }
  return { h, mStr }
}

const getInitialState = (
  h: number,
  mStr: string,
  format: '12h' | '24h',
): { hour: string; minute: string; period: 'AM' | 'PM' } => {
  if (format === '24h') {
    return { hour: h.toString(), minute: mStr, period: 'AM' }
  }

  let period: 'AM' | 'PM' = 'AM'
  let hourVal = h

  if (h >= 12) {
    period = 'PM'
    if (h > 12) {
      hourVal = h - 12
    }
  }
  if (h === 0) {
    hourVal = 12
  }

  return { hour: hourVal.toString(), minute: mStr, period }
}

const clampHour = (h: number, format: '12h' | '24h'): number => {
  const maxHour = format === '24h' ? 23 : 12
  const minHour = format === '24h' ? 0 : 1
  return Math.min(Math.max(h, minHour), maxHour)
}

const clampMinute = (m: number): number => {
  return Math.min(Math.max(m, 0), 59)
}

const convertTo24h = (h: number, period: 'AM' | 'PM'): number => {
  if (period === 'PM' && h !== 12) {
    return h + 12
  }
  if (period === 'AM' && h === 12) {
    return 0
  }
  return h
}

const calculateNewTime = (
  newHour: string,
  newMinute: string,
  newPeriod: 'AM' | 'PM',
  format: '12h' | '24h',
): string => {
  let h = parseInt(newHour, 10)
  if (isNaN(h)) {
    h = format === '24h' ? 0 : 12
  }
  h = clampHour(h, format)

  let m = parseInt(newMinute, 10)
  if (isNaN(m)) {
    m = 0
  }
  m = clampMinute(m)

  let h24 = h
  if (format === '12h') {
    h24 = convertTo24h(h, newPeriod)
  }

  const h24Str = h24.toString().padStart(2, '0')
  const mStr = m.toString().padStart(2, '0')
  return `${h24Str}:${mStr}`
}

export function TimeInput({ value = '00:00', onChange, format, className }: TimeInputProps) {
  return (
    <TimeInputInner
      // Key forces re-mount if format changes, but we want to preserve state if possible?
      // Actually, relying on key might be simpler if we don't care about transition,
      // but let's stick to the sync pattern.
      value={value}
      onChange={onChange}
      format={format}
      className={className}
    />
  )
}

function TimeInputInner({
  value,
  onChange,
  format,
  className,
}: TimeInputProps & { value: string }) {
  const [state, setState] = useState(() => {
    const parsed = parseTime(value)
    if (parsed) {
      return getInitialState(parsed.h, parsed.mStr, format)
    }
    return { hour: '', minute: '', period: 'AM' as const }
  })

  // Track previous value to sync state if props change externally
  const [prevValue, setPrevValue] = useState(value)
  const [prevFormat, setPrevFormat] = useState(format)

  if (value !== prevValue || format !== prevFormat) {
    const parsed = parseTime(value)
    if (parsed) {
      setState(getInitialState(parsed.h, parsed.mStr, format))
    }
    setPrevValue(value)
    setPrevFormat(format)
  }

  const handleChange = (field: 'hour' | 'minute' | 'period', val: string) => {
    // Optimistic update
    const newState = { ...state, [field]: val }
    setState(newState)

    if (val === '' && field !== 'period') {
      return
    }

    const newTime = calculateNewTime(newState.hour, newState.minute, newState.period, format)
    onChange(newTime)
  }

  const is12h = format === '12h'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Input
        type="number"
        min={is12h ? 1 : 0}
        max={is12h ? 12 : 23}
        value={state.hour}
        onChange={(e) => handleChange('hour', e.target.value)}
        className="w-16 text-center"
        placeholder="HH"
      />
      <span className="text-xl">:</span>
      <Input
        type="number"
        min={0}
        max={59}
        value={state.minute}
        onChange={(e) => handleChange('minute', e.target.value)}
        className="w-16 text-center"
        placeholder="MM"
      />
      {is12h ? (
        <select
          value={state.period}
          onChange={(e) => handleChange('period', e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      ) : null}
    </div>
  )
}
