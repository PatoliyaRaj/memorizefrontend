'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { normalizeMarkdown } from '@/lib/markdown';
import { Check, X, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { type Card } from '@/services/study-service';

interface Props {
  card: Card;
  onSubmitAnswer: (wasCorrect: boolean, confidence?: number) => void;
  submitting: boolean;
  modeParam?: string;
}

export function ClozeCard({ card, onSubmitAnswer, submitting, modeParam }: Props) {
  const [userAnswer, setUserAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Split question by triple underscore
  const questionText = card.question || '';
  const parts = questionText.split('___');

  useEffect(() => {
    setUserAnswer('');
    setRevealed(false);
    setIsCorrect(false);
  }, [card.id]);

  function handleCheck() {
    if (!userAnswer.trim()) return;
    const cleanUser = userAnswer.trim().toLowerCase();
    const cleanAnswer = card.answer.trim().toLowerCase();
    const correct = cleanUser === cleanAnswer;

    setIsCorrect(correct);
    setRevealed(true);
  }

  const subTopic = (() => {
    try {
      const parsed = JSON.parse(card.explanation || '');
      return parsed?.subTopic || null;
    } catch {
      return null;
    }
  })();

  const explanationText = (() => {
    try {
      const parsed = JSON.parse(card.explanation || '');
      return parsed?.text || card.explanation;
    } catch {
      return card.explanation;
    }
  })();

  return (
    <div className="space-y-6">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold block">
        Fill in the Blank
      </span>

      {/* Inline Blank rendering */}
      <div className="text-base md:text-lg font-medium text-slate-200 leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-3 p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
        {parts.length > 1 ? (
          parts.map((part, idx) => (
            <React.Fragment key={idx}>
              <span>{part}</span>
              {idx < parts.length - 1 && (
                <input
                  type="text"
                  value={userAnswer}
                  disabled={revealed}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className={cn(
                    "mx-1 px-3 py-1 bg-slate-900 border text-sm w-40 rounded-lg font-bold outline-none transition-all shadow-inner focus:ring-1",
                    revealed
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-950/20 text-emerald-400"
                        : "border-rose-500 bg-rose-950/20 text-rose-400"
                      : "border-slate-700 text-teal-300 focus:border-teal-500 focus:ring-teal-500/50"
                  )}
                  placeholder="type blank..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userAnswer.trim() && !revealed) {
                      handleCheck();
                    }
                  }}
                  autoFocus
                />
              )}
            </React.Fragment>
          ))
        ) : (
          /* Fallback if no ___ found in question */
          <div className="w-full space-y-4">
            <p className="text-slate-200">{card.question}</p>
            <input
              type="text"
              value={userAnswer}
              disabled={revealed}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={cn(
                "w-full px-4 py-2 bg-slate-900 border rounded-xl font-medium outline-none transition-all focus:ring-1",
                revealed
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-950/20 text-emerald-400"
                    : "border-rose-500 bg-rose-950/20 text-rose-400"
                  : "border-slate-700 text-teal-300 focus:border-teal-500 focus:ring-teal-500/50"
              )}
              placeholder="Type your answer here..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userAnswer.trim() && !revealed) {
                  handleCheck();
                }
              }}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Verification & Review */}
      {!revealed ? (
        <div className="flex justify-end">
          <Button
            onClick={handleCheck}
            disabled={!userAnswer.trim()}
            className="bg-[#0D9488] text-white hover:bg-[#14B8A6] px-6 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(13,148,136,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check Answer
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Comparison results */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border-default bg-[#060A09] p-4 flex flex-col">
              <span className="text-[9px] font-mono uppercase tracking-wider text-text-tertiary mb-2 font-bold block border-b border-border-subtle pb-1">
                Your Answer
              </span>
              <div className="text-sm text-text-secondary leading-relaxed flex-1 flex items-center gap-2 font-mono">
                {isCorrect ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <X className="w-4 h-4 text-rose-400 shrink-0" />}
                <span className={isCorrect ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {userAnswer}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#6BD8CB]/20 bg-[#121C1A] p-4 flex flex-col shadow-[0_0_12px_rgba(20,184,166,0.04)]">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#6BD8CB] mb-2 font-bold block border-b border-border-subtle pb-1">
                Correct Answer
              </span>
              <div className="text-sm text-text-primary leading-relaxed flex-1 font-mono font-bold text-teal-300">
                {card.answer}
              </div>
            </div>
          </div>

          {/* Explanation */}
          {explanationText && modeParam !== 'exam' && (
            <div className="rounded-xl border border-border-subtle bg-surface-void/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold block">
                  Memory Hook — Why This Matters
                </span>
                {subTopic && (
                  <span className="text-[9px] font-mono text-violet-400 bg-violet-950/30 border border-violet-800/50 px-2 py-0.5 rounded-full">
                    {subTopic}
                  </span>
                )}
              </div>
              <div className="text-xs text-text-secondary leading-relaxed [&_strong]:font-semibold [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1 [&_li]:my-0.5 [&_p]:my-0.5">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {normalizeMarkdown(explanationText)}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Grading Panels */}
          <div className="rounded-xl border border-border-default bg-[#060A09] p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">
                Quantify Memory Confidence
              </span>
              <span className="text-[10px] font-mono text-text-tertiary">
                {isCorrect ? 'Auto-graded: Correct' : 'Auto-graded: Incorrect'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={() => onSubmitAnswer(isCorrect, isCorrect ? 4 : 1)}
                disabled={submitting}
                className={cn(
                  "flex-1 font-bold h-11 text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md",
                  isCorrect
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-rose-600 hover:bg-rose-500 text-white"
                )}
              >
                {isCorrect ? 'Correct! Continue (Good) →' : 'Incorrect. Continue →'}
              </Button>

              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((grade) => (
                  <button
                    key={grade}
                    disabled={submitting}
                    onClick={() => onSubmitAnswer(true, grade)}
                    className={cn(
                      "w-10 h-11 border text-xs font-bold rounded-lg font-mono transition-all",
                      grade === 1 && "border-red-500/20 text-red-400 hover:bg-red-500/10",
                      grade === 2 && "border-amber-500/20 text-amber-400 hover:bg-amber-500/10",
                      grade === 3 && "border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10",
                      grade === 4 && "border-[#6BD8CB]/30 text-[#6BD8CB] hover:bg-[#6BD8CB]/10",
                      grade === 5 && "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 shadow-[0_0_8px_rgba(52,211,153,0.1)]"
                    )}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
