import { type RouteObject } from 'react-router-dom'

export type RouteSlot = 'dashboard' | 'sidebar-less' | 'public'

export class RouteRegistry {
  private static instance: RouteRegistry
  private routes: Record<RouteSlot, RouteObject[]> = {
    dashboard: [],
    'sidebar-less': [],
    public: [],
  }

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): RouteRegistry {
    if (!RouteRegistry.instance) {
      RouteRegistry.instance = new RouteRegistry()
    }
    return RouteRegistry.instance
  }

  public register(slot: RouteSlot, route: RouteObject): void {
    this.routes[slot].push(route)
  }

  public getRoutes(slot: RouteSlot): RouteObject[] {
    return this.routes[slot]
  }
}
