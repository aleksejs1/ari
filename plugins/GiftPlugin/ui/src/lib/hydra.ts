export interface HydraCollection<T> {
    member?: T[]
    'hydra:member': T[]
    'hydra:totalItems'?: number
    'hydra:view'?: {
        '@id': string
        type: string
        'hydra:first': string
        'hydra:last': string
        'hydra:next'?: string
    }
}

export function getHydraMember<T>(data?: HydraCollection<T> | T[]): T[] {
    if (!data) {
        return []
    }
    if (Array.isArray(data)) {
        return data
    }
    return data.member || data['hydra:member'] || []
}
