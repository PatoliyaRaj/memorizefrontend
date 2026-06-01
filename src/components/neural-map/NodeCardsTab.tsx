"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toastError, toastSuccess } from '@/lib/toast';
import { createCard, deleteCard, getCardsForNode, updateCard, type Card } from '@/services/study-service';

const emptyDraft = {
  question: '',
  answer: '',
  explanation: '',
};

export default function NodeCardsTab({ nodeId }: { nodeId: string }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [newCard, setNewCard] = useState(emptyDraft);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await getCardsForNode(nodeId);
      setCards(data);
    } catch (error) {
      toastError('Failed to load cards for this node.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!nodeId) return;
    void loadCards();
  }, [nodeId]);

  const handleCreate = async () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) {
      toastError('Question and answer are required.');
      return;
    }

    setSaving(true);
    try {
      const created = await createCard(nodeId, {
        question: newCard.question.trim(),
        answer: newCard.answer.trim(),
        explanation: newCard.explanation.trim() || undefined,
      });
      setCards((prev) => [...prev, created]);
      setNewCard(emptyDraft);
      toastSuccess('Card added.');
    } catch (error: any) {
      toastError(error?.response?.data?.error || 'Failed to add card.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (card: Card) => {
    setEditingCardId(card.id);
    setDraft({
      question: card.question,
      answer: card.answer,
      explanation: card.explanation ?? '',
    });
  };

  const handleSave = async (cardId: string) => {
    if (!draft.question.trim() || !draft.answer.trim()) {
      toastError('Question and answer are required.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateCard(cardId, {
        question: draft.question.trim(),
        answer: draft.answer.trim(),
        explanation: draft.explanation.trim() || undefined,
      });
      setCards((prev) => prev.map((card) => (card.id === cardId ? updated : card)));
      setEditingCardId(null);
      toastSuccess('Card updated.');
    } catch (error: any) {
      toastError(error?.response?.data?.error || 'Failed to update card.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm('Delete this card?')) return;

    setSaving(true);
    try {
      await deleteCard(cardId);
      setCards((prev) => prev.filter((card) => card.id !== cardId));
      toastSuccess('Card deleted.');
    } catch (error: any) {
      toastError(error?.response?.data?.error || 'Failed to delete card.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-lg border border-border-subtle bg-[#060A09] p-4 text-sm text-text-secondary">Loading cards...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border-subtle bg-[#060A09] p-4 space-y-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">Add Card</p>
          <p className="text-xs text-text-tertiary mt-1">Create an atomic question for this node.</p>
        </div>

        <div className="grid gap-2">
          <Input
            value={newCard.question}
            onChange={(e) => setNewCard((prev) => ({ ...prev, question: e.target.value }))}
            placeholder="Card question"
            className="bg-[#0B1210] border-border-default"
          />
          <textarea
            value={newCard.answer}
            onChange={(e) => setNewCard((prev) => ({ ...prev, answer: e.target.value }))}
            placeholder="Card answer"
            rows={3}
            className="w-full rounded-lg border border-border-default bg-[#0B1210] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
          />
          <textarea
            value={newCard.explanation}
            onChange={(e) => setNewCard((prev) => ({ ...prev, explanation: e.target.value }))}
            placeholder="Optional explanation"
            rows={2}
            className="w-full rounded-lg border border-border-default bg-[#0B1210] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
          />
        </div>

        <Button onClick={handleCreate} disabled={saving} className="w-full bg-[#14B8A6] text-black hover:bg-[#2DD4BF] font-bold">
          Add Card
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">Existing Cards</p>
          <span className="text-[11px] text-text-tertiary">{cards.length} total</span>
        </div>

        {cards.length === 0 ? (
          <div className="rounded-lg border border-border-subtle bg-[#060A09] p-4 text-sm text-text-secondary">
            No cards yet. Add one above, or let the study page auto-seed from your node details.
          </div>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="rounded-xl border border-border-subtle bg-[#121C1A] p-4 space-y-3">
              {editingCardId === card.id ? (
                <>
                  <Input
                    value={draft.question}
                    onChange={(e) => setDraft((prev) => ({ ...prev, question: e.target.value }))}
                    className="bg-[#0B1210] border-border-default"
                  />
                  <textarea
                    value={draft.answer}
                    onChange={(e) => setDraft((prev) => ({ ...prev, answer: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-border-default bg-[#0B1210] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
                  />
                  <textarea
                    value={draft.explanation}
                    onChange={(e) => setDraft((prev) => ({ ...prev, explanation: e.target.value }))}
                    rows={2}
                    className="w-full rounded-lg border border-border-default bg-[#0B1210] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave(card.id)} disabled={saving} className="flex-1 bg-[#14B8A6] text-black hover:bg-[#2DD4BF] font-bold">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCardId(null)} className="flex-1 border-border-default hover:bg-[#1F312D]">
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{card.question}</p>
                    <p className="mt-2 text-sm text-text-secondary whitespace-pre-wrap">{card.answer}</p>
                    {card.explanation ? <p className="mt-2 text-xs text-text-tertiary whitespace-pre-wrap">{card.explanation}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => startEdit(card)} variant="outline" className="flex-1 border-border-default hover:bg-[#1F312D]">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(card.id)} disabled={saving} variant="outline" className="flex-1 border-red-500/30 text-red-300 hover:bg-red-500/10">
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
