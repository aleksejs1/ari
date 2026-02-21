import type {
  ButtonControlConfig,
  DropdownControlConfig,
  RadioControlConfig,
  SettingConfig,
  TextControlConfig,
} from './types'

// --- Builders ---

export class TextBuilder {
  private config: Partial<TextControlConfig> = { type: 'text' }

  setPlaceholder(placeholder: string): this {
    this.config.placeholder = placeholder
    return this
  }

  setLabel(label: string): this {
    this.config.label = label
    return this
  }

  setValue(value: string): this {
    this.config.value = value
    return this
  }

  onChange(cb: (value: string) => void): this {
    this.config.onChange = cb
    return this
  }

  build(): TextControlConfig {
    return this.config as TextControlConfig
  }
}

export class RadioBuilder {
  private config: Partial<RadioControlConfig> = { type: 'radio', options: [] }

  addOption(value: string, label: string): this {
    this.config.options?.push({ value, label })
    return this
  }

  setValue(value: string): this {
    this.config.value = value
    return this
  }

  onChange(cb: (value: string) => void): this {
    this.config.onChange = cb
    return this
  }

  build(): RadioControlConfig {
    return this.config as RadioControlConfig
  }
}

export class DropdownBuilder {
  private config: Partial<DropdownControlConfig> = { type: 'dropdown', options: [] }

  addOption(value: string, label: string): this {
    this.config.options?.push({ value, label })
    return this
  }

  setLabel(label: string): this {
    this.config.label = label
    return this
  }

  setValue(value: string): this {
    this.config.value = value
    return this
  }

  onChange(cb: (value: string) => void): this {
    this.config.onChange = cb
    return this
  }

  build(): DropdownControlConfig {
    return this.config as DropdownControlConfig
  }
}

export class ButtonBuilder {
  private config: Partial<ButtonControlConfig> = { type: 'button', variant: 'default' }

  setButtonText(text: string): this {
    this.config.label = text
    return this
  }

  setVariant(variant: ButtonControlConfig['variant']): this {
    this.config.variant = variant
    return this
  }

  setDisabled(disabled: boolean): this {
    this.config.disabled = disabled
    return this
  }

  setTestId(testId: string): this {
    this.config.testId = testId
    return this
  }

  onClick(cb: () => void): this {
    this.config.onClick = cb
    return this
  }

  build(): ButtonControlConfig {
    return this.config as ButtonControlConfig
  }
}

// --- Main Setting Class ---

export class Setting {
  private config: SettingConfig
  private container: SettingConfig[]

  /**
   * @param container An array that holds the generated Setting configurations.
   */
  constructor(container: SettingConfig[]) {
    this.container = container
    this.config = {
      name: '',
      desc: '',
      controls: [],
    }
    this.container.push(this.config)
  }

  setName(name: string): this {
    this.config.name = name
    return this
  }

  setDesc(desc: string): this {
    this.config.desc = desc
    return this
  }

  addText(cb: (builder: TextBuilder) => void): this {
    const builder = new TextBuilder()
    cb(builder)
    this.config.controls.push(builder.build())
    return this
  }

  addRadio(cb: (builder: RadioBuilder) => void): this {
    const builder = new RadioBuilder()
    cb(builder)
    this.config.controls.push(builder.build())
    return this
  }

  addDropdown(cb: (builder: DropdownBuilder) => void): this {
    const builder = new DropdownBuilder()
    cb(builder)
    this.config.controls.push(builder.build())
    return this
  }

  addButton(cb: (builder: ButtonBuilder) => void): this {
    const builder = new ButtonBuilder()
    cb(builder)
    this.config.controls.push(builder.build())
    return this
  }
}
