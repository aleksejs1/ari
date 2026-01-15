import type { ComponentType } from 'react'

export abstract class SettingTab {
  constructor(
    public id: string,
    public name: string,
  ) {}

  abstract get Component(): ComponentType
}
