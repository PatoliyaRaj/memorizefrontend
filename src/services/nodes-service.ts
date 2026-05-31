import { apiClient } from './api-client'

export type VisualNode = {
  id: string
  title: string
  node_type?: 'concept' | 'definition' | 'formula' | 'process' | 'example' | 'exception'
  nodeType?: 'concept' | 'definition' | 'formula' | 'process' | 'example' | 'exception'
  pos_x?: number
  pos_y?: number
  posX?: number
  posY?: number
  mastery_level?: 'unseen' | 'weak' | 'learning' | 'strong' | 'mastered'
  masteryLevel?: 'unseen' | 'weak' | 'learning' | 'strong' | 'mastered'
}

export type CreateNodePayload = {
  playlistId: string
  title: string
  nodeType?: VisualNode['node_type']
  posX?: number
  posY?: number
  orderIndex?: number
}

export type UpdateNodePayload = {
  title?: string
  nodeType?: VisualNode['node_type']
  posX?: number
  posY?: number
  orderIndex?: number
}

function unwrapResponse<T>(response: any): T {
  return (response?.data?.data ?? response?.data) as T
}

export async function getNodesByPlaylist(playlistId: string) {
  const response = await apiClient.get(`/api/curriculum/nodes`, {
    params: { playlistId },
  })
  return unwrapResponse<VisualNode[]>(response)
}

export async function patchNodePosition(id: string, x: number, y: number) {
  return updateNode(id, { posX: x, posY: y })
}

export async function getNodeById(id: string) {
  const response = await apiClient.get(`/api/curriculum/nodes/${id}`)
  return unwrapResponse<VisualNode>(response)
}

export async function createNode(payload: CreateNodePayload) {
  const response = await apiClient.post(`/api/curriculum/nodes`, payload)
  return unwrapResponse<VisualNode>(response)
}

export async function updateNode(id: string, payload: UpdateNodePayload) {
  const response = await apiClient.put(`/api/curriculum/nodes/${id}`, payload)
  return unwrapResponse<VisualNode>(response)
}

export async function deleteNode(id: string) {
  const response = await apiClient.delete(`/api/curriculum/nodes/${id}`)
  return response.data
}
