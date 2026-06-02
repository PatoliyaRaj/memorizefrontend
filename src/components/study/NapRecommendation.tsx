'use client';

import * as React from 'react';
import { BedDouble, Moon, BellOff, X, Sparkles, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface NapRecommendationProps {
  cardsReviewed: number;
  durationMin: number;
  onClose?: () => void;
}

export function NapRecommendation({ cardsReviewed, durationMin, onClose }: NapRecommendationProps) {
  const [isSnoozed, setIsSnoozed] = React.useState(false);

  React.useEffect(() => {
    const snoozedVal = localStorage.getItem('snooze-nap');
    if (snoozedVal) {
      const snoozeTime = parseInt(snoozedVal, 10);
      // Snooze for 12 hours
      if (Date.now() - snoozeTime < 12 * 60 * 60 * 1000) {
        setIsSnoozed(true);
      }
    }
  }, []);

  const handleSnooze = () => {
    localStorage.setItem('snooze-nap', Date.now().toString());
    setIsSnoozed(true);
    toast.success('💤 Nap recommendation snoozed. Respecting your flow!');
    if (onClose) onClose();
  };

  if (isSnoozed) return null;

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-teal-500/20 bg-gradient-to-br from-[#0c1917]/90 to-[#070e0d]/95 p-6 shadow-[0_20px_50px_rgba(20,184,166,0.15)] backdrop-blur-md relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Glow decorative background */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-teal-500/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="flex items-start gap-4">
        {/* Animated SVG brainwave wave */}
        <div className="shrink-0 flex size-12 items-center justify-center rounded-xl bg-teal-950/60 border border-teal-500/30 text-primary shadow-[0_0_15px_rgba(107,216,203,0.1)] relative">
          <Moon className="size-5 text-[#6BD8CB] animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-black uppercase tracking-wider text-[#6BD8CB] flex items-center gap-1.5">
              <Sparkles className="size-3.5 animate-spin duration-1000" />
              Hippocampal Consolidation Booster
            </h3>
            <button
              onClick={handleSnooze}
              className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-md hover:bg-white/5"
              title="Snooze Recommendation"
            >
              <X className="size-4" />
            </button>
          </div>

          <h4 className="font-display text-base font-bold text-slate-200 mt-1 leading-tight">
            High Cognitive Load Detected
          </h4>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Reviewed <span className="text-[#6BD8CB] font-bold">{cardsReviewed} cards</span> in <span className="text-[#6BD8CB] font-bold">{Math.round(durationMin)} mins</span>
          </p>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            Your prefrontal cortex is experiencing high synaptic saturation. Taking a <strong>15–20 minute nap</strong> now triggers slow-wave NREM sleep. This enables sharp-wave ripples in the hippocampus to download short-term memory schemas into permanent neocortical storage, boosting retention by up to <strong>40%</strong>.
          </p>

          {/* Simple premium SVG wave gauge showing Alpha vs Delta brainwaves */}
          <div className="mt-4 p-3 rounded-xl border border-white/5 bg-black/40 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
              <span>Synaptic Saturation</span>
              <span className="text-teal-400">89% (Rest Recommended)</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full w-[89%] bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full" />
            </div>
            
            {/* Custom SVG Brainwave visualizer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] font-mono text-slate-500">Brainwave State: Active Beta</span>
              <div className="flex gap-0.5 items-end h-4">
                <div className="w-[2px] bg-[#6BD8CB] animate-[pulse_1s_infinite_100ms]" style={{ height: '30%' }} />
                <div className="w-[2px] bg-[#6BD8CB] animate-[pulse_1s_infinite_200ms]" style={{ height: '70%' }} />
                <div className="w-[2px] bg-[#6BD8CB] animate-[pulse_1s_infinite_300ms]" style={{ height: '90%' }} />
                <div className="w-[2px] bg-[#6BD8CB] animate-[pulse_1s_infinite_400ms]" style={{ height: '50%' }} />
                <div className="w-[2px] bg-[#6BD8CB] animate-[pulse_1s_infinite_500ms]" style={{ height: '20%' }} />
                <div className="w-[2px] bg-[#6BD8CB] animate-[pulse_1s_infinite_600ms]" style={{ height: '80%' }} />
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-4">
            <button
              onClick={() => {
                toast.success('💤 Time to rest. Initiating 20-min power down sequence!');
                if (onClose) onClose();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-teal-500 px-4 py-2.5 text-xs font-bold text-[#060A09] shadow-[0_0_12px_rgba(20,184,166,0.25)] hover:bg-[#6bd8cb] transition-all"
            >
              <BedDouble className="size-3.5" />
              Prepare for Nap (20 min)
            </button>
            <button
              onClick={handleSnooze}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/5 bg-[#0f172a]/60 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-[#1e293b] hover:text-slate-100 transition-all"
            >
              <BellOff className="size-3.5" />
              Snooze Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
