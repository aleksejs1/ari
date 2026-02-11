import type React from 'react'

export interface WidgetDefinition {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType
  component: React.ComponentType
  defaultDimensions: { w: number; h: number }
}

class WidgetRegistry {
  private widgets: Map<string, WidgetDefinition> = new Map<string, WidgetDefinition>()

  register(def: WidgetDefinition) {
    if (this.widgets.has(def.id)) {
      console.warn(`Widget with id ${def.id} is already registered. Overwriting.`)
    }
    this.widgets.set(def.id, def)
  }

  get(id: string): WidgetDefinition | undefined {
    return this.widgets.get(id)
  }

  getAll(): WidgetDefinition[] {
    return Array.from(this.widgets.values())
  }
}

export const widgetRegistry = new WidgetRegistry()
