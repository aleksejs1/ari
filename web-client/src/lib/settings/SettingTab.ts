import type { ComponentType } from 'react'

export abstract class SettingTab {
  public id: string
  public name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  abstract get Component(): ComponentType
}
