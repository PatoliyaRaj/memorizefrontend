"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCardsForNode, postReview, type Card } from '@/services/study-service'
import { useStudyStore } from '@/stores/use-study-store'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/lib/toast'
import { cn } from '@/lib/utils'
import {PartyPopperIcon} from 'lucide-react'

export default function StudyPage() {
  const params = useParams()
  const nodeId = params?.nodeId as string
  const router = useRouter()

  // Store management
  const { cards, currentIndex, setCards, next, reset } = useStudyStore()

  // Local interaction states
  const [answerText, setAnswerText] = useState('')
  const [showReveal, setShowReveal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Session stats for summary & backpressure
  const [sessionCardsCount, setSessionCardsCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [ignoreBackpressure, setIgnoreBackpressure] = useState(false)
  const [showBackpressureWarning, setShowBackpressureWarning] = useState(false)
  const [isSessionFinished, setIsSessionFinished] = useState(false)

  // Timer to track response time
  const cardStartTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!nodeId) return
    let mounted = true
    setLoading(true)
    reset()

    getCardsForNode(nodeId)
      .then((c) => {
        if (mounted) {
          setCards(c)
        }
      })
      .catch(() => {
        toastError('Failed to retrieve study cards.')
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [nodeId, setCards, reset])

  // Reset card start timer on card change
  useEffect(() => {
    cardStartTimeRef.current = Date.now()
  }, [currentIndex])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060A09] text-text-primary flex items-center justify-center font-body p-6">
        <div className="text-center space-y-3 max-w-sm rounded-2xl border border-border-default bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
          <span className="material-symbols-outlined text-4xl text-[#6BD8CB] animate-spin">
            neurology
          </span>
          <h3 className="font-display text-lg font-bold text-text-primary">Loading Synaptic Pathway</h3>
          <p className="text-xs text-text-secondary">Retrieving target FSRS active recall deck...</p>
        </div>
      </div>
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="min-h-screen bg-[#060A09] text-text-primary flex items-center justify-center font-body p-6">
        <div className="text-center space-y-4 max-w-2xl rounded-2xl border border-border-default bg-[#0B1210] p-8 shadow-lg">
          <span className="material-symbols-outlined text-4xl text-text-tertiary">
            layers_clear
          </span>
          <h3 className="font-display text-xl font-bold text-text-primary">Synaptic Deck Empty</h3>
          <p className="text-sm text-text-secondary">
            No active recall cards are attached to this neural node yet. Return to the map to append questions.
          </p>
          <Button
            onClick={() => router.back()}
            className="w-full bg-[#0D9488] text-white hover:bg-[#14B8A6] font-bold"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Final summary completion card
  if (isSessionFinished) {
    const accuracy = sessionCardsCount > 0 ? Math.round((correctCount / sessionCardsCount) * 100) : 0
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#060A09] text-text-primary flex items-center justify-center font-body p-4 md:p-6">
        <div className="w-full max-w-2xl rounded-2xl border border-[#6BD8CB]/20 bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-center space-y-6">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#134E4A]/30 border border-[#2DD4BF]/30 shadow-glow mb-2">
            <span className="material-symbols-outlined text-3xl text-[#6BD8CB] animate-bounce">
              <PartyPopperIcon/>
            </span>
           
          </div>

          <div>
            <h1 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
              Synaptic Review Completed!
            </h1>
            <p className="text-xs text-text-secondary uppercase tracking-widest font-mono mt-1.5">
              FSRS Weights Calibrated
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-border-default/40 py-5 my-2">
            <div>
              <p className="font-mono text-2xl font-bold text-[#6BD8CB]">{sessionCardsCount}</p>
              <p className="text-[10px] uppercase font-mono text-text-secondary mt-1">Cards Reviewed</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-emerald-400">{correctCount}</p>
              <p className="text-[10px] uppercase font-mono text-text-secondary mt-1">Successful Recalls</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-bold text-amber-400">{accuracy}%</p>
              <p className="text-[10px] uppercase font-mono text-text-secondary mt-1">Recall Accuracy</p>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-[#121C1A]/40 p-4 text-xs text-text-secondary text-left leading-relaxed">
            🧠 <strong>Neuroscience Tip:</strong> FSRS algorithm has updated your memory stability variables. Re-access this node when scheduled to solidify long-term retention.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => router.back()}
              className="flex-1 bg-[#0D9488] text-white hover:bg-[#14B8A6] font-bold"
            >
              Return to Canvas
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSessionFinished(false)
                setSessionCardsCount(0)
                setCorrectCount(0)
                setIgnoreBackpressure(false)
                reset()
              }}
              className="flex-1 border-border-default text-text-primary hover:bg-[#1F312D]"
            >
              Review Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Backpressure Warning Card
  if (showBackpressureWarning && !ignoreBackpressure) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#060A09] text-text-primary flex items-center justify-center font-body p-4 md:p-6">
        <div className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.85)] text-center space-y-6">
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-[#3A2A0A] border border-amber-500/30 text-amber-400 animate-pulse">
            <span className="material-symbols-outlined text-2xl">
              warning
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Cognitive Overload Protection
            </h2>
            <p className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Memory Ingestion Backpressure Alert
            </p>
          </div>

          <div className="text-sm text-text-secondary leading-relaxed space-y-3 text-left bg-surface-void/40 border border-border-subtle p-4 rounded-xl">
            <p>
              You have already reviewed <strong>5 memory slots</strong> in this session.
            </p>
            <p>
              According to modern neuro-spaced repetition research, forcing additional pathway ingestions without consolidating existing memory nodes leads to high interference and faster decay.
            </p>
            <p className="text-xs text-text-tertiary">
              We highly recommend pausing to let synaptic structures stabilize.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => router.back()}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold border border-amber-600/30"
            >
              Consolidate & Go to Map
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIgnoreBackpressure(true)
                setShowBackpressureWarning(false)
              }}
              className="flex-1 border-border-default text-text-primary hover:bg-[#1F312D] text-xs"
            >
              Continue Anyway (Not Recommended)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const card = cards[currentIndex] as Card

  async function submitAnswer(wasCorrect: boolean, confidenceOverride?: number) {
    setSubmitting(true)
    const confidence = wasCorrect ? (confidenceOverride ?? 4) : 1
    const responseTimeMs = Date.now() - cardStartTimeRef.current

    try {
      await postReview({
        cardId: card.id,
        confidence,
        wasCorrect,
        responseTimeMs,
      })

      // Update session statistics
      setSessionCardsCount((prev) => prev + 1)
      if (wasCorrect) setCorrectCount((prev) => prev + 1)

      toastSuccess(wasCorrect ? 'Calibration updated.' : 'Response noted. Scheduled for recalculation.')
    } catch (e) {
      console.error(e)
    }

    setSubmitting(false)
    setShowReveal(false)
    setAnswerText('')

    // Backpressure check on completing 5 reviews
    const nextCount = sessionCardsCount + 1
    if (nextCount === 5 && !ignoreBackpressure) {
      setShowBackpressureWarning(true)
      return
    }

    // Progression index
    if (currentIndex + 1 >= cards.length) {
      setIsSessionFinished(true)
    } else {
      next()
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#060A09] text-text-primary font-body px-4 py-8 md:py-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Top Navigation / Info Header */}
        <div className="flex items-center justify-between border-b border-border-default/40 pb-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6BD8CB]">psychology</span>
              Free Recall Session
            </h1>
            <p className="text-xs text-[#9BBFBB] font-mono mt-1">
              Active memory testing solidifies neurological nodes.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-border-default bg-[#0B1210] text-[#6BD8CB] font-bold">
              Card {currentIndex + 1} of {cards.length}
            </span>
          </div>
        </div>

        {/* Study Main Deck Panel */}
        <div className="rounded-2xl border border-border-brand/40 bg-[#0B1210] p-6 md:p-8 shadow-[0_12px_40px_rgba(20,184,166,0.12)] space-y-6 relative overflow-hidden">
          {/* Subtle brand glow on active deck */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6BD8CB]/40 to-transparent" />

          {/* Question Segment */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold block">
              Active Cue Question
            </span>
            <div className="font-display text-lg md:text-xl font-bold text-text-primary leading-snug">
              {card.question}
            </div>
          </div>

          {/* Phase 1: Free Recall Textbox */}
          {!showReveal && (
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">
                  Write down details from memory
                </span>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full min-h-[180px] rounded-xl border border-border-default bg-[#060A09] p-4 text-sm md:text-base text-text-primary outline-none transition-all focus:border-[#6BD8CB] focus:ring-1 focus:ring-[#6BD8CB] placeholder:text-text-tertiary/60 leading-relaxed"
                  placeholder="Draft everything you remember about this question to scientifically calibrate FSRS weights..."
                  autoFocus
                />
              </label>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setShowReveal(true)}
                  className="bg-[#0D9488] text-white hover:bg-[#14B8A6] px-6 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(13,148,136,0.2)]"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Reveal & Compare
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
                  <div className="text-sm text-text-primary leading-relaxed flex-1 font-semibold whitespace-pre-wrap">
                    {card.answer}
                  </div>
                </div>
              </div>

              {/* Memory Elaboration Text */}
              {(card as any).explanation && (
                <div className="rounded-xl border border-border-subtle bg-surface-void/40 p-4 space-y-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold block">
                    Memory Elaboration
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {(card as any).explanation}
                  </p>
                </div>
              )}

              {/* Scientific Sliding Grade Panel */}
              <div className="rounded-xl border border-border-default bg-[#060A09] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">
                    Quantify Memory Confidence (FSRS sliding grade)
                  </span>
                  <span className="text-[10px] font-mono text-text-tertiary">
                    1 = Weak / 5 = Mastered
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Sliding 1 to 5 Confidence Grid */}
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((grade) => (
                      <button
                        key={grade}
                        onClick={() => submitAnswer(true, grade)}
                        disabled={submitting}
                        className={cn(
                          "py-2 px-3 border text-xs font-bold rounded-lg font-mono transition-all",
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

                  {/* Absolute Incorrect Option */}
                  <Button
                    type="button"
                    onClick={() => submitAnswer(false)}
                    disabled={submitting}
                    className="bg-[#4A1A1A] border border-red-500/20 hover:bg-[#591C02] text-[#F87171] rounded-lg text-xs font-bold px-4 h-9 whitespace-nowrap"
                  >
                    I was incorrect
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back and Utility Options */}
        <div className="flex justify-between items-center text-xs">
          <button
            onClick={() => router.back()}
            className="text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Canvas
          </button>
          <span className="text-text-tertiary font-mono">
            NeuroLearn Cognitive Engine v1.1
          </span>
        </div>
      </div>
    </div>
  )
}
