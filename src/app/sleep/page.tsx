'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useSleepLogs, useCircadianStatus, useLogSleepMutation } from '@/hooks/use-sleep';
import { DashboardShell } from '@/components/layout/dashboard/DashboardShell';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Moon,
  Sun,
  Activity,
  History,
  Info,
  Calendar,
  Clock,
  Sparkles,
  Loader2,
  Trash,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SleepPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // TanStack Queries & Mutations
  const { data: logs = [], isLoading: loadingLogs } = useSleepLogs();
  const { data: circadianData } = useCircadianStatus();
  const logSleepMutation = useLogSleepMutation();
  
  // Log Form State
  const [sleepDate, setSleepDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [sleepTimeStr, setSleepTimeStr] = React.useState('22:30');
  const [wakeTimeStr, setWakeTimeStr] = React.useState('06:30');
  const [quality, setQuality] = React.useState(4);
  const [notes, setNotes] = React.useState('');

  const loading = loadingLogs;
  const circadianMsg = circadianData?.message || 'Loading circadian status...';
  const circadianUrgency = circadianData?.urgency || 'safe';
  const submitting = logSleepMutation.isPending;

  const latestLog = logs[0] || null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Construct date objects
      const sleepDateObj = new Date(sleepDate);
      
      const [sleepH, sleepM] = sleepTimeStr.split(':').map(Number);
      const sleepTimeObj = new Date(sleepDate);
      sleepTimeObj.setHours(sleepH, sleepM, 0, 0);
      
      const [wakeH, wakeM] = wakeTimeStr.split(':').map(Number);
      const wakeTimeObj = new Date(sleepDate);
      wakeTimeObj.setDate(wakeTimeObj.getDate() + 1); // Woke up next morning
      wakeTimeObj.setHours(wakeH, wakeM, 0, 0);
      
      await logSleepMutation.mutateAsync({
        sleepDate: sleepDateObj.toISOString(),
        sleepTime: sleepTimeObj.toISOString(),
        wakeTime: wakeTimeObj.toISOString(),
        quality,
        notes: notes || undefined,
      });
      
      toast.success('Sleep successfully logged! Score recalculated.');
      setNotes('');
    } catch (e) {
      console.error('[SleepPage] Submission failed:', e);
      toast.error('Failed to log sleep');
    }
  }

  const getQualityText = (q: number) => {
    switch (q) {
      case 1: return '🥱 Terrible (restless)';
      case 2: return '💤 Poor (fragmented)';
      case 3: return '😐 Fair (average)';
      case 4: return '🙂 Good (rested)';
      case 5: return '⚡ Optimal (deeply restored)';
      default: return 'Good';
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Zoned Header & Circadian Study Window alert */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
              Sleep & Memory Consolidation
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Analyze sleep architecture and sharp-wave ripple transfer optimization.
            </p>
          </div>
          
          <div className={cn(
            "flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-semibold max-w-2xl",
            circadianUrgency === 'danger' && "border-red-500/20 bg-red-500/5 text-red-400",
            circadianUrgency === 'warning' && "border-amber-500/20 bg-amber-500/5 text-amber-400",
            circadianUrgency === 'safe' && "border-primary/20 bg-primary/5 text-primary"
          )}>
            <Activity className="size-4 shrink-0" />
            <span className="leading-snug">{circadianMsg || "Loading circadian status..."}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin size-8 text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Circular Gauge & Logging Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Consolidation Score circular Gauge */}
              {latestLog && (
                <div className="rounded-2xl border border-border-subtle bg-surface-base/40 p-6 flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Circular SVG Gauge */}
                  <div className="relative size-32 shrink-0 flex items-center justify-center">
                    <svg className="size-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        className="stroke-surface-hover fill-none"
                        strokeWidth="10"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        className="stroke-primary fill-none transition-all duration-500 ease-out"
                        strokeWidth="10"
                        strokeDasharray={326.7}
                        strokeDashoffset={326.7 - (326.7 * latestLog.consolidationScore) / 100}
                        strokeLinecap="round"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(107, 216, 203, 0.4))'
                        }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
                        {latestLog.consolidationScore}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-text-tertiary font-bold">
                        Score
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary font-bold bg-primary/10 rounded-full px-2 py-0.5">
                      <Sparkles className="size-3" />
                      Latest Consolidation
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">
                      Restorative Sleep Rating
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Your memory consolidation was <strong>{latestLog.consolidationScore}% effective</strong> last night. 
                      You had a healthy study-to-sleep gap of <strong>{latestLog.studyBeforeH} hours</strong>, and got 
                      <strong> {Math.round(latestLog.durationMin / 60 * 10) / 10} hours</strong> of sleep.
                    </p>
                  </div>
                </div>
              )}

              {/* Logging Form Card */}
              <div className="rounded-2xl border border-border-subtle bg-surface-base/90 p-5 md:p-6 shadow-xl">
                <div className="flex items-center gap-2 border-b border-border-subtle pb-4 mb-4">
                  <Moon className="size-4 text-primary" />
                  <h2 className="text-sm font-bold text-text-primary">Log Last Night's Sleep</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Sleep Date */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="size-3 text-text-tertiary" />
                        Sleep Date
                      </label>
                      <input
                        type="date"
                        value={sleepDate}
                        onChange={(e) => setSleepDate(e.target.value)}
                        required
                        className="w-full bg-surface-hover border border-border-subtle focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-xs rounded-xl px-3 py-2.5 text-text-primary focus:outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Bedtime */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                        <Moon className="size-3 text-text-tertiary" />
                        Bedtime
                      </label>
                      <input
                        type="time"
                        value={sleepTimeStr}
                        onChange={(e) => setSleepTimeStr(e.target.value)}
                        required
                        className="w-full bg-surface-hover border border-border-subtle focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-xs rounded-xl px-3 py-2.5 text-text-primary focus:outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Wake Time */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                        <Sun className="size-3 text-text-tertiary" />
                        Wake Time
                      </label>
                      <input
                        type="time"
                        value={wakeTimeStr}
                        onChange={(e) => setWakeTimeStr(e.target.value)}
                        required
                        className="w-full bg-surface-hover border border-border-subtle focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-xs rounded-xl px-3 py-2.5 text-text-primary focus:outline-none transition-all duration-200"
                      />
                    </div>

                  </div>

                  {/* Sleep Quality slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      <span>Sleep Quality</span>
                      <span className="text-primary font-bold lowercase tracking-normal">
                        {getQualityText(quality)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-1 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                    />
                    <div className="flex justify-between text-[9px] font-semibold text-text-tertiary px-1">
                      <span>Terrible</span>
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Good</span>
                      <span>Optimal</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Notes (Dreams, awakenings, caffeine intake)</label>
                    <textarea
                      placeholder="e.g. Took caffeine at 6pm, woke up once, remembered dreams."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-surface-hover border border-border-subtle focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-xs rounded-xl px-3 py-2 text-text-primary focus:outline-none placeholder:text-text-tertiary/75 resize-none transition-all duration-200"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold rounded-xl py-2.5 transition-all shadow-[0_0_16px_rgba(107,216,203,0.15)] flex items-center justify-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin size-3.5" />
                        Logging Sleep...
                      </>
                    ) : (
                      <>
                        <Moon className="size-3.5" />
                        Calculate Consolidation Score
                      </>
                    )}
                  </Button>
                </form>
              </div>

            </div>

            {/* RIGHT COLUMN: Science Insights & Historical Timeline */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Restorative Science Insights card */}
              <div className="rounded-2xl border border-border-subtle bg-surface-base/30 p-5 space-y-3.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                  <Info className="size-4 text-primary" />
                  Consolidation Science
                </h3>
                <div className="space-y-3 text-xs leading-relaxed text-text-secondary">
                  <div className="bg-surface-hover/50 p-2.5 rounded-xl border border-border-subtle/50">
                    <p className="font-bold text-text-primary">NREM Stage 3 (Slow-Wave Sleep):</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      Your hippocampus replays today's studied concepts in sequential bursts. This transfers facts to the permanent neocortex.
                    </p>
                  </div>
                  <div className="bg-surface-hover/50 p-2.5 rounded-xl border border-border-subtle/50">
                    <p className="font-bold text-text-primary">The Spacing Gap rule:</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      Optimal consolidation requires a **3-5 hour gap** between your last study session and sleep onset. Late-night cramming within 2 hours of bedtime severely limits ripple replay.
                    </p>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                  <History className="size-4 text-text-secondary" />
                  Sleep Log History
                </h3>

                <div className="space-y-2.5 overflow-y-auto max-h-[22rem] pr-1" data-lenis-prevent>
                  {logs.length === 0 ? (
                    <div className="text-center p-8 border border-dashed border-border-subtle rounded-2xl text-xs text-text-tertiary">
                      No logged sleeps yet. Log your first sleep to track consolidation!
                    </div>
                  ) : (
                    logs.map((log) => {
                      const dateStr = new Date(log.sleepDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        timeZone: 'UTC' // sleep_date is UTC midnight
                      });
                      
                      return (
                        <div
                          key={log.id}
                          className="rounded-xl border border-border-subtle bg-surface-overlay/25 p-3 flex justify-between items-center gap-4 transition-all hover:bg-surface-hover/30"
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-text-primary">{dateStr}</span>
                              <span className="text-[9px] font-bold text-text-tertiary bg-surface-hover border border-border-subtle rounded-md px-1.5 py-0.5">
                                {Math.round(log.durationMin / 60 * 10) / 10}h slept
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
                              <span>Quality: {getQualityText(log.quality).split(' ')[0]}</span>
                              <span className="text-text-tertiary">•</span>
                              <span>Gap: {log.studyBeforeH}h before bed</span>
                            </div>
                            {log.notes && (
                              <p className="text-[10px] text-text-tertiary leading-relaxed truncate mt-1">
                                "{log.notes}"
                              </p>
                            )}
                          </div>
                          
                          {/* Circle badge for score */}
                          <div className={cn(
                            "size-10 rounded-full flex items-center justify-center shrink-0 font-display text-xs font-extrabold border shadow-sm",
                            log.consolidationScore >= 80 && "border-primary/20 bg-primary/10 text-primary",
                            log.consolidationScore < 80 && log.consolidationScore >= 50 && "border-amber-500/20 bg-amber-500/10 text-amber-400",
                            log.consolidationScore < 50 && "border-red-500/20 bg-red-500/10 text-red-400"
                          )}>
                            {log.consolidationScore}%
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardShell>
  );
}
