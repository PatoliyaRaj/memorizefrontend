'use client';

import React from 'react';
import { type Card } from '@/services/study-service';
import { FreeRecallCard } from './card-types/FreeRecallCard';
import { ClozeCard } from './card-types/ClozeCard';
import { MCQCard } from './card-types/MCQCard';
import { OrderingCard } from './card-types/OrderingCard';
import { MatchingCard } from './card-types/MatchingCard';

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

export default function CardQuestionRenderer({
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
  const type = card.questionType || 'free_recall';

  switch (type) {
    case 'free_recall':
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
    case 'cloze':
      return (
        <ClozeCard
          card={card}
          onSubmitAnswer={onSubmitAnswer}
          submitting={submitting}
          modeParam={modeParam}
        />
      );
    case 'multiple_choice':
      return (
        <MCQCard
          card={card}
          onSubmitAnswer={onSubmitAnswer}
          submitting={submitting}
          modeParam={modeParam}
          showReveal={showReveal}
          answerText={answerText}
          setAnswerText={setAnswerText}
          setShowReveal={setShowReveal}
          hasAttemptedRecall={hasAttemptedRecall}
          setHasAttemptedRecall={setHasAttemptedRecall}
        />
      );
    case 'ordering':
      return (
        <OrderingCard
          card={card}
          onSubmitAnswer={onSubmitAnswer}
          submitting={submitting}
          modeParam={modeParam}
        />
      );
    case 'matching':
      return (
        <MatchingCard
          card={card}
          onSubmitAnswer={onSubmitAnswer}
          submitting={submitting}
          modeParam={modeParam}
          showReveal={showReveal}
          answerText={answerText}
          setAnswerText={setAnswerText}
          setShowReveal={setShowReveal}
          hasAttemptedRecall={hasAttemptedRecall}
          setHasAttemptedRecall={setHasAttemptedRecall}
        />
      );
    default:
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
}
