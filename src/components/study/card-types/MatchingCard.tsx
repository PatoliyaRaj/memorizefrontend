'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { normalizeMarkdown } from '@/lib/markdown';
import { Check, X, RefreshCw } from 'lucide-react';
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

export function MatchingCard({
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
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [userPairs, setUserPairs] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Parse correct pairs
  const parsedPairs = React.useMemo(() => {
    const lines = (card.answer || '').split('\n').filter(Boolean);
    const correctPairs: Record<string, string> = {};
    let isValid = true;

    for (const line of lines) {
      const parts = line.split('::');
      if (parts.length === 2) {
        correctPairs[parts[0].trim()] = parts[1].trim();
      } else {
        isValid = false;
        break;
      }
    }

    if (isValid && Object.keys(correctPairs).length >= 2) {
      return correctPairs;
    }
    return null;
  }, [card.answer, card.id]);

  useEffect(() => {
    if (parsedPairs) {
      const lefts = Object.keys(parsedPairs).sort(() => Math.random() - 0.5);
      const rights = Object.values(parsedPairs).sort(() => Math.random() - 0.5);
      setLeftItems(lefts);
      setRightItems(rights);
    }
    setUserPairs({});
    setSelectedLeft(null);
    setRevealed(false);
    setIsCorrect(false);
  }, [card.id, parsedPairs]);

  if (!parsedPairs) {
    // Fallback if parsing fails
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

  function handleLeftClick(leftVal: string) {
    if (userPairs[leftVal]) {
      // Reset this pair
      setUserPairs((prev) => {
        const copy = { ...prev };
        delete copy[leftVal];
        return copy;
      });
    } else {
      setSelectedLeft(selectedLeft === leftVal ? null : leftVal);
    }
  }

  function handleRightClick(rightVal: string) {
    if (!selectedLeft) return;
    setUserPairs((prev) => ({ ...prev, [selectedLeft]: rightVal }));
    setSelectedLeft(null);
  }

  function handleVerify() {
    const keys = Object.keys(parsedPairs!);
    const correct = keys.every((k) => userPairs[k] === parsedPairs![k]);
    setIsCorrect(correct);
    setRevealed(true);
  }

  function handleReset() {
    setUserPairs({});
    setSelectedLeft(null);
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
          Match the Associated Concepts
        </span>
        <div className="font-display text-lg md:text-xl font-bold text-text-primary leading-snug">
          {card.question}
        </div>
      </div>

      {/* Grid of Left and Right Items */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column (Concepts) */}
        <div className="space-y-2">
          <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider font-bold">
            Concept
          </p>
          <div className="space-y-2">
            {leftItems.map((left) => {
              const isMatched = !!userPairs[left];
              const isSelected = selectedLeft === left;

              let buttonStyle = 'border-slate-800 bg-[#0B1210] text-slate-200';

              if (isSelected) {
                buttonStyle = 'border-teal-500 bg-teal-950/20 text-teal-300 shadow-[0_0_10px_rgba(20,184,166,0.1)]';
              } else if (isMatched && !revealed) {
                buttonStyle = 'border-slate-900 bg-slate-950/40 text-text-secondary line-through opacity-70';
              }

              if (revealed) {
                const isCorrectPair = userPairs[left] === parsedPairs[left];
                buttonStyle = isCorrectPair
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400 font-medium'
                  : 'border-rose-500/50 bg-rose-950/20 text-rose-400';
              }

              return (
                <button
                  key={left}
                  disabled={revealed}
                  onClick={() => handleLeftClick(left)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl border text-xs transition-all duration-200 outline-none flex items-center justify-between',
                    buttonStyle
                  )}
                >
                  <span className="truncate pr-2">{left}</span>
                  {isMatched && !revealed && (
                    <span className="text-[9px] font-mono text-teal-400 bg-teal-950/30 px-1.5 py-0.5 rounded border border-teal-800/40 shrink-0">
                      Paired
                    </span>
                  )}
                  {revealed && (
                    userPairs[left] === parsedPairs[left] ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (Matches) */}
        <div className="space-y-2">
          <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider font-bold">
            Synaptic Match
          </p>
          <div className="space-y-2">
            {rightItems.map((right) => {
              const isMatched = Object.values(userPairs).includes(right);
              const isMatchedToSelected = selectedLeft && userPairs[selectedLeft] === right;

              let buttonStyle = 'border-slate-800 bg-[#0B1210] text-slate-300';

              if (isMatched && !revealed) {
                buttonStyle = 'border-slate-900 bg-slate-950/30 text-slate-600 opacity-50';
              } else if (selectedLeft) {
                buttonStyle = 'border-teal-500/40 hover:border-teal-500 text-teal-300 cursor-pointer';
              }

              if (revealed) {
                // Find which left key this was matched to
                const leftKey = Object.keys(userPairs).find((k) => userPairs[k] === right);
                const isCorrectMatch = leftKey && parsedPairs[leftKey] === right;
                buttonStyle = isCorrectMatch
                  ? 'border-emerald-500/40 bg-emerald-950/10 text-emerald-400/80 font-medium'
                  : 'border-slate-900 bg-slate-950/20 text-slate-600 opacity-50';
              }

              return (
                <button
                  key={right}
                  disabled={!selectedLeft || isMatched || revealed}
                  onClick={() => handleRightClick(right)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl border text-xs transition-all duration-200 outline-none flex items-center justify-between',
                    buttonStyle
                  )}
                >
                  <span className="truncate">{right}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Show Matches Status */}
      {Object.keys(userPairs).length > 0 && (
        <div className="rounded-xl border border-border-default bg-[#060A09]/50 p-4 space-y-2">
          <p className="text-[10px] font-mono text-text-secondary uppercase tracking-wider font-bold">
            Current Connections
          </p>
          <div className="grid gap-2">
            {leftItems.map((left) => {
              const rightVal = userPairs[left];
              if (!rightVal) return null;

              const isCorrectPair = revealed && rightVal === parsedPairs[left];

              return (
                <div
                  key={left}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg bg-[#0B1210] border text-xs",
                    revealed
                      ? isCorrectPair
                        ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-400"
                        : "border-rose-500/20 bg-rose-950/10 text-rose-400"
                      : "border-slate-800 text-slate-300"
                  )}
                >
                  <span className="font-medium truncate max-w-[45%]">{left}</span>
                  <span className="text-text-tertiary font-bold">&rarr;</span>
                  <span className="font-medium truncate max-w-[45%] text-right">{rightVal}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Area */}
      {!revealed ? (
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={Object.keys(userPairs).length === 0}
            className="border-border-default hover:bg-[#1F312D] text-xs font-bold"
          >
            Reset All
          </Button>
          <Button
            onClick={handleVerify}
            disabled={Object.keys(userPairs).length !== leftItems.length}
            className="bg-[#0D9488] text-white hover:bg-[#14B8A6] px-6 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(13,148,136,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verify Matches
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Correct Target Matches Table (if user made mistakes) */}
          {!isCorrect && (
            <div className="rounded-xl border border-[#6BD8CB]/20 bg-[#121C1A] p-4 space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#6BD8CB] mb-2 font-bold block border-b border-[#6BD8CB]/10 pb-1">
                Correct Synaptic Matches
              </span>
              <div className="grid gap-2">
                {Object.entries(parsedPairs).map(([left, right]) => (
                  <div key={left} className="text-xs text-text-secondary flex justify-between bg-slate-900/30 p-2 rounded border border-slate-800/40">
                    <span className="font-semibold text-slate-300">{left}</span>
                    <span className="text-teal-400 font-bold">&rarr;</span>
                    <span className="text-slate-300">{right}</span>
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
