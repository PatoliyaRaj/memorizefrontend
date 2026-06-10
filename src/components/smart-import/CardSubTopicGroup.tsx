'use client';

/**
 * Card Sub-Topic Group Component
 *
 * Security: rehype-sanitize added to ALL ReactMarkdown instances.
 * This prevents XSS via LLM-hallucinated HTML (e.g., <img onerror='alert(1)'>)
 * from executing in the student's browser.
 *
 * Features:
 *  - Cards grouped by subTopic in collapsible <details> sections
 *  - Expandable explanation panel (memory hook)
 *  - Inline edit mode for question + answer
 *  - Length warning for overlong Q/A
 *  - Card type badge
 */

import { useState }    from 'react';
import ReactMarkdown   from 'react-markdown';
import remarkGfm       from 'remark-gfm';
import rehypeSanitize  from 'rehype-sanitize'; 
import { normalizeMarkdown } from '@/lib/markdown';
import { Brain, ChevronDown, ChevronUp, Edit2, Trash2, Check, X, AlertTriangle } from 'lucide-react';

interface CardItem {
  id:           string;
  question:     string;
  answer:       string;
  subTopic?:    string;
  explanation?: string;
  type?:        string;
  keep:         boolean;
  editing:      boolean;
}

interface Props {
  cards:        CardItem[];
  onToggleKeep: (id: string) => void;
  onEditCard:   (id: string, key: 'question' | 'answer', val: string) => void;
  onToggleEdit: (id: string) => void;
}

function parseExplanation(raw?: string): string {
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed.text === 'string' ? parsed.text : '';
  } catch {
    return typeof raw === 'string' ? raw : '';
  }
}

export function CardSubTopicGroup({ cards, onToggleKeep, onEditCard, onToggleEdit }: Props) {
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set());

  const toggleExplanation = (id: string) => {
    setExpandedExplanations(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const groups = cards.reduce((acc, c) => {
    const t = c.subTopic ?? 'General';
    if (!acc[t]) acc[t] = [];
    acc[t].push(c);
    return acc;
  }, {} as Record<string, CardItem[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([topic, topicCards]) => {
        const activeCount = topicCards.filter(c => c.keep).length;

        return (
          <details key={topic} open className="border border-border-default rounded-lg overflow-hidden bg-surface-void font-body">
            <summary className="flex justify-between items-center p-3 bg-surface-base cursor-pointer hover:bg-surface-hover select-none list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-2 font-medium">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-display font-bold text-text-primary">{topic}</span>
                <span className="text-xs text-text-tertiary font-mono">({topicCards.length} card{topicCards.length !== 1 ? 's' : ''})</span>
              </div>
              <span className="text-[10px] text-text-secondary bg-surface-void px-2 py-0.5 rounded-full border border-border-default font-mono">
                {activeCount}/{topicCards.length} kept
              </span>
            </summary>

            <div className="p-3 space-y-3 bg-surface-void/50 border-t border-border-default/50">
              {topicCards.map(card => {
                const hasLengthWarning = card.question.length > 120 || card.answer.length > 600;
                const explanationText  = parseExplanation(card.explanation);
                const showExplanation  = expandedExplanations.has(card.id);

                return (
                  <div
                    key={card.id}
                    className={`border rounded-lg transition-all ${
                      card.keep
                        ? 'bg-surface-base border-border-default shadow-sm'
                        : 'bg-surface-base/20 border-border-default/30 opacity-40'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-center p-3 pb-0">
                      <span className="text-[9px] text-primary bg-primary/10 border border-border-brand px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                        {card.type ?? 'free_recall'}
                      </span>
                      <div className="flex items-center gap-3 font-mono text-[10px]">
                        {explanationText && (
                          <button
                            onClick={() => toggleExplanation(card.id)}
                            className="text-tertiary hover:text-tertiary/80 font-medium flex items-center gap-0.5 cursor-pointer"
                          >
                            {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            Why?
                          </button>
                        )}
                        <button
                          onClick={() => onToggleEdit(card.id)}
                          className="text-text-secondary hover:text-text-primary cursor-pointer flex items-center gap-0.5"
                        >
                          <Edit2 className="w-3 h-3" />
                          {card.editing ? 'Done' : 'Edit'}
                        </button>
                        <button
                          onClick={() => onToggleKeep(card.id)}
                          className={`font-bold cursor-pointer flex items-center gap-0.5 ${
                            card.keep ? 'text-error-text hover:text-error-text/80' : 'text-success-text hover:text-success-text/80'
                          }`}
                        >
                          {card.keep ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                          {card.keep ? 'Remove' : 'Keep'}
                        </button>
                      </div>
                    </div>

                    {/* Length Warning */}
                    {hasLengthWarning && card.keep && (
                      <div className="mx-3 mt-2 text-[10px] text-warning-text bg-warning-bg border border-warning-border px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Question &gt;120 chars or answer &gt;600 chars — consider shortening.
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-3">
                      {card.editing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={card.question}
                            onChange={e => onEditCard(card.id, 'question', e.target.value)}
                            placeholder="Question (max 120 chars)"
                            className="w-full p-2 bg-surface-void border border-border-default rounded text-xs text-text-primary focus:outline-none focus:border-border-brand font-body"
                          />
                          <textarea
                            value={card.answer}
                            onChange={e => onEditCard(card.id, 'answer', e.target.value)}
                            placeholder="Answer (supports **bold**, → arrows, bullet lists)"
                            rows={3}
                            className="w-full p-2 bg-surface-void border border-border-default rounded text-xs text-text-primary resize-none focus:outline-none focus:border-border-brand font-mono leading-relaxed"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-text-primary">
                            Q: {card.question || <span className="text-error-text italic">Empty</span>}
                          </p>
                          <div className="text-xs text-text-secondary prose prose-invert prose-xs max-w-none [&_strong]:text-text-primary [&_p]:mt-0 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5 [&_li]:marker:text-primary leading-relaxed">
                            <span className="text-text-tertiary font-semibold not-prose font-mono">A: </span>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeSanitize]}
                            >
                              {normalizeMarkdown(card.answer) || '*Empty*'}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* Explanation Panel */}
                      {showExplanation && explanationText && (
                        <div className="mt-3 pt-3 border-t border-border-default">
                          <p className="text-[9px] text-tertiary font-mono font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Brain className="w-3 h-3 text-tertiary" /> Why this matters
                          </p>
                          <div className="text-xs text-text-secondary prose prose-invert prose-xs max-w-none [&_strong]:text-tertiary [&_p]:mt-0 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5 leading-relaxed">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeSanitize]}
                            >
                              {normalizeMarkdown(explanationText)}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
