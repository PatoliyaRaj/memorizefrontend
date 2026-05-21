import { create } from 'zustand'

type StudyState = {
  cards: any[]
  currentIndex: number
  setCards: (cards:any[])=>void
  next: ()=>void
  reset: ()=>void
}

export const useStudyStore = create<StudyState>((set)=>({
  cards: [],
  currentIndex: 0,
  setCards: (cards)=> set({ cards, currentIndex: 0 }),
  next: ()=> set((s)=> ({ currentIndex: Math.min(s.currentIndex+1, (s.cards.length||1)-1) })),
  reset: ()=> set({ cards: [], currentIndex: 0 })
}))
