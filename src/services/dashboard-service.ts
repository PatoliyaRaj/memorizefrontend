/**
 * Dashboard Service
 * 
 * All API calls related to the dashboard/pulse page.
 * If the backend endpoint changes, update here (one place).
 */

import { apiClient } from './api-client'
import type { DashboardMetrics } from '@/features/dashboard/types'

/**
 * Get Dashboard Metrics
 * 
 * Fetches today's cards due, streak, sleep status,
 * basket mastery, weak spots, and heatmap data.
 * 
 * GET /api/dashboard/metrics
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get('/api/dashboard/metrics')
  return data
}

/**
 * Get Weak Spot Nodes
 * 
 * Fetch nodes where the user is struggling.
 * 
 * GET /api/dashboard/weak-spots?limit=3
 */
export async function getWeakSpots(limit: number = 3) {
  const { data } = await apiClient.get('/api/dashboard/weak-spots', {
    params: { limit }
  })
  return data
}

/**
 * Get Study Heatmap
 * 
 * Fetch last 365 days of study activity for heatmap.
 * 
 * GET /api/dashboard/heatmap?days=365
 */
export async function getStudyHeatmap(days: number = 365) {
  const { data } = await apiClient.get('/api/dashboard/heatmap', {
    params: { days }
  })
  return data
}

/**
 * Start Study Session
 * 
 * Begin a new study session for a basket.
 * Returns the queue of cards to review.
 * 
 * POST /api/study/sessions
 */
export async function startStudySession(basketId: string) {
  const { data } = await apiClient.post('/api/study/sessions', {
    basketId
  })
  return data
}
