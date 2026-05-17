/**
 * Global Data Models
 * 
 * TypeScript types for core entities across the app.
 * These are used in multiple features.
 */

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export type Basket = {
  id: string
  userId: string
  name: string
  description?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export type Subject = {
  id: string
  basketId: string
  name: string
  description?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export type Node = {
  id: string
  playlistId: string
  title: string
  theory?: string
  remember?: string
  references?: string[]
  x: number // Canvas position
  y: number
  masteryLevel: MasteryLevel
  errorCount: number
  successCount: number
  createdAt: Date
  updatedAt: Date
}

export type Card = {
  id: string
  nodeId: string
  question: string
  answer: string
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  nextReviewDate: Date
  lastReviewedAt?: Date
  interval: number // Days until next review (FSRS)
  easeFactor: number // FSRS ease factor (1.3-2.5)
  repetitions: number // FSRS repetition count
  createdAt: Date
  updatedAt: Date
}

export type StudySession = {
  id: string
  userId: string
  playlistId: string
  startedAt: Date
  endedAt?: Date
  cardsStudied: number
  cardsCorrect: number
  totalTime: number // Seconds
}

export type MasteryLevel = 'unseen' | 'weak' | 'learning' | 'strong' | 'mastered'
