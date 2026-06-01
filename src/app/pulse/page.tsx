"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard/DashboardShell'
import { getTodayPulse, forceRegeneratePulse, type PulseQueue, type PulseQueueItem } from '@/services/pulse-service'
import { Button } from '@/components/ui/button'
import { toastError, toastSuccess } from '@/lib/toast'
import { 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Play, 
  Flame, 
  Target, 
  Layers, 
  Compass, 
  ChevronRight, 
  AlertCircle,
  Trophy,
  Coffee,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default function PulsePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [pulse, setPulse] = useState<PulseQueue | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getTodayPulse()
      .then(data => {
        if (mounted) {
          setPulse(data)
        }
      })
      .catch(err => {
        console.error(err)
        toastError('Failed to retrieve today\'s Pulse queue.')
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      const data = await forceRegeneratePulse()
      setPulse(data)
      toastSuccess('Daily study queue successfully recalibrated.')
    } catch (err) {
      console.error(err)
      toastError('Failed to recalibrate daily study queue.')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-border-brand/40 bg-primary/10 text-primary animate-spin">
            <RotateCw className="size-6" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-display text-lg font-bold text-text-primary">Calibrating Daily Pulse</h3>
            <p className="text-xs text-text-secondary">Synthesizing FSRS weights & prerequisite maps...</p>
          </div>
        </div>
      </DashboardShell>
    )
  }

  const cards = pulse?.cards || []
  const totalCount = cards.length
  const completedCount = cards.filter(c => c.reviewedToday).length
  const remainingCount = totalCount - completedCount
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Group cards by block type
  const warmupCards = cards.filter(c => c.type === 'warmup')
  const coreCards = cards.filter(c => c.type === 'due')
  const weakCards = cards.filter(c => c.type === 'weak')
  const expansionCards = cards.filter(c => c.type === 'expansion')

  // Render catch-up state
  if (totalCount === 0) {
    return (
      <DashboardShell>
        <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_32px_rgba(52,211,153,0.15)] mb-6 animate-bounce">
            <Trophy className="size-9" />
          </div>
          <h2 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
            🎉 All Caught Up!
          </h2>
          <p className="text-xs text-[#9BBFBB] font-mono uppercase tracking-widest mt-1.5">
            Synaptic Structures Stabilized
          </p>
          <p className="text-sm text-text-secondary max-w-2xl mt-4 leading-relaxed">
            Your memory trace stability is in perfect equilibrium. You have zero due cards and zero outstanding weak spots scheduled for today.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4 w-full max-w-2xl mt-10">
            <Link 
              href="/baskets"
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border-default bg-surface-overlay/40 hover:bg-surface-hover hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <Plus className="size-5" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-text-primary">Add New Content</h4>
                <p className="text-xs text-text-secondary mt-1">Import PDFs or create cards to expand your map</p>
              </div>
            </Link>

            <button 
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border-default bg-surface-overlay/40 hover:bg-surface-hover hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="size-10 rounded-xl bg-[#0D9488]/15 text-[#6BD8CB] flex items-center justify-center group-hover:bg-[#0D9488]/35 transition-all">
                <RotateCw className={`size-5 ${regenerating ? 'animate-spin' : ''}`} />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-text-primary">Recalibrate Spacing</h4>
                <p className="text-xs text-text-secondary mt-1">Force rebuild today's spaced repetition queues</p>
              </div>
            </button>

            <div className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border-default bg-surface-overlay/40 hover:bg-surface-hover transition-all duration-300">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Coffee className="size-5" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-text-primary">Take a Break</h4>
                <p className="text-xs text-text-secondary mt-1">Allow sharp-wave ripples to consolidate memories</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        
        {/* Upper Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight flex items-center gap-2">
              <Sparkles className="size-6 text-primary animate-pulse" />
              Today's Synaptic Pulse
            </h1>
            <p className="text-xs text-[#9BBFBB] font-mono mt-1">
              Personalized daily study path built by FSRS spacing & prerequisite traversal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="border-border-default text-text-secondary hover:text-text-primary hover:bg-surface-hover font-mono text-xs gap-1.5 h-9"
            >
              <RotateCw className={`size-3.5 ${regenerating ? 'animate-spin' : ''}`} />
              Recalibrate Spacing
            </Button>
          </div>
        </div>

        {/* Highlight Session Launcher */}
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-[#0B1210] to-[#121C1A]/70 p-6 md:p-8 shadow-[0_16px_48px_rgba(107,216,203,0.06)] overflow-hidden">
          {/* Neon corner gradients */}
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/10 blur-[40px]" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-teal-500/10 blur-[40px]" />

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 relative">
            
            {/* Session Stats Circular Progress */}
            <div className="flex items-center gap-6">
              <div className="relative size-24 shrink-0 flex items-center justify-center">
                <svg className="size-full -rotate-90">
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    className="stroke-surface-hover fill-none stroke-[8]" 
                  />
                  <circle 
                    cx="48" 
                    cy="48" 
                    r="40" 
                    className="stroke-primary fill-none stroke-[8] transition-all duration-500 ease-out"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * percentComplete) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-xl font-bold text-text-primary leading-none">{percentComplete}%</span>
                  <span className="text-[8px] uppercase tracking-wider text-text-secondary font-mono mt-1">Done</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#9BBFBB] font-bold">Daily Study Session</span>
                  <span className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-mono font-bold">
                    <Flame className="size-3 fill-primary/30" /> FSRS Active
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-text-primary">
                  {remainingCount === 0 
                    ? 'Daily Study Queue Complete!' 
                    : `${remainingCount} Cards Outstanding`}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
                  {remainingCount === 0 
                    ? 'Excellent job! All synaptic weights have been successfully calibrated for today.'
                    : `Review your foundation prerequisite warmup, core 70/30 interleaved items, and expansion nodes in sequence.`}
                </p>
              </div>
            </div>

            {/* Launch Action */}
            <div className="flex flex-col justify-center shrink-0">
              {remainingCount > 0 ? (
                <Button
                  onClick={() => router.push('/study/pulse')}
                  className="bg-primary text-on-primary hover:bg-primary/90 font-bold px-8 py-3 rounded-2xl shadow-[0_4px_24px_rgba(107,216,203,0.3)] transition-all duration-300 hover:shadow-[0_4px_32px_rgba(107,216,203,0.45)] active:scale-[0.98] h-12 flex items-center gap-2 font-display text-sm"
                >
                  <Play className="size-4 fill-on-primary" />
                  {completedCount > 0 ? 'Resume Daily Session' : 'Start Today\'s Pulse'}
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    onClick={() => router.push('/baskets')}
                    className="bg-emerald-500 text-black hover:bg-emerald-600 font-bold px-6 py-2.5 rounded-xl h-10 text-xs"
                  >
                    Explore New Concepts
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Sequenced Blocks */}
        <div className="space-y-8 mt-6">
          
          {/* PHASE 1: WARMUP */}
          {warmupCards.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold font-mono text-xs">I</div>
                <h2 className="text-base font-bold text-text-primary tracking-tight">Phase 1: Foundation Prerequisite Warmup</h2>
                <span className="text-[10px] font-mono text-text-secondary bg-surface-base px-2 py-0.5 rounded border border-border-subtle">{warmupCards.length} cards</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {warmupCards.map(c => <QueueCard key={c.cardId} item={c} />)}
              </div>
            </div>
          )}

          {/* PHASE 2: CORE REVIEWS */}
          {coreCards.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold font-mono text-xs">II</div>
                <h2 className="text-base font-bold text-text-primary tracking-tight">Phase 2: Core 70/30 Interleaved Reviews</h2>
                <span className="text-[10px] font-mono text-text-secondary bg-surface-base px-2 py-0.5 rounded border border-border-subtle">{coreCards.length} cards</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coreCards.map(c => <QueueCard key={c.cardId} item={c} />)}
              </div>
            </div>
          )}

          {/* PHASE 3: REMEDIAL */}
          {weakCards.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-xs">III</div>
                <h2 className="text-base font-bold text-text-primary tracking-tight">Phase 3: Remedial Trouble Spots Focus</h2>
                <span className="text-[10px] font-mono text-text-secondary bg-surface-base px-2 py-0.5 rounded border border-border-subtle">{weakCards.length} cards</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {weakCards.map(c => <QueueCard key={c.cardId} item={c} />)}
              </div>
            </div>
          )}

          {/* PHASE 4: EXPANSION */}
          {expansionCards.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono text-xs">IV</div>
                <h2 className="text-base font-bold text-text-primary tracking-tight">Phase 4: Synaptic Concept Expansion</h2>
                <span className="text-[10px] font-mono text-text-secondary bg-surface-base px-2 py-0.5 rounded border border-border-subtle">{expansionCards.length} cards</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {expansionCards.map(c => <QueueCard key={c.cardId} item={c} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}

function QueueCard({ item }: { item: PulseQueueItem }) {
  return (
    <div className={`group rounded-2xl border ${item.reviewedToday ? 'border-emerald-500/15 bg-[#0B1210]/40' : 'border-border-default bg-surface-overlay/50'} p-4 flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px] hover:border-primary/30 transition-all duration-300 shadow-sm`}>
      <div className="space-y-2">
        {/* Context Badges */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary bg-surface-base/80 border border-border-subtle px-2 py-0.5 rounded truncate max-w-[80%]">
            📂 {item.subjectTitle} &bull; {item.nodeTitle}
          </span>
          {item.reviewedToday ? (
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400 fill-emerald-500/20" />
          ) : (
            <Play className="size-3.5 shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        {/* Card Question Cue */}
        <h4 className={`font-display text-sm font-bold leading-snug line-clamp-3 ${item.reviewedToday ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
          {item.question}
        </h4>
      </div>

      {/* Meta Indicators */}
      <div className="flex items-center justify-between border-t border-border-subtle/50 pt-2.5 mt-3">
        <span className="text-[9px] font-mono uppercase tracking-widest text-[#9BBFBB]">
          {item.questionType.replace('_', ' ')}
        </span>
        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
          item.type === 'warmup' && 'border-primary/20 bg-primary/10 text-primary' ||
          item.type === 'due' && 'border-teal-500/20 bg-teal-500/10 text-teal-400' ||
          item.type === 'weak' && 'border-amber-500/20 bg-amber-500/10 text-amber-400' ||
          'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
        }`}>
          {item.type}
        </span>
      </div>
    </div>
  )
}
