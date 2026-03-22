import type { QueryKey } from '@tanstack/react-query'

import { queryKeys } from '@/lib/queryKeys'

type KeyFactory = Record<string, QueryKey | ((...args: any[]) => QueryKey)>

class QueryKeyRegistryClass {
  private registry: Partial<Record<string, KeyFactory>> = {}

  register(resource: string, factory: KeyFactory): void {
    if (this.registry[resource] !== undefined) {
      if (import.meta.env.DEV) {
        throw new Error(
          `QueryKeyRegistry: resource "${resource}" is already registered. Use a namespaced key (e.g. "gifts-plugin/gifts").`,
        )
      }
      return
    }
    this.registry[resource] = factory
  }

  has(resource: string): boolean {
    return this.registry[resource] !== undefined
  }

  get<T extends KeyFactory>(resource: string): T {
    const factory = this.registry[resource]
    if (factory === undefined) {
      throw new Error(
        `QueryKeyRegistry: resource "${resource}" is not registered. Call register() first.`,
      )
    }
    return factory as T
  }
}

export const QueryKeyRegistry = new QueryKeyRegistryClass()

// Built-in keys registered at module load:
QueryKeyRegistry.register('contacts', queryKeys.contacts)
QueryKeyRegistry.register('groups', queryKeys.groups)
QueryKeyRegistry.register('notifications', queryKeys.notifications)
QueryKeyRegistry.register('notificationChannels', queryKeys.notificationChannels)
QueryKeyRegistry.register('notificationPolicies', queryKeys.notificationPolicies)
QueryKeyRegistry.register('aiSuggestions', queryKeys.aiSuggestions)
QueryKeyRegistry.register('marketplace', queryKeys.marketplace)
QueryKeyRegistry.register('apiKeys', queryKeys.apiKeys)
QueryKeyRegistry.register('loginHistory', queryKeys.loginHistory)
QueryKeyRegistry.register('auditLogs', queryKeys.auditLogs)
