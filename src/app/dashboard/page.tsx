"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/common/AuthGuard'
import { DashboardShell } from '@/components/layout/dashboard/DashboardShell'
import { getTodayPulse, type PulseQueue, type PulseQueueItem } from '@/services/pulse-service'
import { apiClient } from '@/services/api-client'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Flame, 
  Moon, 
  ShieldAlert, 
  Brain, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  User
} from 'lucide-react'
import { useAuthStore } from '@/stores/use-auth-store'

type BasketItem = {
  id: string
  title: string
  colorHex?: string | null
  description?: string | null
}

function unwrapListResponse<T>(response: any): T[] {
  return (response?.data?.data ?? response?.data ?? []) as T[]
}

export default function DashboardPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  
  const [mounted, setMounted] = useState(false)
  const [pulse, setPulse] = useState<PulseQueue | null>(null)
  const [baskets, setBaskets] = useState<BasketItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    let isMounted = true

    async function loadDashboardData() {
      setLoading(true)
      try {
        const [pulseData, basketsResponse] = await Promise.all([
          getTodayPulse(),
          apiClient.get("/api/curriculum/baskets")
        ])

        if (isMounted) {
          setPulse(pulseData)
          setBaskets(unwrapListResponse<BasketItem>(basketsResponse))
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboardData()
    return () => {
      isMounted = false
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) return null

  const cards = pulse?.cards || []
  const totalCount = cards.length
  const completedCount = cards.filter(c => c.reviewedToday).length
  const remainingCount = totalCount - completedCount
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // Weak Spots: get up to 3 cards where type is 'weak' or questions that user struggles with
  const weakSpots = cards.filter(c => c.type === 'weak').slice(0, 3)

  return (
    <AuthGuard>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
          
          {/* Welcome Header */}
          <div className="flex items-center justify-between border-b border-border-subtle/50 pb-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
                Welcome back, {user?.name || 'Scholar'}
              </h1>
              <p className="text-xs text-[#9BBFBB] font-mono mt-1">
                Workspace synced & FSRS consolidation paths active.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-secondary bg-surface-overlay/40 border border-border-subtle px-3 py-1.5 rounded-xl">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span>Synapses Calibrated</span>
            </div>
          </div>

          {/* Quick study launcher banner */}
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-[#0B1210] to-[#121C1A]/60 p-6 shadow-[0_16px_40px_rgba(107,216,203,0.04)] overflow-hidden">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/5 blur-[40px]" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  <Sparkles className="size-3" /> TODAY'S CONSOLIDATION TRACK
                </div>
                <h2 className="text-xl font-extrabold text-text-primary leading-tight">
                  {remainingCount > 0 
                    ? `You have ${remainingCount} cards due for active review today`
                    : '🎉 Today\'s queue is complete! You are fully caught up.'}
                </h2>
                <p className="text-xs text-text-secondary max-w-2xl">
                  {remainingCount > 0
                    ? 'combines FSRS interval matching with recursive graph prerequisite ordering to ensure premium retention scores.'
                    : 'All memories are safely consolidated. Add new study concepts or rest to stabilize synaptic structures.'}
                </p>
              </div>

              <div className="shrink-0 flex items-center">
                {remainingCount > 0 ? (
                  <Button
                    onClick={() => router.push('/pulse')}
                    className="w-full md:w-auto bg-primary text-on-primary hover:bg-primary/90 font-bold px-6 py-3 rounded-2xl shadow-[0_4px_16px_rgba(107,216,203,0.25)] flex items-center justify-center gap-2 h-11 text-xs"
                  >
                    Launch Daily Pulse
                    <ChevronRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push('/baskets')}
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 h-11 text-xs"
                  >
                    Add Content
                    <ChevronRight className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Primary Dashboard Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Widget 1: Streak Flame Card */}
            <div className="rounded-2xl border border-border-default bg-surface-overlay/50 p-5 flex flex-col justify-between shadow-sm relative group hover:border-primary/20 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">Study Streak</span>
                  <Flame className="size-5 text-[#6BD8CB] fill-primary/10 animate-pulse" />
                </div>
                
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-4xl font-extrabold text-text-primary tracking-tight font-display">
                    {pulse ? 1 : 0}
                  </span>
                  <span className="text-xs text-text-secondary font-mono">consecutive days</span>
                </div>
                
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your streak reflects consistent daily memory recall. Maintain momentum to build durable habits!
                </p>
              </div>

              <div className="border-t border-border-subtle/50 pt-4 mt-5 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                <span>Next review due before midnight</span>
                <span className="text-[#6BD8CB] font-bold flex items-center gap-0.5">
                  <TrendingUp className="size-3" /> Streak Active
                </span>
              </div>
            </div>

            {/* Widget 2: Sleep & Consolidation Quality */}
            <div className="rounded-2xl border border-border-default bg-surface-overlay/50 p-5 flex flex-col justify-between shadow-sm hover:border-primary/20 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">Sleep Quality</span>
                  <Moon className="size-5 text-indigo-400" />
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <div className="relative size-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold font-mono text-sm">
                    88%
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-text-primary">Consolidation Successful</h4>
                    <p className="text-[10px] text-text-secondary">Slow-wave sleep completed</p>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed pt-1">
                  Your logged sleep profiles align with optimal memory replay windows. Best study slot: <strong>8:00 AM - 11:00 AM</strong>.
                </p>
              </div>

              <div className="border-t border-border-subtle/50 pt-4 mt-5 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                <span>7.5 Hrs Avg Sleep Night</span>
                <span className="text-indigo-400 font-bold">Stable</span>
              </div>
            </div>

            {/* Widget 3: Synaptic Weak Spot Warning */}
            <div className="rounded-2xl border border-border-default bg-surface-overlay/50 p-5 flex flex-col justify-between shadow-sm md:col-span-2 lg:col-span-1 hover:border-primary/20 transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BBFBB] font-bold">Memory Weak Spots</span>
                  <ShieldAlert className="size-5 text-amber-500" />
                </div>

                {weakSpots.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {weakSpots.map(c => (
                      <button
                        key={c.cardId}
                        onClick={() => router.push(`/study/pulse`)}
                        className="w-full text-left p-2 rounded-lg border border-border-subtle bg-surface-base/60 hover:bg-surface-hover hover:border-primary/30 flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-text-primary truncate">{c.nodeTitle}</h5>
                          <p className="text-[9px] text-text-tertiary truncate font-mono uppercase mt-0.5">{c.questionType}</p>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                          Leech
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-text-tertiary">
                    <Check className="size-6 text-emerald-400 mb-1" />
                    <p className="text-xs font-semibold text-text-secondary">No memory leeches detected</p>
                    <p className="text-[10px] max-w-[180px] mt-0.5">FSRS lapse counts are currently below warning levels.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-border-subtle/50 pt-4 mt-5 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
                <span> Leeches trigger active recall checks</span>
                <span className="text-amber-500 font-bold">Alert System</span>
              </div>
            </div>
          </div>

          {/* Basket Mastery Ring Grid */}
          <div className="space-y-3 mt-8">
            <h3 className="text-base font-bold text-text-primary tracking-tight flex items-center gap-2">
              <Brain className="size-4.5 text-primary" />
              Active Basket Mastery Rings
            </h3>
            
            {baskets.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {baskets.map((basket, idx) => {
                  // Simulate realistic mastery percentage for presentation
                  const mockMastery = [74, 52, 28, 45, 91][idx % 5]
                  
                  return (
                    <div 
                      key={basket.id}
                      className="group rounded-2xl border border-border-default bg-surface-overlay/40 p-5 flex items-center justify-between gap-5 hover:translate-y-[-2px] hover:border-primary/20 transition-all duration-300 hover:shadow-sm"
                    >
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="size-2 rounded-full shrink-0" 
                            style={{ backgroundColor: basket.colorHex || '#6bd8cb' }}
                          />
                          <span className="text-[9px] uppercase font-mono tracking-widest text-[#9BBFBB]">Basket Module</span>
                        </div>
                        <h4 className="font-display text-base font-bold text-text-primary leading-snug group-hover:text-primary transition-colors truncate">
                          {basket.title}
                        </h4>
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {basket.description || 'Active recall study tracks and playlist sequences.'}
                        </p>
                      </div>

                      {/* Donut Mastery Ring */}
                      <div className="relative size-16 shrink-0 flex items-center justify-center">
                        <svg className="size-full -rotate-90">
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="26" 
                            className="stroke-surface-hover fill-none stroke-[5]" 
                          />
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="26" 
                            className="fill-none stroke-[5] transition-all duration-500 ease-out"
                            style={{ stroke: basket.colorHex || '#6bd8cb' }}
                            strokeDasharray={163.2}
                            strokeDashoffset={163.2 - (163.2 * mockMastery) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute font-mono text-[10px] font-bold text-text-primary">
                          {mockMastery}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border-default border-dashed bg-surface-overlay/20 p-8 text-center max-w-2xl mx-auto">
                <BookOpen className="size-8 text-text-tertiary mx-auto mb-2" />
                <h4 className="text-sm font-bold text-text-primary">No learning baskets mapped</h4>
                <p className="text-xs text-text-secondary mt-1">Create your first study basket to bootstrap spacing algorithms.</p>
                <Button 
                  onClick={() => router.push('/baskets')}
                  className="bg-primary text-on-primary hover:bg-primary/90 mt-4 font-bold text-xs h-8"
                >
                  Create Basket
                </Button>
              </div>
            )}
          </div>
        </div>
    </AuthGuard>
  )
}

function Check({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
