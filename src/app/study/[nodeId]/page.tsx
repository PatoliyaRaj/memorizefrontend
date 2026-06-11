"use client"

import React, { useEffect, useState, useRef, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getCardsForNode, postReview, startStudySession, endStudySession, type Card } from '@/services/study-service'
import { useStudyStore } from '@/stores/use-study-store'
import CardsTab from '@/components/CardsTab'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { PartyPopperIcon, Timer, BedDouble } from 'lucide-react'
import StudyWindowBanner from '@/components/dashboard/StudyWindowBanner'
import { NapRecommendation } from '@/components/study/NapRecommendation'
import CardQuestionRenderer from '@/components/study/CardQuestionRenderer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { normalizeMarkdown } from '@/lib/markdown'

function StudyPageContent() {
  const params = useParams()
  const nodeId = params?.nodeId as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const modeParam = (searchParams.get('mode') as 'normal' | 'exam') === 'exam' ? 'exam' : 'normal'

  // Store management
  const { cards, currentIndex, setCards, next, reset, sessionId, setSession } = useStudyStore()

  // Local interaction states
  const [answerText, setAnswerText] = useState('')
  const [showReveal, setShowReveal] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasAttemptedRecall, setHasAttemptedRecall] = useState(false)

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
  const sessionStartTimeRef = useRef<number>(Date.now())

  // Start study session and fetch cards
  useEffect(() => {
    if (!nodeId) return
    let mounted = true
    setLoading(true)
    reset()
    setSleepWarning(false)
    sessionEndedRef.current = false

    // 1. Start the study session
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

    // 2. Fetch the node's cards
    getCardsForNode(nodeId)
      .then((c) => {
        if (mounted) {
          setCards(c)
          if (c.length > 0) {
            setSelectedFeynmanCardId(c[0].id)
          }
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
  }, [nodeId, setCards, reset, modeParam, setSession])

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
        cardId: card.id,
        confidence,
        wasCorrect,
        responseTimeMs,
        sessionId,
        reviewType: 'normal',
      })

      // Update session statistics
      setSessionCardsCount((prev) => prev + 1)
      if (wasCorrect) setCorrectCount((prev) => prev + 1)

      toastSuccess(wasCorrect ? 'Calibration updated.' : 'Response noted. Scheduled for recalculation.')
    } catch (e) {
      console.error(e)
      toastError('Failed to register review.')
    }

    setSubmitting(false)
    setShowReveal(false)
    setAnswerText('')
    setHasAttemptedRecall(false)

    // Backpressure check on completing 5 reviews
    const nextCount = sessionCardsCount + 1
    if (nextCount === 5 && !ignoreBackpressure) {
      setShowBackpressureWarning(true)
      return
    }

    // Progression index
    if (currentIndex + 1 >= cards.length) {
      if (!feynmanCompleted) {
        setShowFeynman(true)
      } else {
        setIsSessionFinished(true)
        endSessionFunc(`Completed study session of ${cards.length} cards.`)
      }
    } else {
      next()
    }
  }

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

  // Feynman Technique Module
  if (showFeynman) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#060A09] text-text-primary flex items-center justify-center font-body p-4 md:p-6">
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
                  <option key={c.id} value={c.id}>
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
                    await endSessionFunc(`Completed session with Feynman Teach-Back on card ${selectedFeynmanCardId}`)
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
      <div className="min-h-[calc(100vh-64px)] bg-[#060A09] text-text-primary flex items-center justify-center font-body p-4 md:p-6">
        <div className="w-full max-w-2xl rounded-2xl border border-[#6BD8CB]/20 bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-center space-y-6">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-[#134E4A]/30 border border-[#2DD4BF]/30 shadow-glow mb-2">
            <span className="material-symbols-outlined text-3xl text-[#6BD8CB] animate-bounce">
              <PartyPopperIcon className="size-6 text-[#6BD8CB]" />
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

          {(sessionCardsCount >= 15 || (Date.now() - sessionStartTimeRef.current) >= 20 * 60 * 1000) ? (
            <NapRecommendation cardsReviewed={sessionCardsCount} durationMin={(Date.now() - sessionStartTimeRef.current) / (1000 * 60)} />
          ) : (
            <div className="rounded-xl border border-border-subtle bg-[#121C1A]/40 p-4 text-xs text-text-secondary text-left leading-relaxed">
              🧠 <strong>Neuroscience Tip:</strong> FSRS algorithm has updated your memory stability variables. Re-access this node when scheduled to solidify long-term retention.
            </div>
          )}

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
                setFeynmanCompleted(false)
                setFeynmanText('')
                setHasAttemptedRecall(false)
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
              onClick={() => {
                endSessionFunc('Stopped at backpressure limit')
                router.back()
              }}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold border border-amber-600/30"
            >
              Consolidate & Go to Map
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
              Continue Anyway (Not Recommended)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const card = cards[currentIndex] as Card

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#060A09] text-text-primary font-body px-4 py-8 md:py-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Circadian Bedtime Alert */}
        <StudyWindowBanner />

        {/* Top Navigation / Info Header */}
        <div className="flex items-center justify-between border-b border-border-default/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6BD8CB]">psychology</span>
                Free Recall Session
              </h1>
              {modeParam === 'exam' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/40 text-rose-400 text-[10px] font-mono font-bold uppercase animate-pulse">
                  <span className="material-symbols-outlined text-xs">shield_alert</span>
                  🚨 Exam Mode
                </div>
              )}
            </div>
            <p className="text-xs text-[#9BBFBB] font-mono">
              Active memory testing solidifies neurological nodes.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-border-default bg-[#0B1210] text-[#6BD8CB] font-bold">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <div className="mt-2">
              <button onClick={() => setShowManage((s) => !s)} className="text-xs text-text-secondary hover:text-text-primary">Manage Cards</button>
            </div>
          </div>
        </div>

        {showManage && <div className="mb-4"><CardsTab nodeId={nodeId} /></div>}

        {/* Study Main Deck Panel */}
        <div className="rounded-2xl border border-border-brand/40 bg-[#0B1210] p-6 md:p-8 shadow-[0_12px_40px_rgba(20,184,166,0.12)] space-y-6 relative overflow-hidden">
          {/* Subtle brand glow on active deck */}
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
            card={card}
            showReveal={showReveal}
            answerText={answerText}
            setAnswerText={setAnswerText}
            setShowReveal={setShowReveal}
            onSubmitAnswer={submitAnswer}
            modeParam={modeParam}
            submitting={submitting}
            hasAttemptedRecall={hasAttemptedRecall}
            setHasAttemptedRecall={setHasAttemptedRecall}
          />
        </div>

        {/* Back and Utility Options */}
        <div className="flex justify-between items-center text-xs">
          <button
            onClick={() => {
              endSessionFunc('User exited page voluntarily')
              router.back()
            }}
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

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060A09] text-text-primary flex items-center justify-center font-body p-6">
        <div className="text-center space-y-3 max-w-sm rounded-2xl border border-border-default bg-[#0B1210] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
          <span className="material-symbols-outlined text-4xl text-[#6BD8CB] animate-spin">
            neurology
          </span>
          <h3 className="font-display text-lg font-bold text-text-primary">Loading Synaptic Pathway</h3>
          <p className="text-xs text-text-secondary">Resolving study session configurations...</p>
        </div>
      </div>
    }>
      <StudyPageContent />
    </Suspense>
  )
}
