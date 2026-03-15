/**
 * Lightweight typed event bus for inter-plugin communication.
 *
 * Plugins should NOT import each other directly (plugin isolation rule).
 * Instead they communicate via named events declared in this registry.
 *
 * Usage:
 *   // Publisher (contacts plugin)
 *   pluginEventBus.emit('contacts:updated', { id: 42 })
 *
 *   // Subscriber (groups plugin)
 *   const off = pluginEventBus.on('contacts:updated', ({ id }) => { ... })
 *   // Call off() in useEffect cleanup to avoid memory leaks
 */

export interface PluginEvents {
  // Contacts
  'contacts:created': { id: number }
  'contacts:updated': { id: number }
  'contacts:deleted': { id: number }
  // Groups
  'groups:updated': { id: number }
  // AI suggestions
  'ai_suggestion:resolved': { id: number; status: 'accepted' | 'dismissed' }
  // Notifications
  'notifications:new': { count: number }
}

type EventName = keyof PluginEvents
type Handler<E extends EventName> = (payload: PluginEvents[E]) => void

class PluginEventBus {
  private readonly handlers = new Map<EventName, Set<Handler<EventName>>>()

  on<E extends EventName>(event: E, handler: Handler<E>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    // Cast: the Map stores a union Set; individual subscriptions are typed at the call site.
    const set = this.handlers.get(event) as Set<Handler<E>>
    set.add(handler)
    return () => {
      set.delete(handler)
    }
  }

  emit<E extends EventName>(event: E, payload: PluginEvents[E]): void {
    const set = this.handlers.get(event) as Set<Handler<E>> | undefined
    if (!set) {
      return
    }
    set.forEach((handler) => {
      try {
        handler(payload)
      } catch (err) {
        console.error(`[PluginEventBus] Handler for "${event}" threw:`, err)
      }
    })
  }

  /** Remove all handlers for all events. Useful in tests. */
  reset(): void {
    this.handlers.clear()
  }
}

export const pluginEventBus = new PluginEventBus()
