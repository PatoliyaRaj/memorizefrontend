"use client"

import React, { useEffect, useState } from 'react'
import { getCardsForNode, updateCard, deleteCard, type Card } from '@/services/study-service'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/lib/toast'

export function CardsTab({ nodeId }: { nodeId: string }) {
  const [cards, setCards] = useState<Card[] | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ question?: string; answer?: string }>({})

  useEffect(() => {
    if (!nodeId) return
    getCardsForNode(nodeId)
      .then((c) => setCards(c))
      .catch(() => toastError('Failed to load cards'))
  }, [nodeId])

  if (!cards) return <div className="p-4 text-sm text-text-secondary">Loading cards...</div>

  async function save(id: string) {
    try {
      const payload: any = {}
      if (draft.question !== undefined) payload.question = draft.question
      if (draft.answer !== undefined) payload.answer = draft.answer
      const res = await updateCard(id, payload)
      setCards((prev) => prev?.map((c) => (c.id === id ? { ...c, ...res } : c)) ?? null)
      setEditingId(null)
      toastSuccess('Card saved')
    } catch (e) {
      toastError('Save failed')
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this card?')) return
    try {
      await deleteCard(id)
      setCards((prev) => prev?.filter((c) => c.id !== id) ?? null)
      toastSuccess('Card deleted')
    } catch (e) {
      toastError('Delete failed')
    }
  }

  return (
    <div className="p-4 rounded-lg border border-border-default bg-surface-void/10">
      <h3 className="font-bold mb-2">Cards for this Node</h3>
      <div className="space-y-3">
        {cards.map((c) => (
          <div key={c.id} className="p-3 bg-[#07110F] rounded-lg border border-border-subtle">
            {editingId === c.id ? (
              <div className="space-y-2">
                <input value={draft.question ?? c.question} onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))} className="w-full p-2 rounded" />
                <textarea value={draft.answer ?? c.answer} onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))} className="w-full p-2 rounded" />
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => save(c.id)}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{c.question}</div>
                  <div className="text-xs text-text-secondary mt-1">{c.answer}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { setEditingId(c.id); setDraft({ question: c.question, answer: c.answer }) }}>Edit</Button>
                  <Button variant="destructive" onClick={() => remove(c.id)}>Delete</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardsTab
