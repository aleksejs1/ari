export interface UserMenuSectionDef {
  id: string
  component: React.ComponentType
  order: number
}

export class UserMenuRegistry {
  private static instance: UserMenuRegistry
  private sections: UserMenuSectionDef[] = []

  private constructor() {
    // Singleton
  }

  public static getInstance(): UserMenuRegistry {
    if (!UserMenuRegistry.instance) {
      UserMenuRegistry.instance = new UserMenuRegistry()
    }
    return UserMenuRegistry.instance
  }

  public register(section: UserMenuSectionDef): void {
    const existingIndex = this.sections.findIndex((s) => s.id === section.id)
    if (existingIndex !== -1) {
      this.sections[existingIndex] = section
    } else {
      this.sections.push(section)
    }
    this.sections.sort((a, b) => a.order - b.order)
  }

  public getAll(): UserMenuSectionDef[] {
    return this.sections
  }

  public unregister(id: string): void {
    this.sections = this.sections.filter((s) => s.id !== id)
  }

  public reset(): void {
    this.sections = []
  }
}
