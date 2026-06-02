'use client';

import * as React from 'react';
import Link from 'next/link';
import { getSleepLogs, type SleepLog } from '@/services/sleep-service';
import { useAuthStore } from '@/stores/use-auth-store';
import { Moon, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SleepStatus() {
  const user = useAuthStore((s) => s.user);
  const [latestLog, setLatestLog] = React.useState<SleepLog | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    getSleepLogs()
      .then((logs) => {
        if (logs.length > 0) {
          setLatestLog(logs[0]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface-base/50 p-5 animate-pulse flex h-32 items-center justify-center">
        <span className="text-xs text-text-tertiary">Analyzing sleep metrics...</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-base/90 p-5 flex flex-col justify-between min-h-[9rem] hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1">
            <Moon className="size-3 text-primary" />
            Sleep Consolidation
          </span>
          <h4 className="text-sm font-bold text-text-primary">
            {latestLog ? 'Restorative Quality' : 'No Sleep Logged'}
          </h4>
        </div>
        
        {latestLog ? (
          <div className={cn(
            "text-xs font-extrabold px-2.5 py-1 rounded-full border",
            latestLog.consolidationScore >= 80 && "border-primary/20 bg-primary/10 text-primary",
            latestLog.consolidationScore < 80 && latestLog.consolidationScore >= 50 && "border-amber-500/20 bg-amber-500/10 text-amber-400",
            latestLog.consolidationScore < 50 && "border-red-500/20 bg-red-500/10 text-red-400"
          )}>
            {latestLog.consolidationScore}% score
          </div>
        ) : (
          <div className="rounded-full bg-surface-hover p-1 text-text-tertiary">
            <AlertCircle className="size-3.5" />
          </div>
        )}
      </div>

      <div className="mt-3.5">
        {latestLog ? (
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
            Last night's sleep was <strong>{latestLog.consolidationScore}% effective</strong> at locking in your concepts. 
            You slept for <strong>{Math.round(latestLog.durationMin / 60 * 10) / 10} hours</strong>.
          </p>
        ) : (
          <p className="text-xs text-text-secondary leading-relaxed">
            You haven't logged last night's sleep yet. Calculate your consolidation efficiency score to keep memory tracing accurate.
          </p>
        )}
      </div>

      <div className="mt-4 border-t border-border-subtle/50 pt-3 flex justify-between items-center shrink-0">
        <Link
          href="/sleep"
          className="text-[11px] font-bold text-text-tertiary hover:text-text-secondary transition-colors"
        >
          View sleep analytics ➔
        </Link>
        
        {!latestLog && (
          <Link
            href="/sleep"
            className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="size-3" />
            Log Sleep
          </Link>
        )}
      </div>
    </div>
  );
}
