export type SettingControlType = 'text' | 'radio' | 'dropdown' | 'button'

export interface BaseControlConfig {
  type: SettingControlType
  onChange?: (value: any) => void
  value?: any
  label?: string // Label for the specific control (e.g. above input)
}

export interface TextControlConfig extends BaseControlConfig {
  type: 'text'
  placeholder?: string
}

export interface RadioOption {
  value: string
  label: string
}

export interface RadioControlConfig extends BaseControlConfig {
  type: 'radio'
  options: RadioOption[]
}

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownControlConfig extends BaseControlConfig {
  type: 'dropdown'
  options: DropdownOption[]
}

export interface ButtonControlConfig extends BaseControlConfig {
  type: 'button'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onClick?: () => void
  disabled?: boolean
  testId?: string
}

export type ControlConfig =
  | TextControlConfig
  | RadioControlConfig
  | DropdownControlConfig
  | ButtonControlConfig

export interface SettingConfig {
  name: string
  desc: string
  controls: ControlConfig[]
}
