export interface ContactFormSectionDef {
  id: string
  component: React.ComponentType
  order: number
}

export class ContactFormRegistry {
  private static instance: ContactFormRegistry
  private sections: ContactFormSectionDef[] = []

  private constructor() {
    // Singleton
  }

  public static getInstance(): ContactFormRegistry {
    if (!ContactFormRegistry.instance) {
      ContactFormRegistry.instance = new ContactFormRegistry()
    }
    return ContactFormRegistry.instance
  }

  public register(section: ContactFormSectionDef): void {
    const existingIndex = this.sections.findIndex((s) => s.id === section.id)
    if (existingIndex !== -1) {
      this.sections[existingIndex] = section
    } else {
      this.sections.push(section)
    }
    this.sections.sort((a, b) => a.order - b.order)
  }

  public getAll(): ContactFormSectionDef[] {
    return this.sections
  }
}
