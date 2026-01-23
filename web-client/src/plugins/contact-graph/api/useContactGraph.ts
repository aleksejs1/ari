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

const fetchContactGraph = async (): Promise<GraphData> => {
  const { data } = await api.get('/contact-graph')
  return data
}

export const useContactGraph = () => {
  return useQuery({
    queryKey: ['contact-graph'],
    queryFn: fetchContactGraph,
  })
}
