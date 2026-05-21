import { create } from 'zustand'
import type { User } from '@/types/models'

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('memorize_token') : null
const initialUser = typeof window !== 'undefined' ? (localStorage.getItem('memorize_user') ? JSON.parse(localStorage.getItem('memorize_user') as string) : null) : null

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  setUser: (user) => {
    if (user) {
      try { localStorage.setItem('memorize_user', JSON.stringify(user)) } catch(e){}
      set({ user, isAuthenticated: true })
    } else {
      try { localStorage.removeItem('memorize_user') } catch(e){}
      set({ user: null, isAuthenticated: false })
    }
  },
  setToken: (token) => {
    if (token) {
      try { localStorage.setItem('memorize_token', token) } catch(e){}
      set({ token, isAuthenticated: true })
    } else {
      try { localStorage.removeItem('memorize_token') } catch(e){}
      set({ token: null, isAuthenticated: false })
    }
  },
  logout: () => {
    try { localStorage.removeItem('memorize_token'); localStorage.removeItem('memorize_user') } catch(e){}
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
