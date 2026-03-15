export interface TypedColumnSpec {
  baseField: 'contactNames' | 'phoneNumbers' | 'contactEmailAdresses' | 'contactDates'
  qualifier: string // locale for names, type string for phones/emails, text for dates
  id: string // `${baseField}:${qualifier}`
  label: string // human-readable label e.g. "Mobile phone"
}

export interface HydraCollection<T> {
  member: T[]
  totalItems?: number
  view?: {
    '@id': string
    '@type': string
    first: string
    last: string
    next?: string
    previous?: string
  }
  [key: string]: unknown
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

export function getHydraPagination<T>(data?: HydraCollection<T>, page = 1) {
  const totalItems = data?.totalItems ?? 0
  const totalPages = Math.ceil(totalItems / 30)
  const view = data?.view

  return {
    totalItems,
    totalPages,
    hasNext: hasNextPage(view, totalPages, page),
    hasPrevious: hasPreviousPage(view, page),
  }
}

function hasNextPage(view: HydraCollection<unknown>['view'], totalPages: number, page: number) {
  return !!view?.['next'] || totalPages > page
}

function hasPreviousPage(view: HydraCollection<unknown>['view'], page: number) {
  return !!view?.['previous'] || page > 1
}
