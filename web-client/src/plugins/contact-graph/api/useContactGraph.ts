import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { queryKeys } from '@/lib/queryKeys'

export interface GraphNode {
  id: string
  user: string
  group?: string
}

export interface GraphLink {
  source: string | { id: string }
  target: string | { id: string }
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

export interface FetchGraphParams {
  contactId?: string // Center node
  level?: number // Depth
}

const fetchContactGraph = async (params: FetchGraphParams = {}): Promise<GraphData> => {
  const { data } = await api.get('/contact-graph', { params })
  return data
}

export const useContactGraph = (params: FetchGraphParams = {}) => {
  return useQuery({
    queryKey: queryKeys.contactGraph(params),
    queryFn: () => fetchContactGraph(params),
  })
}
