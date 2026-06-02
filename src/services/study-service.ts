import { apiClient } from './api-client'

export type Card = {
  id: string
  nodeId?: string
  question: string
  answer: string
  explanation?: string | null
  questionType?: 'free_recall' | 'cloze' | 'ordering' | 'matching' | 'multiple_choice'
  orderIndex?: number
}

const cardsRequestCache = new Map<string, Promise<Card[]>>()

export async function getCardsForNode(nodeId: string) {
  const cached = cardsRequestCache.get(nodeId)
  if (cached) return cached

  const request = apiClient.get(`/api/nodes/${nodeId}/cards`)
    .then(({ data }) => data as Card[])
    .finally(() => {
      cardsRequestCache.delete(nodeId)
    })

  cardsRequestCache.set(nodeId, request)
  return request
}

export async function postReview(payload: {
  cardId: string
  confidence: number
  wasCorrect: boolean
  responseTimeMs?: number
  sessionId?: string | null
  reviewType?: 'normal' | 'remedial' | 'prereq' | 'interleaved' | 'feynman'
}) {
  const { data } = await apiClient.post(`/api/study/review`, payload)
  return data
}

export async function startStudySession(payload: {
  basketId?: string
  mode?: 'normal' | 'interleaved' | 'exam' | 'remedial' | 'prereq'
  notes?: string
}) {
  const { data } = await apiClient.post(`/api/study/session`, payload)
  return data as {
    id: string
    userId: string
    basketId: string | null
    mode: string
    sleepWindowOk: boolean
    startedAt: string
    endedAt: string | null
    durationSec: number | null
    notes: string | null
  }
}

export async function endStudySession(sessionId: string, payload?: { notes?: string }) {
  const { data } = await apiClient.patch(`/api/study/session/${sessionId}/end`, payload || {})
  return data
}

export async function createCard(nodeId: string, payload: { question: string; answer: string; explanation?: string; questionType?: Card['questionType']; orderIndex?: number }) {
  const { data } = await apiClient.post(`/api/nodes/${nodeId}/cards`, payload)
  return data as Card
}

export async function updateCard(cardId: string, payload: { question?: string; answer?: string; explanation?: string; orderIndex?: number }) {
  const { data } = await apiClient.patch(`/api/cards/${cardId}`, payload)
  return data as Card
}

export async function deleteCard(cardId: string) {
  const { data } = await apiClient.delete(`/api/cards/${cardId}`)
  return data
}

export type DueCard = {
  card: Card
  cardState: {
    id: string
    stability: number
    difficulty: number
    state: 'New' | 'Learning' | 'Review' | 'Relearning'
    nextReview: string | null
    masteryLevel: 'new' | 'learning' | 'reviewing' | 'mastered'
  } | null
  node: {
    id: string
    title: string
  }
}

export async function getDueCards(basketId?: string) {
  const { data } = await apiClient.get(`/api/study/due-cards`, {
    params: basketId ? { basketId } : {},
  })
  return data as DueCard[]
}
