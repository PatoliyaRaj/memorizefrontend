import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { getDashboardMetrics } from '@/services/dashboard-service'
import type { DashboardMetrics } from '@/features/dashboard/types'

/**
 * useDashboardData
 * 
 * Fetches dashboard metrics for the authenticated user.
 * Called on dashboard page load.
 * 
 * Returns:
 * - metrics: DashboardMetrics | null
 * - isLoading: boolean
 * - error: Error | null
 */
export function useDashboardData() {
  const user = useAuthStore((state) => state.user)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    const fetchMetrics = async () => {
      try {
        setIsLoading(true)
        const data = await getDashboardMetrics()
        setMetrics(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch metrics'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [user])

  return { metrics, isLoading, error }
}
