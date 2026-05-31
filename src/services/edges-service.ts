import { apiClient } from './api-client'

export type VisualEdge = {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  edge_type?: string
}

export async function getEdgesByPlaylist(playlistId: string) {
  const { data } = await apiClient.get(`/api/playlists/${playlistId}/edges`)
  return data as VisualEdge[]
}

export async function createEdge(payload: { 
  source: string; 
  target: string; 
  sourceHandle?: string | null;
  targetHandle?: string | null;
  edge_type?: string 
}) {
  const { data } = await apiClient.post(`/api/edges`, payload)
  return data as VisualEdge
}

export async function deleteEdge(id: string) {
  const { data } = await apiClient.delete(`/api/edges/${id}`)
  return data
}

