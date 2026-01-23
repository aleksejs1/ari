import type React from 'react'

export interface TopMenuSectionDef {
  id: string
  component: React.ComponentType<{ onNavigate?: () => void }>
  order: number
}

export class TopMenuRegistry {
  private static instance: TopMenuRegistry
  private sections: TopMenuSectionDef[] = []

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): TopMenuRegistry {
    if (!TopMenuRegistry.instance) {
      TopMenuRegistry.instance = new TopMenuRegistry()
    }
    return TopMenuRegistry.instance
  }

  public register(section: TopMenuSectionDef): void {
    const index = this.sections.findIndex((s) => s.id === section.id)
    if (index !== -1) {
      console.warn(`TopMenuSection with id ${section.id} is already registered. Overwriting.`)
      this.sections[index] = section
    } else {
      this.sections.push(section)
    }
    this.sections.sort((a, b) => a.order - b.order)
  }

  public getAll(): TopMenuSectionDef[] {
    return this.sections
  }

  public clear(): void {
    this.sections = []
  }
}
