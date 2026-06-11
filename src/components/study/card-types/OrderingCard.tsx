'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { normalizeMarkdown } from '@/lib/markdown';
import { Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { type Card } from '@/services/study-service';

interface Props {
  card: Card;
  onSubmitAnswer: (wasCorrect: boolean, confidence?: number) => void;
  submitting: boolean;
  modeParam?: string;
}

export function OrderingCard({ card, onSubmitAnswer, submitting, modeParam }: Props) {
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const correctOrder = React.useMemo(() => {
    return (card.answer || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [card.answer]);

  // Shuffle correct order on mount
  useEffect(() => {
    const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
    setUserOrder(shuffled);
    setRevealed(false);
    setIsCorrect(false);
  }, [card.id, correctOrder]);

  function shiftItem(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= userOrder.length) return;

    const updated = [...userOrder];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setUserOrder(updated);
  }

  function handleVerify() {
    const correct = userOrder.every((val, idx) => val === correctOrder[idx]);
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
      return parsed?.text || null;
    } catch {
      return card.explanation;
    }
  })();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold block">
          Reorder in Correct Sequence
        </span>
        <div className="font-display text-lg md:text-xl font-bold text-text-primary leading-snug">
          {card.question}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {userOrder.map((item, index) => {
          const isCorrectPosition = revealed && item === correctOrder[index];
          let itemStyle = 'border-slate-800 bg-[#0B1210] text-slate-200';

          if (revealed) {
            if (isCorrectPosition) {
              itemStyle = 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400';
            } else {
              itemStyle = 'border-rose-500/50 bg-rose-950/20 text-rose-400';
            }
          }

          return (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between p-3.5 border rounded-xl text-sm transition-all duration-200',
                itemStyle
              )}
            >
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <span className="text-xs font-mono text-text-tertiary select-none shrink-0">
                  {index + 1}.
                </span>
                <span className="font-medium leading-relaxed truncate">{item}</span>
              </div>

              {/* Shifting Buttons (disabled when revealed) */}
              {!revealed ? (
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => shiftItem(index, 'up')}
                    className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === userOrder.length - 1}
                    onClick={() => shiftItem(index, 'down')}
                    className="p-1 rounded text-text-secondary hover:text-text-primary hover:bg-[#1F312D] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="shrink-0 flex items-center">
                  {isCorrectPosition ? (
                    <Check className="w-4.5 h-4.5 text-emerald-400" />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <X className="w-4.5 h-4.5 text-rose-400" />
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-800/40">
                        Target: #{correctOrder.indexOf(item) + 1}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Area */}
      {!revealed ? (
        <div className="flex justify-end">
          <Button
            onClick={handleVerify}
            className="bg-[#0D9488] text-white hover:bg-[#14B8A6] px-6 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(13,148,136,0.2)]"
          >
            Verify Order
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Correct Target Order List (if user made mistakes) */}
          {!isCorrect && (
            <div className="rounded-xl border border-[#6BD8CB]/20 bg-[#121C1A] p-4 space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#6BD8CB] mb-2 font-bold block border-b border-[#6BD8CB]/10 pb-1">
                Correct Synaptic Order
              </span>
              <div className="space-y-1.5">
                {correctOrder.map((item, idx) => (
                  <div key={idx} className="text-xs text-text-secondary flex gap-2 items-center">
                    <span className="text-[#6BD8CB] font-mono font-bold">{idx + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* FSRS Grading */}
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
                  'flex-1 font-bold h-11 text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md',
                  isCorrect
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
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
                      'w-10 h-11 border text-xs font-bold rounded-lg font-mono transition-all',
                      grade === 1 && 'border-red-500/20 text-red-400 hover:bg-red-500/10',
                      grade === 2 && 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10',
                      grade === 3 && 'border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10',
                      grade === 4 && 'border-[#6BD8CB]/30 text-[#6BD8CB] hover:bg-[#6BD8CB]/10',
                      grade === 5 &&
                        'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 shadow-[0_0_8px_rgba(52,211,153,0.1)]'
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
