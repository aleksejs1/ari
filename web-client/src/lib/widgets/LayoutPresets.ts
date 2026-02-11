export interface LayoutZone {
  id: string
  label: string
  basis?: string
}

export interface LayoutPreset {
  id: string
  name: string
  description: string
  zones: LayoutZone[]
}

class LayoutPresetRegistry {
  private presets: Map<string, LayoutPreset> = new Map()

  register(preset: LayoutPreset) {
    this.presets.set(preset.id, preset)
  }

  get(id: string): LayoutPreset | undefined {
    return this.presets.get(id)
  }

  getAll(): LayoutPreset[] {
    return Array.from(this.presets.values())
  }
}

export const layoutPresetRegistry = new LayoutPresetRegistry()

// Register default preset
layoutPresetRegistry.register({
  id: 'two-column',
  name: 'dashboard.layout.twoColumn',
  description: 'dashboard.layout.twoColumn.description',
  zones: [
    { id: 'full', label: 'dashboard.zone.full', basis: '100%' },
    { id: 'left', label: 'dashboard.zone.left', basis: '7/12' },
    { id: 'right', label: 'dashboard.zone.right', basis: '5/12' },
  ],
})
