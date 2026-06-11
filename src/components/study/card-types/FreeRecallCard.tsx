'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { normalizeMarkdown, stripLeadingBullet } from '@/lib/markdown';
import { Eye, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { type Card } from '@/services/study-service';

interface Props {
  card: Card;
  showReveal: boolean;
  answerText: string;
  setAnswerText: (val: string) => void;
  setShowReveal: (val: boolean) => void;
  onSubmitAnswer: (wasCorrect: boolean, confidence?: number) => void;
  modeParam?: string;
  submitting: boolean;
  hasAttemptedRecall: boolean;
  setHasAttemptedRecall: (val: boolean) => void;
}

export function FreeRecallCard({
  card,
  showReveal,
  answerText,
  setAnswerText,
  setShowReveal,
  onSubmitAnswer,
  modeParam,
  submitting,
  hasAttemptedRecall,
  setHasAttemptedRecall,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Phase 1: Free Recall Textbox */}
      {!showReveal && (
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">
              Write down details from memory
            </span>
            <textarea
              value={answerText}
              onChange={(e) => {
                setAnswerText(e.target.value);
                setHasAttemptedRecall(true);
              }}
              onFocus={() => setHasAttemptedRecall(true)}
              className="w-full min-h-[180px] rounded-xl border border-border-default bg-[#060A09] p-4 text-sm md:text-base text-text-primary outline-none transition-all focus:border-[#6BD8CB] focus:ring-1 focus:ring-[#6BD8CB] placeholder:text-text-tertiary/60 leading-relaxed"
              placeholder={
                modeParam === 'exam'
                  ? 'Write a short answer quickly! Hints and explanations are locked under exam rules.'
                  : 'Draft everything you remember about this question to scientifically calibrate FSRS weights...'
              }
              autoFocus
            />
          </label>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => setShowReveal(true)}
              className="bg-[#0D9488] text-white hover:bg-[#14B8A6] px-6 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(13,148,136,0.2)]"
            >
              <Eye className="w-4 h-4" />
              {hasAttemptedRecall ? (
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-yellow-400" />
                  Close eyes, hold your answer, then Reveal
                </span>
              ) : (
                'Reveal & Compare'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Phase 2: Side by Side Verification & 1-to-5 FSRS Grading */}
      {showReveal && (
        <div className="space-y-6 animate-fade-in">
          {/* Comparison Box */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border-default bg-[#060A09] p-4 flex flex-col">
              <span className="text-[9px] font-mono uppercase tracking-wider text-text-tertiary mb-2 font-bold block border-b border-border-subtle pb-1">
                Your Typed Recall
              </span>
              <div className="text-sm text-text-secondary leading-relaxed flex-1 whitespace-pre-wrap">
                {answerText.trim() ? answerText : <em className="text-text-disabled">No recall typed</em>}
              </div>
            </div>

            <div className="rounded-xl border border-[#6BD8CB]/20 bg-[#121C1A] p-4 flex flex-col shadow-[0_0_12px_rgba(20,184,166,0.04)]">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#6BD8CB] mb-2 font-bold block border-b border-border-subtle pb-1">
                Correct Synaptic Target
              </span>
              <div className="text-sm text-text-primary leading-relaxed flex-1 font-semibold [&_strong]:font-bold [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1 [&_li]:my-0.5 [&_p]:my-0.5">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {normalizeMarkdown(card.answer)}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Memory Elaboration / Retrieval Cue (Hidden in Exam Mode) */}
          {card.explanation && modeParam !== 'exam' && (() => {
            let subTopic: string | null = null;
            let explanationText = card.explanation as string;
            try {
              const parsed = JSON.parse(explanationText);
              if (parsed?.text) explanationText = parsed.text;
              if (parsed?.subTopic) subTopic = parsed.subTopic;
            } catch {
              /* plain string */
            }

            return (
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
            );
          })()}

          {/* Scientific Sliding Grade Panel */}
          <div className="rounded-xl border border-border-default bg-[#060A09] p-4">
            {modeParam === 'exam' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">
                  <span>Grade Exam Response</span>
                  <span>Pass / Fail grading mode</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => onSubmitAnswer(true, 4)}
                    disabled={submitting}
                    className="flex-1 bg-[#0D9488] hover:bg-[#14B8A6] text-white font-bold h-11 text-sm rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Correct
                  </Button>
                  <Button
                    onClick={() => onSubmitAnswer(false)}
                    disabled={submitting}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold h-11 text-sm rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Incorrect
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">
                    Quantify Memory Confidence (FSRS sliding grade)
                  </span>
                  <span className="text-[10px] font-mono text-text-tertiary">
                    1 = Weak / 5 = Mastered
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((grade) => (
                      <button
                        key={grade}
                        onClick={() => onSubmitAnswer(true, grade)}
                        disabled={submitting}
                        className={cn(
                          'py-2 px-3 border text-xs font-bold rounded-lg font-mono transition-all',
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

                  <Button
                    type="button"
                    onClick={() => onSubmitAnswer(false)}
                    disabled={submitting}
                    className="bg-[#4A1A1A] border border-red-500/20 hover:bg-[#591C02] text-[#F87171] rounded-lg text-xs font-bold px-4 h-9 whitespace-nowrap"
                  >
                    I was incorrect
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
