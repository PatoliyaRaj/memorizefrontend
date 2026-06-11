'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { normalizeMarkdown } from '@/lib/markdown';
import { Check, X } from 'lucide-react';
import { type Card } from '@/services/study-service';
import { FreeRecallCard } from './FreeRecallCard';

interface Props {
  card: Card;
  onSubmitAnswer: (wasCorrect: boolean, confidence?: number) => void;
  submitting: boolean;
  modeParam?: string;
  // Fallback props for FreeRecallCard if parsing fails
  showReveal: boolean;
  answerText: string;
  setAnswerText: (val: string) => void;
  setShowReveal: (val: boolean) => void;
  hasAttemptedRecall: boolean;
  setHasAttemptedRecall: (val: boolean) => void;
}

export function MCQCard({
  card,
  onSubmitAnswer,
  submitting,
  modeParam,
  showReveal,
  answerText,
  setAnswerText,
  setShowReveal,
  hasAttemptedRecall,
  setHasAttemptedRecall,
}: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Parse MCQ options
  const parsedMCQ = React.useMemo(() => {
    // Try explanation JSON first
    try {
      const parsed = JSON.parse(card.explanation || '');
      if (parsed && Array.isArray(parsed.options)) {
        return {
          questionText: card.question,
          options: parsed.options.map((o: any) => String(o).trim()),
        };
      }
    } catch {}

    // Fallback: Parse question string for options starting with A), B), C), D)
    const lines = (card.question || '').split('\n');
    const options: string[] = [];
    const questionLines: string[] = [];

    const optionRegex = /^[A-D][\.\)\-]\s*(.*)$/i;

    for (const line of lines) {
      const trimmed = line.trim();
      const match = trimmed.match(optionRegex);
      if (match) {
        options.push(match[1].trim());
      } else {
        questionLines.push(line);
      }
    }

    if (options.length >= 2) {
      return {
        questionText: questionLines.join('\n').trim(),
        options,
      };
    }

    return null;
  }, [card.question, card.explanation, card.id]);

  useEffect(() => {
    setSelectedIdx(null);
    setRevealed(false);
    setIsCorrect(false);
  }, [card.id]);

  if (!parsedMCQ || parsedMCQ.options.length === 0) {
    // Fall back to FreeRecallCard if options can't be parsed
    return (
      <FreeRecallCard
        card={card}
        showReveal={showReveal}
        answerText={answerText}
        setAnswerText={setAnswerText}
        setShowReveal={setShowReveal}
        onSubmitAnswer={onSubmitAnswer}
        modeParam={modeParam}
        submitting={submitting}
        hasAttemptedRecall={hasAttemptedRecall}
        setHasAttemptedRecall={setHasAttemptedRecall}
      />
    );
  }

  const { questionText, options } = parsedMCQ;

  // Find correct index by matching options with card.answer
  const correctIdx = options.findIndex((opt: string, idx: number) => {
    const cleanOpt = opt.toLowerCase().trim();
    const cleanAnswer = (card.answer || '').toLowerCase().trim();

    if (cleanOpt === cleanAnswer) return true;

    const letters = ['a', 'b', 'c', 'd'];
    if (cleanAnswer === letters[idx]) return true;

    if (
      cleanAnswer.startsWith(letters[idx] + ')') ||
      cleanAnswer.startsWith(letters[idx] + '.')
    ) {
      if (cleanAnswer.includes(cleanOpt)) return true;
    }

    return false;
  });

  function handleConfirm() {
    if (selectedIdx === null) return;
    const correct = selectedIdx === correctIdx;
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

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold block">
          Multiple Choice Question
        </span>
        <div className="font-display text-lg md:text-xl font-bold text-text-primary leading-snug">
          {questionText}
        </div>
      </div>

      {/* Options List */}
      <div className="grid gap-3">
        {options.map((option: string, idx: number) => {
          const isSelected = selectedIdx === idx;
          const isCorrectOption = idx === correctIdx;

          let optionStyle = 'border-slate-800 bg-[#0B1210] text-slate-300 hover:border-slate-700';

          if (isSelected && !revealed) {
            optionStyle = 'border-teal-500 bg-teal-950/20 text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.1)]';
          }

          if (revealed) {
            if (isCorrectOption) {
              optionStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-400 font-semibold';
            } else if (isSelected && !isCorrectOption) {
              optionStyle = 'border-rose-500 bg-rose-950/30 text-rose-400';
            } else {
              optionStyle = 'border-slate-900 bg-slate-950/20 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              disabled={revealed}
              onClick={() => setSelectedIdx(idx)}
              className={cn(
                'w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 flex items-start gap-3 outline-none focus:ring-1 focus:ring-teal-500/30',
                optionStyle
              )}
            >
              <span
                className={cn(
                  'h-5 w-5 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5',
                  isSelected && !revealed && 'border-teal-400 bg-teal-500/10 text-teal-300',
                  revealed && isCorrectOption && 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
                  revealed && isSelected && !isCorrectOption && 'border-rose-400 bg-rose-500/10 text-rose-300'
                )}
              >
                {letters[idx] || (idx + 1)}
              </span>
              <span className="flex-1 leading-relaxed">{option}</span>
              {revealed && isCorrectOption && <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />}
              {revealed && isSelected && !isCorrectOption && <X className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Action Area */}
      {!revealed ? (
        <div className="flex justify-end">
          <Button
            onClick={handleConfirm}
            disabled={selectedIdx === null}
            className="bg-[#0D9488] text-white hover:bg-[#14B8A6] px-6 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(13,148,136,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Selection
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
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
