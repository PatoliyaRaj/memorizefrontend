import { apiClient } from './api-client'

export type Card = {
  id: string
  question: string
  answer: string
}

export async function getCardsForNode(nodeId: string) {
  const { data } = await apiClient.get(`/api/nodes/${nodeId}/cards`)
  return data as Card[]
}

export async function postReview(payload: { cardId: string; confidence: number; wasCorrect: boolean; responseTimeMs?: number }) {
  const { data } = await apiClient.post(`/api/study/review`, payload)
  return data
}
