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

// Register built-in presets
layoutPresetRegistry.register({
  id: 'single-column',
  name: 'dashboard.layout.singleColumn',
  description: 'dashboard.layout.singleColumn.description',
  zones: [{ id: 'main', label: 'dashboard.zone.main', basis: '100%' }],
})

layoutPresetRegistry.register({
  id: 'two-column',
  name: 'dashboard.layout.twoColumn',
  description: 'dashboard.layout.twoColumn.description',
  zones: [
    { id: 'full', label: 'dashboard.zone.full', basis: '100%' },
    { id: 'left', label: 'dashboard.zone.left', basis: '1/2' },
    { id: 'right', label: 'dashboard.zone.right', basis: '1/2' },
  ],
})

layoutPresetRegistry.register({
  id: 'three-column',
  name: 'dashboard.layout.threeColumn',
  description: 'dashboard.layout.threeColumn.description',
  zones: [
    { id: 'full', label: 'dashboard.zone.full', basis: '100%' },
    { id: 'left', label: 'dashboard.zone.left', basis: '1/3' },
    { id: 'center', label: 'dashboard.zone.center', basis: '1/3' },
    { id: 'right', label: 'dashboard.zone.right', basis: '1/3' },
  ],
})

layoutPresetRegistry.register({
  id: 'sidebar-right',
  name: 'dashboard.layout.sidebarRight',
  description: 'dashboard.layout.sidebarRight.description',
  zones: [
    { id: 'full', label: 'dashboard.zone.full', basis: '100%' },
    { id: 'main', label: 'dashboard.zone.main', basis: '8/12' },
    { id: 'sidebar', label: 'dashboard.zone.sidebar', basis: '4/12' },
  ],
})
