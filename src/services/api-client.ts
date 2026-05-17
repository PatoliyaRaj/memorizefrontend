/**
 * API Client
 * 
 * Centralized HTTP client with:
 * - Base URL configuration
 * - Auth token injection
 * - Response/error interceptors
 * - Retry logic
 */

import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/use-auth-store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Inject auth token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, user is not authenticated
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    // Re-throw for the caller to handle
    return Promise.reject(error)
  }
)

export default apiClient
