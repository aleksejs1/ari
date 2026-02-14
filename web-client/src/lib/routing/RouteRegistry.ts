import { type RouteObject } from 'react-router-dom'

export type RouteSlot = 'main' | 'settings' | 'public'

export class RouteRegistry {
  private static instance: RouteRegistry
  private routes: Record<RouteSlot, RouteObject[]> = {
    main: [],
    settings: [],
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

  public register(slot: RouteSlot | 'dashboard' | 'sidebar-less', route: RouteObject): void {
    // Backward compatibility: both 'dashboard' and 'sidebar-less' map to 'main'
    const resolvedSlot: RouteSlot = slot === 'dashboard' || slot === 'sidebar-less' ? 'main' : slot
    this.routes[resolvedSlot].push(route)
  }

  public getRoutes(slot: RouteSlot): RouteObject[] {
    return this.routes[slot]
  }
}
