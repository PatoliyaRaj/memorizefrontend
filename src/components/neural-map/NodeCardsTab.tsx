"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toastError, toastSuccess } from '@/lib/toast';
import { createCard, deleteCard, getCardsForNode, updateCard, type Card } from '@/services/study-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Bold, Italic, Underline, List, ArrowRight, Quote } from 'lucide-react';
import { normalizeMarkdown } from '@/lib/markdown';

const emptyDraft = {
  question: '',
  answer: '',
  explanation: '',
  questionType: 'free_recall' as Card['questionType'],
};

function parseExplanation(raw?: string | null): { subTopic: string; text: string; isJson: boolean } {
  if (!raw) return { subTopic: 'General', text: '', isJson: false };
  try {
    const p = JSON.parse(raw);
    if (p && typeof p === 'object') {
      return {
        subTopic: typeof p.subTopic === 'string' ? p.subTopic : 'General',
        text: typeof p.text === 'string' ? p.text : '',
        isJson: true,
      };
    }
  } catch {}
  return { subTopic: 'General', text: raw, isJson: false };
}

const questionTypeStyles: Record<string, string> = {
  free_recall: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  cloze: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  ordering: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  matching: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  multiple_choice: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
};

const questionTypeLabels: Record<string, string> = {
  free_recall: 'Free Recall',
  cloze: 'Cloze Deletion',
  ordering: 'Ordering',
  matching: 'Matching',
  multiple_choice: 'Multiple Choice',
};

function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (val: string) => void;
}) {
  const insertFormatting = (prefix: string, suffix: string = "", isList: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    if (isList) {
      replacement = selectedText
        .split("\n")
        .map((line) => `${prefix}${line}`)
        .join("\n");
      if (!selectedText) {
        replacement = prefix;
      }
    } else {
      replacement = `${prefix}${selectedText || "text"}${suffix}`;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newStart = start + prefix.length;
      const newEnd = start + prefix.length + (selectedText || "text").length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  return (
    <div className="flex flex-wrap gap-1 p-1 bg-[#060A09] border border-border-default border-b-0 rounded-t-lg items-center select-none">
      <button
        type="button"
        onClick={() => insertFormatting("**", "**")}
        className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors"
        title="Bold"
      >
        <Bold className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertFormatting("_", "_")}
        className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors"
        title="Italic"
      >
        <Italic className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertFormatting("<u>", "</u>")}
        className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors"
        title="Underline"
      >
        <Underline className="size-3.5" />
      </button>
      <div className="h-4 w-px bg-border-default mx-1" />
      <button
        type="button"
        onClick={() => insertFormatting("- ", "", true)}
        className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors"
        title="Bullet List"
      >
        <List className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertFormatting("-> ", "", true)}
        className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors"
        title="Arrow List"
      >
        <ArrowRight className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => insertFormatting("> ", "", true)}
        className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors"
        title="Blockquote"
      >
        <Quote className="size-3.5" />
      </button>
    </div>
  );
}

export default function NodeCardsTab({ nodeId, onCardsChange }: { nodeId: string; onCardsChange?: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [newCard, setNewCard] = useState(emptyDraft);

  const newAnswerRef = useRef<HTMLTextAreaElement>(null);
  const newExplanationRef = useRef<HTMLTextAreaElement>(null);
  const editAnswerRef = useRef<HTMLTextAreaElement>(null);
  const editExplanationRef = useRef<HTMLTextAreaElement>(null);

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
        questionType: newCard.questionType,
      });
      setCards((prev) => [...prev, created]);
      setNewCard(emptyDraft);
      toastSuccess('Card added.');
      onCardsChange?.();
    } catch (error: any) {
      toastError(error?.response?.data?.error || 'Failed to add card.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (card: Card) => {
    setEditingCardId(card.id);
    const parsed = parseExplanation(card.explanation);
    setDraft({
      question: card.question,
      answer: card.answer,
      explanation: parsed.text,
      questionType: card.questionType || 'free_recall',
    });
  };

  const handleSave = async (cardId: string) => {
    if (!draft.question.trim() || !draft.answer.trim()) {
      toastError('Question and answer are required.');
      return;
    }

    setSaving(true);
    try {
      const originalCard = cards.find((c) => c.id === cardId);
      const parsedOriginal = parseExplanation(originalCard?.explanation);
      let finalExplanation = draft.explanation.trim();
      if (parsedOriginal.isJson) {
        finalExplanation = JSON.stringify({
          subTopic: parsedOriginal.subTopic,
          text: draft.explanation.trim(),
        });
      }

      const updated = await updateCard(cardId, {
        question: draft.question.trim(),
        answer: draft.answer.trim(),
        explanation: finalExplanation || undefined,
        questionType: draft.questionType,
      });
      setCards((prev) => prev.map((card) => (card.id === cardId ? updated : card)));
      setEditingCardId(null);
      toastSuccess('Card updated.');
      onCardsChange?.();
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
      onCardsChange?.();
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
          <div className="space-y-1 my-1">
            <p className="text-[10px] uppercase font-mono tracking-wider text-text-tertiary">Question Type</p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {Object.keys(questionTypeLabels).map((type) => {
                const isSelected = newCard.questionType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewCard((prev) => ({ ...prev, questionType: type as any }))}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                      isSelected
                        ? `${questionTypeStyles[type]} border-current shadow-[0_0_10px_rgba(20,184,166,0.1)] font-semibold`
                        : 'bg-[#0B1210] border-border-default text-text-secondary hover:text-text-primary hover:border-border-subtle'
                    }`}
                  >
                    {questionTypeLabels[type]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col">
            <MarkdownToolbar
              textareaRef={newAnswerRef}
              value={newCard.answer}
              onChange={(val) => setNewCard((prev) => ({ ...prev, answer: val }))}
            />
            <textarea
              ref={newAnswerRef}
              value={newCard.answer}
              onChange={(e) => setNewCard((prev) => ({ ...prev, answer: e.target.value }))}
              placeholder="Card answer"
              rows={3}
              className="w-full rounded-b-lg border border-border-default bg-[#0B1210] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
            />
          </div>
          <div className="flex flex-col">
            <MarkdownToolbar
              textareaRef={newExplanationRef}
              value={newCard.explanation}
              onChange={(val) => setNewCard((prev) => ({ ...prev, explanation: val }))}
            />
            <textarea
              ref={newExplanationRef}
              value={newCard.explanation}
              onChange={(e) => setNewCard((prev) => ({ ...prev, explanation: e.target.value }))}
              placeholder="Optional explanation"
              rows={2}
              className="w-full rounded-b-lg border border-border-default bg-[#0B1210] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
            />
          </div>
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
          <div className="rounded-xl border border-border-subtle bg-[#060A09] p-6 text-center space-y-3">
            <p className="text-xs text-text-secondary leading-relaxed">
              No active recall cards are attached to this node yet. Add one above, or let the cognitive engine auto-seed them from your theory details.
            </p>
            <Button
              onClick={loadCards}
              disabled={loading || saving}
              className="bg-[#0D9488] text-white hover:bg-[#14B8A6] font-bold text-xs"
            >
              ⚡ Auto-Seed Cards from Details
            </Button>
          </div>
        ) : (
          cards.map((card) => {
            const parsed = parseExplanation(card.explanation);
            return (
              <div key={card.id} className="rounded-xl border border-border-subtle bg-[#121C1A] p-4 space-y-3">
                {editingCardId === card.id ? (
                  <>
                    <Input
                      value={draft.question}
                      onChange={(e) => setDraft((prev) => ({ ...prev, question: e.target.value }))}
                      className="bg-[#0B1210] border-border-default"
                    />
                    <div className="space-y-1 my-1">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-text-tertiary">Question Type</p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {Object.keys(questionTypeLabels).map((type) => {
                          const isSelected = draft.questionType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setDraft((prev) => ({ ...prev, questionType: type as any }))}
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-all ${
                                isSelected
                                  ? `${questionTypeStyles[type]} border-current shadow-[0_0_10px_rgba(20,184,166,0.1)] font-semibold`
                                  : 'bg-[#0B1210] border-border-default text-text-secondary hover:text-text-primary hover:border-border-subtle'
                              }`}
                            >
                              {questionTypeLabels[type]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <MarkdownToolbar
                        textareaRef={editAnswerRef}
                        value={draft.answer}
                        onChange={(val) => setDraft((prev) => ({ ...prev, answer: val }))}
                      />
                      <textarea
                        ref={editAnswerRef}
                        value={draft.answer}
                        onChange={(e) => setDraft((prev) => ({ ...prev, answer: e.target.value }))}
                        rows={3}
                        className="w-full rounded-b-lg border border-border-default bg-[#0B1210] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
                      />
                    </div>
                    <div className="flex flex-col">
                      <MarkdownToolbar
                        textareaRef={editExplanationRef}
                        value={draft.explanation}
                        onChange={(val) => setDraft((prev) => ({ ...prev, explanation: val }))}
                      />
                      <textarea
                        ref={editExplanationRef}
                        value={draft.explanation}
                        onChange={(e) => setDraft((prev) => ({ ...prev, explanation: e.target.value }))}
                        rows={2}
                        className="w-full rounded-b-lg border border-border-default bg-[#0B1210] p-3 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-tertiary"
                      />
                    </div>
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
                      <div className="flex flex-wrap gap-1.5 items-center mb-2">
                        {card.questionType && (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${questionTypeStyles[card.questionType] || 'bg-gray-500/10 text-gray-300 border-gray-500/20'}`}>
                            {questionTypeLabels[card.questionType] || card.questionType}
                          </span>
                        )}
                        {parsed.isJson && parsed.subTopic && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono border bg-[#14B8A6]/10 text-[#2DD4BF] border-[#14B8A6]/20">
                            {parsed.subTopic}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-text-primary">{card.question}</p>
                      <div className="mt-2 text-sm text-text-secondary leading-relaxed [&_strong]:font-semibold [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1.5 [&_li]:my-1 [&_p]:my-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                        >
                          {normalizeMarkdown(card.answer)}
                        </ReactMarkdown>
                      </div>
                      {parsed.text ? (
                        <details className="mt-3 group border-t border-border-subtle/30 pt-2">
                          <summary className="text-xs text-text-tertiary cursor-pointer hover:text-text-primary list-none flex items-center gap-1 font-medium transition-colors select-none">
                            <svg className="w-3.5 h-3.5 transform transition-transform group-open:rotate-90 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            Why this matters
                          </summary>
                          <div className="mt-2 text-xs text-text-tertiary pl-4 leading-relaxed bg-[#0B1210]/50 p-2.5 rounded-lg border border-border-subtle/30 [&_strong]:font-semibold [&_strong]:text-text-secondary [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1 [&_li]:my-0.5 [&_p]:my-0.5">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeSanitize]}
                            >
                              {normalizeMarkdown(parsed.text)}
                            </ReactMarkdown>
                          </div>
                        </details>
                      ) : null}
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
            );
          })
        )}
      </div>
    </div>
  );
}
