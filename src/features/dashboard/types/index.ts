/**
 * Dashboard Feature Types
 * 
 * All TypeScript types specific to the dashboard feature.
 * Shared types (User, Card, etc) live in src/types/
 */

export type DashboardMetrics = {
  todayCardsDue: number
  currentStreak: number
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent'
  basketMastery: BasketMasteryRing[]
  weakSpots: WeakSpotCard[]
  heatmapData: HeatmapDay[]
}

export type BasketMasteryRing = {
  basketId: string
  basketName: string
  masteryPercentage: number
}

export type WeakSpotCard = {
  nodeId: string
  nodeTitle: string
  subjectName: string
  errorRate: number // 0-100
}

export type HeatmapDay = {
  date: Date
  cardsStudied: number
  masteryGain: number
}
