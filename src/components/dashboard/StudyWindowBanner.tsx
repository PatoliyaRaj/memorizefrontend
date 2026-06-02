'use client';

import * as React from 'react';
import { getCircadianStatus, type CircadianStatus } from '@/services/sleep-service';
import { useAuthStore } from '@/stores/use-auth-store';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudyWindowBanner() {
  const user = useAuthStore((s) => s.user);
  const [status, setStatus] = React.useState<CircadianStatus | null>(null);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    getCircadianStatus()
      .then((res) => {
        if (!res.ok) {
          setStatus(res);
        }
      })
      .catch((e) => console.error(e));
  }, [user]);

  if (dismissed || !status) return null;

  return (
    <div className={cn(
      "w-full rounded-2xl border p-4 flex items-start gap-3 relative transition-all duration-300 animate-in fade-in slide-in-from-top-3",
      status.urgency === 'danger'
        ? "border-red-500/20 bg-red-500/5 text-red-400"
        : "border-amber-500/20 bg-amber-500/5 text-amber-400"
    )}>
      <div className="shrink-0 mt-0.5">
        {status.urgency === 'danger' ? (
          <ShieldAlert className="size-4 text-red-400" />
        ) : (
          <AlertTriangle className="size-4 text-amber-400" />
        )}
      </div>

      <div className="flex-1 pr-6">
        <h5 className="text-xs font-bold text-text-primary">
          {status.urgency === 'danger' ? '🚨 Rest Recommended Now' : '⚠️ Late-Night Study Window'}
        </h5>
        <p className="text-[11px] text-text-secondary leading-relaxed mt-0.5">
          {status.message}
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3.5 right-3.5 rounded-lg p-1 text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
        aria-label="Dismiss alert"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
