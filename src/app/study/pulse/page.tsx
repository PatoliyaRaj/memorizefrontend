"use client"

import React, { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getTodayPulse, type PulseQueueItem } from '@/services/pulse-service'
import { postReview, startStudySession, endStudySession } from '@/services/study-service'
import { useStudyStore } from '@/stores/use-study-store'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { 
  PartyPopperIcon, 
  ChevronLeft, 
  BrainCircuit, 
  CalendarDays, 
  ShieldAlert,
  Timer,
  BedDouble
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { normalizeMarkdown } from '@/lib/markdown'
import CardQuestionRenderer from '@/components/study/CardQuestionRenderer'

function StudyPulsePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modeParam = (searchParams.get('mode') as 'normal' | 'exam') === 'exam' ? 'exam' : 'normal'

  // Store management
  const { cards, currentIndex, setCards, next, reset, sessionId, setSession } = useStudyStore()

  // Local interaction states
  const [answerText, setAnswerText] = useState('')
  const [showReveal, setShowReveal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Sleep warning / circadian status
  const [sleepWarning, setSleepWarning] = useState(false)

  // Exam Mode timer
  const [timeLeft, setTimeLeft] = useState(30)

  // Feynman Technique states
  const [showFeynman, setShowFeynman] = useState(false)
  const [selectedFeynmanCardId, setSelectedFeynmanCardId] = useState<string>('')
  const [feynmanText, setFeynmanText] = useState('')
  const [feynmanRating, setFeynmanRating] = useState(4)
  const [submittingFeynman, setSubmittingFeynman] = useState(false)
  const [feynmanCompleted, setFeynmanCompleted] = useState(false)

  // Session stats for summary & backpressure
  const [sessionCardsCount, setSessionCardsCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [ignoreBackpressure, setIgnoreBackpressure] = useState(false)
  const [showBackpressureWarning, setShowBackpressureWarning] = useState(false)
  const [isSessionFinished, setIsSessionFinished] = useState(false)

  // Timer to track response time
  const cardStartTimeRef = useRef<number>(Date.now())
  const sessionEndedRef = useRef(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    reset()
    setSleepWarning(false)
    sessionEndedRef.current = false

    // 1. Start study session
    startStudySession({ mode: modeParam })
      .then((session) => {
        if (mounted) {
          setSession(session.id, modeParam)
          if (!session.sleepWindowOk) {
            setSleepWarning(true)
          }
        }
      })
      .catch((err) => {
        console.error('Failed to start study session', err)
      })

    // 2. Fetch today's Pulse
    getTodayPulse()
      .then((pulseData) => {
        if (!mounted) return
        
        const pendingCards = (pulseData.cards || []).filter((c: PulseQueueItem) => !c.reviewedToday)
        
        if (pendingCards.length === 0) {
          setIsSessionFinished(true)
        } else {
          setCards(pendingCards)
          setSelectedFeynmanCardId(pendingCards[0].cardId)
        }
      })
      .catch((err) => {
        console.error(err)
        toastError('Failed to retrieve daily Pulse study queue.')
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [setCards, reset, modeParam, setSession])

  // Reset card start timer on card change
  useEffect(() => {
    cardStartTimeRef.current = Date.now()
  }, [currentIndex])

  // End session helper
  const endSessionFunc = async (notes?: string) => {
    if (sessionEndedRef.current || !sessionId) return
    sessionEndedRef.current = true
    try {
      await endStudySession(sessionId, { notes })
    } catch (err) {
      console.error('Failed to end study session', err)
    }
  }

  // End study session on unmount or unload
  useEffect(() => {
    if (!sessionId) return

    const handleBeforeUnload = () => {
      endStudySession(sessionId).catch(console.error)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (!sessionEndedRef.current) {
        sessionEndedRef.current = true
        endStudySession(sessionId).catch(console.error)
      }
    }
  }, [sessionId])

  // Exam Mode timer tick
  useEffect(() => {
    if (modeParam !== 'exam' || showReveal || isSessionFinished || showBackpressureWarning || showFeynman) return

    setTimeLeft(30)
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          toastError("Time's up! Registering as incorrect response.")
          setShowReveal(true)
          submitAnswer(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentIndex, modeParam, showReveal, isSessionFinished, showBackpressureWarning, showFeynman])

  async function submitAnswer(wasCorrect: boolean, confidenceOverride?: number) {
    setSubmitting(true)
    const confidence = wasCorrect ? (confidenceOverride ?? 4) : 1
    const responseTimeMs = Date.now() - cardStartTimeRef.current

    try {
      await postReview({
        cardId: card.cardId,
        confidence,
        wasCorrect,
        responseTimeMs,
        sessionId,
        reviewType: 'normal',
      })

      setSessionCardsCount((prev) => prev + 1)
      if (wasCorrect) setCorrectCount((prev) => prev + 1)

      toastSuccess(wasCorrect ? 'Calibration updated.' : 'Scheduled for review recalibration.')
    } catch (e) {
      console.error(e)
      toastError('Failed to record review response.')
    }

    setSubmitting(false)
    setShowReveal(false)
    setAnswerText('')

    // Trigger backpressure at 10 card review increments
    const nextCount = sessionCardsCount + 1
    if (nextCount > 0 && nextCount % 10 === 0 && !ignoreBackpressure) {
      setShowBackpressureWarning(true)
      return
    }

    if (currentIndex + 1 >= cards.length) {
      if (!feynmanCompleted) {
        setShowFeynman(true)
      } else {
        setIsSessionFinished(true)
        endSessionFunc(`Completed daily Pulse session with accuracy ${Math.round((correctCount / cards.length) * 100)}%`)
      }
    } else {
      next()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060A09] text-text-primary flex items-center justify-center font-body p-6">
        <div className="text-center space-y-3 max-w-sm rounded-2xl border border-border-default bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto animate-pulse">
            <BrainCircuit className="size-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-text-primary">Loading Synaptic Queue</h3>
          <p className="text-xs text-text-secondary">Retrieving today's interleaved review track...</p>
        </div>
      </div>
    )
  }

  // Feynman Technique Module
  if (showFeynman) {
    return (
      <div className="min-h-screen bg-[#060A09] text-text-primary flex items-center justify-center font-body p-4 md:p-6">
        <div className="w-full max-w-2xl rounded-2xl border border-[#6BD8CB]/30 bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#134E4A]/50 border border-[#2DD4BF]/30 text-[#6BD8CB]">
              <span className="material-symbols-outlined text-2xl">psychology_alt</span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold text-text-primary tracking-tight">Feynman Teach-Back</h1>
              <p className="text-xs text-[#9BBFBB] uppercase tracking-widest font-mono mt-0.5">Active Consolidation Phase</p>
            </div>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed bg-[#121C1A]/40 border border-border-subtle p-4 rounded-xl">
            💡 <strong>The Feynman Technique:</strong> Explain one of the concepts you studied in plain English, as if teaching a complete beginner. Active teaching forces your prefrontal cortex to construct new neural retrieval shortcuts.
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-[#9BBFBB] font-bold block">
                Select Concept to Explain
              </label>
              <select
                value={selectedFeynmanCardId}
                onChange={(e) => setSelectedFeynmanCardId(e.target.value)}
                className="w-full bg-[#060A09] border border-border-default rounded-xl p-3 text-sm text-text-primary outline-none focus:border-[#6BD8CB]"
              >
                {cards.map((c) => (
                  <option key={c.cardId} value={c.cardId}>
                    {c.question.length > 70 ? c.question.slice(0, 67) + '...' : c.question}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-[#9BBFBB] font-bold block">
                Your Explanation (Keep it simple!)
              </label>
              <textarea
                value={feynmanText}
                onChange={(e) => setFeynmanText(e.target.value)}
                className="w-full min-h-[160px] rounded-xl border border-border-default bg-[#060A09] p-4 text-sm text-text-primary outline-none transition-all focus:border-[#6BD8CB] focus:ring-1 focus:ring-[#6BD8CB] placeholder:text-text-tertiary/60 leading-relaxed font-body"
                placeholder="Explain the concept using simple terms, analogies, and no jargon..."
              />
            </div>

            <div className="rounded-xl border border-border-default bg-[#060A09] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">
                  Rate Simplicity & Clarity
                </span>
                <span className="font-mono text-[#6BD8CB] font-bold">
                  {feynmanRating} / 5
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                     key={val}
                     type="button"
                     onClick={() => setFeynmanRating(val)}
                     className={cn(
                       "py-2 border text-xs font-bold rounded-lg font-mono transition-all",
                       feynmanRating === val
                         ? "bg-[#134E4A] border-[#6BD8CB] text-[#6BD8CB] shadow-glow"
                         : "border-border-default text-text-secondary hover:bg-surface-hover"
                     )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={async () => {
                  if (!feynmanText.trim()) {
                    toastError('Please write down your explanation before submitting.')
                    return
                  }
                  setSubmittingFeynman(true)
                  try {
                    await postReview({
                      cardId: selectedFeynmanCardId,
                      confidence: feynmanRating,
                      wasCorrect: true,
                      reviewType: 'feynman',
                      sessionId: sessionId,
                    })
                    toastSuccess('Feynman explanation submitted!')
                    setFeynmanCompleted(true)
                    setShowFeynman(false)
                    setIsSessionFinished(true)
                    await endSessionFunc(`Completed Daily Pulse session with Feynman Teach-Back on card ${selectedFeynmanCardId}`)
                  } catch (err) {
                    console.error(err)
                    toastError('Failed to submit Feynman review.')
                  } finally {
                    setSubmittingFeynman(false)
                  }
                }}
                disabled={submittingFeynman}
                className="flex-1 bg-[#0D9488] text-white hover:bg-[#14B8A6] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                {submittingFeynman ? (
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">school</span>
                )}
                Submit Teach-Back & Complete Session
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  setFeynmanCompleted(true)
                  setShowFeynman(false)
                  setIsSessionFinished(true)
                  await endSessionFunc('Skipped Feynman Teach-Back')
                }}
                className="border-border-default text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              >
                Skip Teach-Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Final summary completion card
  if (isSessionFinished) {
    const accuracy = sessionCardsCount > 0 ? Math.round((correctCount / sessionCardsCount) * 100) : 0
    return (
      <div className="min-h-screen bg-[#060A09] text-text-primary flex items-center justify-center font-body p-4 md:p-6">
        <div className="w-full max-w-2xl rounded-2xl border border-[#6BD8CB]/20 bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-center space-y-6">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#134E4A]/30 border border-[#2DD4BF]/30 shadow-glow mb-2">
            <PartyPopperIcon className="size-7 text-[#6BD8CB] animate-bounce" />
          </div>

          <div>
            <h1 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
              Pulse Reviews Completed!
            </h1>
            <p className="text-xs text-[#9BBFBB] uppercase tracking-widest font-mono mt-1.5">
              Memory Consolidated
            </p>
          </div>

          {sessionCardsCount > 0 ? (
            <div className="grid grid-cols-3 gap-4 border-y border-border-default/40 py-5 my-2">
              <div>
                <p className="font-mono text-2xl font-bold text-[#6BD8CB]">{sessionCardsCount}</p>
                <p className="text-[10px] uppercase font-mono text-text-secondary mt-1">Cards Reviewed</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-emerald-400">{correctCount}</p>
                <p className="text-[10px] uppercase font-mono text-text-secondary mt-1">Recalled Correct</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-amber-400">{accuracy}%</p>
                <p className="text-[10px] uppercase font-mono text-text-secondary mt-1">Recall Accuracy</p>
              </div>
            </div>
          ) : (
            <div className="py-4 text-sm text-text-secondary">
              You had zero pending reviews in today's Pulse queue.
            </div>
          )}

          <div className="rounded-xl border border-border-subtle bg-[#121C1A]/40 p-4 text-xs text-text-secondary text-left leading-relaxed">
            🧠 <strong>Neuroscience Fact:</strong> Completing your interleaved study queue on-schedule drives memory traces from the hippocampal buffer to permanent neocortex storage.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => router.push('/pulse')}
              className="flex-1 bg-[#0D9488] text-white hover:bg-[#14B8A6] font-bold"
            >
              Return to Pulse
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex-1 border-border-default text-text-primary hover:bg-[#1F312D] text-xs font-bold"
            >
              Go to Workspace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Overload Protection Alert at 10 card intervals
  if (showBackpressureWarning && !ignoreBackpressure) {
    return (
      <div className="min-h-screen bg-[#060A09] text-text-primary flex items-center justify-center font-body p-4 md:p-6">
        <div className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.85)] text-center space-y-6">
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-[#3A2A0A] border border-amber-500/30 text-amber-400 animate-pulse">
            <ShieldAlert className="size-6" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Cognitive Fatigue Protection
            </h2>
            <p className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Memory Ingestion Backpressure Alert
            </p>
          </div>

          <div className="text-sm text-text-secondary leading-relaxed space-y-3 text-left bg-surface-void/40 border border-border-subtle p-4 rounded-xl">
            <p>
              You have completed <strong>{sessionCardsCount} reviews</strong> without a wakeful rest interval.
            </p>
            <p>
              Neuroscience studies show that learning more than 10-15 card slots sequentially without closing your eyes for 2 minutes to trigger wakeful consolidation reduces long-term retention by ~30%.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => {
                endSessionFunc('Stopped at backpressure limit')
                router.push('/pulse')
              }}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold border border-amber-600/30"
            >
              Consolidate & Go to Pulse
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIgnoreBackpressure(true)
                setShowBackpressureWarning(false)
                if (currentIndex + 1 >= cards.length) {
                  if (!feynmanCompleted) {
                    setShowFeynman(true)
                  } else {
                    setIsSessionFinished(true)
                    endSessionFunc()
                  }
                } else {
                  next()
                }
              }}
              className="flex-1 border-border-default text-text-primary hover:bg-[#1F312D] text-xs"
            >
              Continue Queue (Not Recommended)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const card = cards[currentIndex] as PulseQueueItem

  return (
    <div className="min-h-screen bg-[#060A09] text-text-primary font-body px-4 py-8 md:py-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Circadian Bedtime Alert */}
        {sleepWarning && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-4 text-xs text-rose-400 flex items-center gap-3 animate-pulse">
            <BedDouble className="size-5 text-rose-400 flex-shrink-0" />
            <span>
              <strong>Circadian Guard Alert:</strong> Studying within 2 hours of bedtime or during sleep hours. Cognitive performance and synaptic trace consolidation may be severely impaired.
            </span>
          </div>
        )}
        
        {/* Top Info Bar */}
        <div className="flex items-center justify-between border-b border-border-default/40 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                endSessionFunc('User exited page voluntarily')
                router.back()
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-border-default bg-surface-overlay/50 text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
              title="Go back"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl md:text-2xl font-extrabold text-text-primary flex items-center gap-2">
                  <BrainCircuit className="size-5 text-primary animate-pulse" />
                  Interleaved Pulse Session
                </h1>
                {modeParam === 'exam' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/40 text-rose-400 text-[10px] font-mono font-bold uppercase animate-pulse">
                    <span className="material-symbols-outlined text-xs">shield_alert</span>
                    🚨 Exam Mode
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#9BBFBB] font-mono">
                Active daily FSRS recalibration session.
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-border-default bg-[#0B1210] text-primary font-bold">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-border-subtle bg-surface-base mt-2 ${
              card.type === 'warmup' && 'text-primary' ||
              card.type === 'due' && 'text-teal-400' ||
              card.type === 'weak' && 'text-amber-400' ||
              'text-indigo-400'
            }`}>
              Phase: {card.type}
            </span>
          </div>
        </div>

        {/* Workspace Context Header */}
        <div className="rounded-xl border border-border-subtle bg-surface-overlay/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono">
            <span className="text-text-tertiary">Subject:</span>
            <span className="text-text-primary font-bold">{card.subjectTitle}</span>
            <span className="text-text-tertiary">&bull; Node:</span>
            <span className="text-[#6BD8CB] font-bold">{card.nodeTitle}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="size-3 text-text-tertiary" />
            <span className="text-[10px] font-mono text-text-secondary uppercase">Today's Pulse</span>
          </div>
        </div>

        {/* Study Main Deck Panel */}
        <div className="rounded-3xl border border-border-brand/40 bg-[#0B1210] p-6 md:p-8 shadow-[0_12px_40px_rgba(20,184,166,0.12)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6BD8CB]/40 to-transparent" />

          {/* Exam Mode visual countdown gauge */}
          {modeParam === 'exam' && !showReveal && (
            <div className="space-y-1">
              <div className="w-full bg-[#060A09] rounded-full h-1.5 overflow-hidden border border-border-subtle">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    timeLeft > 15 ? "bg-[#6BD8CB]" : timeLeft > 5 ? "bg-amber-400" : "bg-rose-500 animate-pulse"
                  )}
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-text-tertiary">
                <span className="flex items-center gap-1"><Timer className="size-3" /> Cognitive Speed Check</span>
                <span className={cn("font-bold", timeLeft < 10 && "text-rose-400")}>{timeLeft}s remaining</span>
              </div>
            </div>
          )}

          <CardQuestionRenderer
            card={{ ...card, id: card.cardId }}
            showReveal={showReveal}
            answerText={answerText}
            setAnswerText={setAnswerText}
            setShowReveal={setShowReveal}
            onSubmitAnswer={submitAnswer}
            modeParam={modeParam}
            submitting={submitting}
            hasAttemptedRecall={false}
            setHasAttemptedRecall={() => {}}
          />
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-xs text-text-tertiary font-mono">
          <span>Pulse study runs independently of playlist context.</span>
          <span>Memorize Cognitive Engine v1.2</span>
        </div>
      </div>
    </div>
  )
}

export default function StudyPulsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060A09] text-text-primary flex items-center justify-center font-body p-6">
        <div className="text-center space-y-3 max-w-sm rounded-2xl border border-border-default bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mx-auto animate-pulse">
            <BrainCircuit className="size-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-text-primary">Loading Synaptic Queue</h3>
          <p className="text-xs text-text-secondary">Resolving daily study configs...</p>
        </div>
      </div>
    }>
      <StudyPulsePageContent />
    </Suspense>
  )
}
