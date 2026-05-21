import { apiClient } from './api-client'

export type NodeReference = {
  title: string
  url: string
  type: 'video' | 'article' | 'doc' | 'book'
}

export type NodeImage = {
  url: string
  caption?: string
  altText?: string
}

export type NodeFile = {
  url: string
  name: string
  size?: number
}

export type NodeDetails = {
  id: string
  nodeId?: string
  theory?: string
  takeaways?: string[]
  emotional_anchor?: string
  references?: NodeReference[]
  images?: NodeImage[]
  files?: NodeFile[]
  isImportant?: boolean
  examRelevance?: string[]
  cards_due_count?: number
}

export async function getNodeDetails(nodeId: string) {
  const { data } = await apiClient.get(`/api/curriculum/nodes/${nodeId}/details`)
  return (data?.data ?? data) as NodeDetails
}

export async function updateNodeDetails(nodeId: string, details: Partial<NodeDetails>) {
  const { data } = await apiClient.put(`/api/curriculum/nodes/${nodeId}/details`, details)
  return (data?.data ?? data) as NodeDetails
}
