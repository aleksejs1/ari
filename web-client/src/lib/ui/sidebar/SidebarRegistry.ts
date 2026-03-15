export interface SidebarSectionDef {
  id: string
  component: React.ComponentType<{ onNavigate?: () => void; collapsed?: boolean }>
  order: number
}

export class SidebarRegistry {
  private static instance: SidebarRegistry
  private sections: SidebarSectionDef[] = []
  private listeners: (() => void)[] = []

  private constructor() {
    // Singleton
  }

  public static getInstance(): SidebarRegistry {
    if (!SidebarRegistry.instance) {
      SidebarRegistry.instance = new SidebarRegistry()
    }
    return SidebarRegistry.instance
  }

  public register(section: SidebarSectionDef): void {
    const existingIndex = this.sections.findIndex((s) => s.id === section.id)
    if (existingIndex !== -1) {
      this.sections[existingIndex] = section
    } else {
      this.sections.push(section)
    }
    this.sections.sort((a, b) => a.order - b.order)
    this.notify()
  }

  public getAll(): SidebarSectionDef[] {
    return this.sections
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  public unregister(id: string): void {
    const prev = this.sections.length
    this.sections = this.sections.filter((s) => s.id !== id)
    if (this.sections.length !== prev) {
      this.notify()
    }
  }

  public reset(): void {
    this.sections = []
    this.notify()
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener())
  }
}
