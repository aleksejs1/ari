import type React from 'react'

import type { Contact } from '@/types/models'

export type SectionLayout = 'full' | 'half'

export interface ContactDetailSectionDef {
  id: string
  component: React.ComponentType<{ contact: Contact }>
  order: number
  layout?: SectionLayout
}

export class ContactDetailsRegistry {
  private static instance: ContactDetailsRegistry
  private sections: ContactDetailSectionDef[] = []

  private constructor() {
    // Singleton
  }

  public static getInstance(): ContactDetailsRegistry {
    if (!ContactDetailsRegistry.instance) {
      ContactDetailsRegistry.instance = new ContactDetailsRegistry()
    }
    return ContactDetailsRegistry.instance
  }

  public register(section: ContactDetailSectionDef): void {
    const existingIndex = this.sections.findIndex((s) => s.id === section.id)
    if (existingIndex !== -1) {
      this.sections[existingIndex] = section
    } else {
      this.sections.push(section)
    }
    this.sections.sort((a, b) => a.order - b.order)
  }

  public getAll(): ContactDetailSectionDef[] {
    return this.sections
  }

  public unregister(id: string): void {
    this.sections = this.sections.filter((s) => s.id !== id)
  }

  public reset(): void {
    this.sections = []
  }
}
