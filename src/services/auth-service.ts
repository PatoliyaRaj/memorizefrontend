import { apiClient } from './api-client'

export async function login(email: string, password: string) {
  const { data } = await apiClient.post('/api/auth/login', { email, password })
  return data
}

export async function signup(payload: { displayName?: string; name?: string; email: string; password: string }){
  const { name, displayName, ...rest } = payload
  const { data } = await apiClient.post('/api/auth/signup', {
    ...rest,
    displayName: displayName ?? name,
  })
  return data
}

export async function me(){
  const { data } = await apiClient.get('/api/auth/me')
  return data
}
