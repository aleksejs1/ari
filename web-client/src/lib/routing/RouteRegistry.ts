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

  // Note: 'dashboard' and 'sidebar-less' slot names are legacy aliases for 'main'.
  // New plugins should pass 'main' directly.
  public register(slot: RouteSlot | 'dashboard' | 'sidebar-less', route: RouteObject): void {
    // Backward compatibility: both 'dashboard' and 'sidebar-less' map to 'main'
    const resolvedSlot: RouteSlot = slot === 'dashboard' || slot === 'sidebar-less' ? 'main' : slot
    // Deduplicate: skip if a route with the same path is already registered
    if (route.path && this.routes[resolvedSlot].some((r) => r.path === route.path)) {
      return
    }
    this.routes[resolvedSlot].push(route)
  }

  public getRoutes(slot: RouteSlot): RouteObject[] {
    return [...this.routes[slot]]
  }

  public unregister(slot: RouteSlot, path: string): void {
    this.routes[slot] = this.routes[slot].filter((r) => r.path !== path)
  }

  public reset(): void {
    this.routes = { main: [], settings: [], public: [] }
  }
}
