'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import {
  useRetentionData,
  useHeatmapData,
  useWeakSpots,
  useSleepCorrelation,
} from '@/hooks/use-stats';
import { DashboardShell } from '@/components/layout/dashboard/DashboardShell';
import RetentionCurve from '@/components/analytics/RetentionCurve';
import StudyHeatmap from '@/components/analytics/StudyHeatmap';
import DeckMasteryBar from '@/components/analytics/DeckMasteryBar';
import SleepRetentionChart from '@/components/analytics/SleepRetentionChart';
import { Activity, Brain, Moon, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export default function StatsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // Fetch all statistics via TanStack Query Hooks
  const { data: retention, isLoading: loadingRetention, refetch: refetchRetention } = useRetentionData();
  const { data: heatmap = [], isLoading: loadingHeatmap, refetch: refetchHeatmap } = useHeatmapData();
  const { data: weakSpots = [], isLoading: loadingWeakSpots, refetch: refetchWeakSpots } = useWeakSpots();
  const { data: sleepCorrelations = [], isLoading: loadingCorrelations, refetch: refetchCorrelations } = useSleepCorrelation();

  const handleRefreshAll = () => {
    refetchRetention();
    refetchHeatmap();
    refetchWeakSpots();
    refetchCorrelations();
  };

  const isLoading = loadingRetention || loadingHeatmap || loadingWeakSpots || loadingCorrelations;

  // Overview stats aggregation
  const averageStability = retention?.averageStabilityDays || 0;
  const totalReviewsCount = heatmap.reduce((sum, item) => sum + item.count, 0);
  const averageSleepScore = sleepCorrelations.length > 0
    ? Math.round(sleepCorrelations.reduce((sum, item) => sum + item.sleepScore, 0) / sleepCorrelations.length)
    : 0;

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-6 select-none">
        {/* Zoned Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
              Cognitive Analytics Hub
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Visualize memory consolidation cycles, spacing curves, and sleep-retention correlations.
            </p>
          </div>
          <button
            onClick={handleRefreshAll}
            disabled={isLoading}
            className="self-start md:self-auto flex items-center gap-1.5 rounded-lg border border-white/5 bg-[#0f172a]/60 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-[#1e293b] hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Metrics
          </button>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Stability */}
          <div className="rounded-2xl border border-white/5 bg-[#0b111e]/90 p-4.5 shadow-md backdrop-blur-md flex items-center gap-4">
            <div className="rounded-xl bg-teal-500/10 p-2.5 text-[#6bd8cb] border border-teal-500/20">
              <Brain className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Average Stability</span>
              <span className="text-lg font-black text-slate-100 mt-0.5">
                {averageStability > 0 ? `${averageStability} days` : '0 days'}
              </span>
            </div>
          </div>

          {/* Card 2: Total Reviews */}
          <div className="rounded-2xl border border-white/5 bg-[#0b111e]/90 p-4.5 shadow-md backdrop-blur-md flex items-center gap-4">
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Recall Count</span>
              <span className="text-lg font-black text-slate-100 mt-0.5">{totalReviewsCount} reviews</span>
            </div>
          </div>

          {/* Card 3: Average Sleep Consolidation */}
          <div className="rounded-2xl border border-white/5 bg-[#0b111e]/90 p-4.5 shadow-md backdrop-blur-md flex items-center gap-4">
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400 border border-violet-500/20">
              <Moon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sleep Score Avg</span>
              <span className="text-lg font-black text-slate-100 mt-0.5">
                {averageSleepScore > 0 ? `${averageSleepScore}/100` : 'No logs'}
              </span>
            </div>
          </div>

          {/* Card 4: Active Leeches */}
          <div className="rounded-2xl border border-white/5 bg-[#0b111e]/90 p-4.5 shadow-md backdrop-blur-md flex items-center gap-4">
            <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-400 border border-rose-500/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Leeches</span>
              <span className="text-lg font-black text-slate-100 mt-0.5">{weakSpots.length} items</span>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-white/5 bg-[#0b111e]/40 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#6bd8cb]" />
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing Spacing Matrices...</span>
            </div>
          </div>
        )}

        {/* Chart Dashboards Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <RetentionCurve
                data={retention?.projectedRetention || []}
                averageStability={averageStability}
              />
              <StudyHeatmap data={heatmap} />
            </div>
            <div className="space-y-6">
              <DeckMasteryBar weakSpots={weakSpots} />
              <SleepRetentionChart data={sleepCorrelations} />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
