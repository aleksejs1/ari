import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'

export interface GraphNode {
  id: string
  user: string
  group?: string
}

export interface GraphLink {
  source: string
  target: string
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
    queryKey: ['contact-graph', params],
    queryFn: () => fetchContactGraph(params),
  })
}
