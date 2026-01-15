import { describe, expect, it, vi } from 'vitest'

import { Setting } from './Setting'
import type { SettingConfig } from './types'

describe('Setting Builder', () => {
  it('should build a simple setting with text config', () => {
    const container: SettingConfig[] = []
    new Setting(container)
      .setName('Test Setting')
      .setDesc('Description')
      .addText((text) => text.setValue('foo'))

    expect(container).toHaveLength(1)
    expect(container[0].name).toBe('Test Setting')
    expect(container[0].desc).toBe('Description')
    expect(container[0].controls).toHaveLength(1)
    expect(container[0].controls[0].type).toBe('text')
    expect(container[0].controls[0].value).toBe('foo')
  })

  it('should support multiple controls', () => {
    const container: SettingConfig[] = []
    new Setting(container)
      .setName('Multi')
      .addText((t) => t)
      .addRadio((r) => r)

    expect(container[0].controls).toHaveLength(2)
    expect(container[0].controls[0].type).toBe('text')
    expect(container[0].controls[1].type).toBe('radio')
  })

  it('should handle callbacks correctly', () => {
    const container: SettingConfig[] = []
    const cb = vi.fn()

    new Setting(container).addText((t) => t.onChange(cb))

    const control = container[0].controls[0]
    if (control.onChange) {
      control.onChange('test')
    }
    expect(cb).toHaveBeenCalledWith('test')
  })

  it('should build button correctly', () => {
    const container: SettingConfig[] = []
    const cb = vi.fn()
    new Setting(container).addButton((b) => b.setButtonText('Click Me').onClick(cb))

    const control = container[0].controls[0]
    expect(control.type).toBe('button')
    // @ts-expect-error - we know it's a button
    expect(control.label).toBe('Click Me')

    if (control.onChange) {
      // Button doesn't strictly have onChange used by builder but defined in Base.
      // onClick is what matters
    }
    // @ts-expect-error - cast or check props
    control.onClick?.()
    expect(cb).toHaveBeenCalled()
  })
})
