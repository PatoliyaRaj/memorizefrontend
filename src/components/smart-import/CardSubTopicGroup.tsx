'use client';

/**
 * Card Sub-Topic Group Component
 *
 * Security: rehype-sanitize added to ALL ReactMarkdown instances.
 * This prevents XSS via LLM-hallucinated HTML (e.g., <img onerror='alert(1)'>)
 * from executing in the student's browser. rehype-sanitize uses the GitHub
 * allow-list by default — strips all event handlers and script tags while
 * preserving safe formatting (bold, lists, code, arrows).
 *
 * Features:
 *  - Cards grouped by subTopic in collapsible <details> sections
 *  - "▼ Why?" expandable explanation panel (memory hook)
 *  - Inline edit mode for question + answer
 *  - Length warning for overlong Q/A
 *  - Card type badge (definition, property, cause, etc.)
 *
 * IMPORTANT: Before using this component ensure:
 *   npm install rehype-sanitize --save   (in /frontend)
 */

import { useState }    from 'react';
import ReactMarkdown   from 'react-markdown';
import remarkGfm       from 'remark-gfm';
import rehypeSanitize  from 'rehype-sanitize'; // ← SECURITY: XSS prevention
import { normalizeMarkdown } from '@/lib/markdown';

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

/**
 * Parse explanation — supports both plain string and JSON format.
 * The backend saves explanation as JSON: { subTopic: string, text: string }
 */
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

  // Group cards by subTopic
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
          <details key={topic} open className="border border-slate-800 rounded-lg overflow-hidden">
            <summary className="flex justify-between items-center p-3 bg-slate-900/60 cursor-pointer hover:bg-slate-900 select-none list-none">
              <div className="flex items-center gap-2 font-medium">
                <span className="text-slate-600 text-[10px]">▶</span>
                <span className="text-sm font-semibold text-slate-200">{topic}</span>
                <span className="text-xs text-slate-500 font-normal">({topicCards.length} card{topicCards.length !== 1 ? 's' : ''})</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                {activeCount}/{topicCards.length} kept
              </span>
            </summary>

            <div className="p-3 space-y-3 bg-slate-950/10">
              {topicCards.map(card => {
                const hasLengthWarning = card.question.length > 120 || card.answer.length > 600;
                const explanationText  = parseExplanation(card.explanation);
                const showExplanation  = expandedExplanations.has(card.id);

                return (
                  <div
                    key={card.id}
                    className={`border rounded-lg transition-all ${
                      card.keep
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-900/20 border-slate-900 opacity-40'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-center p-3 pb-0">
                      <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                        {card.type ?? 'free_recall'}
                      </span>
                      <div className="flex items-center gap-3">
                        {explanationText && (
                          <button
                            onClick={() => toggleExplanation(card.id)}
                            className="text-[10px] text-violet-400 hover:text-violet-300 font-medium"
                          >
                            {showExplanation ? '▲ Hide' : '▼ Why?'}
                          </button>
                        )}
                        <button
                          onClick={() => onToggleEdit(card.id)}
                          className="text-[10px] text-slate-400 hover:text-slate-200"
                        >
                          {card.editing ? 'Done' : 'Edit'}
                        </button>
                        <button
                          onClick={() => onToggleKeep(card.id)}
                          className={`text-[10px] font-bold ${
                            card.keep ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'
                          }`}
                        >
                          {card.keep ? 'Remove' : 'Keep'}
                        </button>
                      </div>
                    </div>

                    {/* Length Warning */}
                    {hasLengthWarning && card.keep && (
                      <div className="mx-3 mt-2 text-[10px] text-yellow-500 bg-yellow-950/20 border border-yellow-900 px-2 py-1 rounded">
                        ⚠️ Question &gt;120 chars or answer &gt;600 chars — consider shortening.
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
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-teal-600"
                          />
                          <textarea
                            value={card.answer}
                            onChange={e => onEditCard(card.id, 'answer', e.target.value)}
                            placeholder="Answer (supports **bold**, → arrows, bullet lists)"
                            rows={3}
                            className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 resize-none focus:outline-none focus:border-teal-600 font-mono"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-100">
                            Q: {card.question || <span className="text-red-400 italic">Empty</span>}
                          </p>
                          <div className="text-xs text-slate-300 prose prose-invert prose-xs max-w-none [&_strong]:text-slate-100 [&_p]:mt-0 [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5">
                            <span className="text-slate-500 font-semibold not-prose">A: </span>
                            {/*
                              SECURITY: rehypeSanitize strips malicious HTML/scripts from LLM output.
                              Prevents stored XSS via hallucinated <img onerror="..."> or <script> tags.
                            */}
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeSanitize]}
                            >
                              {normalizeMarkdown(card.answer) || '*Empty*'}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* Explanation Panel — "Why this matters" memory hook */}
                      {showExplanation && explanationText && (
                        <div className="mt-3 pt-3 border-t border-slate-800">
                          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wide mb-1.5">
                            Why this matters
                          </p>
                          <div className="text-xs text-slate-400 prose prose-invert prose-xs max-w-none [&_strong]:text-violet-300 [&_p]:mt-0 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5">
                            {/* SECURITY: rehypeSanitize on explanation field too */}
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
