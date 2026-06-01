import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type StudyState = {
  cards: any[]
  currentIndex: number
  sessionId: string | null
  sessionMode: 'normal' | 'exam'
  setCards: (cards: any[]) => void
  setSession: (id: string | null, mode: 'normal' | 'exam') => void
  next: () => void
  reset: () => void
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      cards: [],
      currentIndex: 0,
      sessionId: null,
      sessionMode: 'normal',
      setCards: (cards) => set({ cards, currentIndex: 0 }),
      setSession: (id, mode) => set({ sessionId: id, sessionMode: mode }),
      next: () => set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, (s.cards.length || 1) - 1) })),
      reset: () => set({ cards: [], currentIndex: 0, sessionId: null, sessionMode: 'normal' }),
    }),
    {
      name: 'neurolearn-study-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cards: state.cards,
        currentIndex: state.currentIndex,
      }),
    }
  )
)
