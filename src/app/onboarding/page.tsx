'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useCompleteOnboardingMutation } from '@/hooks/use-sleep';
import { toast } from 'sonner';
import { Brain, Moon, Globe, Sparkles, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  
  // Onboarding states
  const [step, setStep] = React.useState(1);
  const [timezone, setTimezone] = React.useState('UTC');
  const [sleepTime, setSleepTime] = React.useState('22:30');
  const [wakeTime, setWakeTime] = React.useState('06:30');
  const [learningStyle, setLearningStyle] = React.useState<'visual' | 'auditory' | 'reading' | 'kinesthetic'>('visual');
  const [dailyGoalMin, setDailyGoalMin] = React.useState(15);
  
  const completeOnboardingMutation = useCompleteOnboardingMutation();
  const submitting = completeOnboardingMutation.isPending;

  // Auto-detect localized timezone on mount
  React.useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) setTimezone(detected);
    } catch (e) {
      console.warn('[Onboarding] Failed to auto-detect timezone, falling back to UTC.');
    }
  }, []);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const profile = await completeOnboardingMutation.mutateAsync({
        sleepTime,
        wakeTime,
        timezone,
        learningStyle,
        dailyGoalMin,
      });

      // Update auth store with onboarded user profile data
      if (user) {
        setUser({
          ...user,
          isOnboarded: true,
        });
      }

      toast.success('🎉 Welcome to NeuroLearn! Onboarding completed successfully.');
      router.push('/dashboard');
    } catch (e) {
      console.error('[Onboarding] Onboarding submission failed:', e);
      toast.error('Failed to save onboarding settings. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-void flex items-center justify-center p-4 relative overflow-hidden select-none font-display">
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="w-full max-w-2xl rounded-2xl border border-white/5 bg-[#0b111e]/90 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-md relative z-10">
        
        {/* Step Progress Indicator Bar (Polish Suggestion 1) */}
        <div className="w-full mb-8 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-[#6bd8cb] transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Container */}
        <div className="min-h-[260px] flex flex-col justify-between">
          
          {/* STEP 1: Timezone */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-500/10 p-2 text-[#6bd8cb] border border-teal-500/20">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-200">Align Your Timezone</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Auto-detection configures standardized logs</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#0f172a] px-4 py-3 text-sm text-slate-200 focus:border-[#6bd8cb]/50 focus:outline-none"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Chicago">America/Chicago (CST)</option>
                  <option value="America/Denver">America/Denver (MST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Europe/Paris">Europe/Paris (CET)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  💡 Autodetect matched: <span className="font-bold text-[#6bd8cb]">{timezone}</span>. This ensures sleep consolidation lockout alerts calculate accurately.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Sleep Schedule */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400 border border-indigo-500/20">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-200">Bedtime Safe Window</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Calibrating slow-wave NREM memory consolidation alerts</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Bedtime</label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-[#0f172a] px-4 py-3 text-sm text-slate-200 focus:border-[#6bd8cb]/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Wake Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-[#0f172a] px-4 py-3 text-sm text-slate-200 focus:border-[#6bd8cb]/50 focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-2">
                🔒 Active recall studying is blocked within 60 minutes of bedtime to protect melatonin synthesis and slow-wave sharp-wave consolidation replays.
              </p>
            </div>
          )}

          {/* STEP 3: Spacing Focus & Learning Style */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-200">Study Strategy & Style</h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">Optimize daily study queues</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Study Goal</label>
                  <select
                    value={dailyGoalMin}
                    onChange={(e) => setDailyGoalMin(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/5 bg-[#0f172a] px-4 py-3 text-sm text-slate-200 focus:border-[#6bd8cb]/50 focus:outline-none"
                  >
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes (Standard)</option>
                    <option value={30}>30 minutes (Intense)</option>
                    <option value={45}>45 minutes (Extreme)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Preferred Mode</label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="w-full rounded-xl border border-white/5 bg-[#0f172a] px-4 py-3 text-sm text-slate-200 focus:border-[#6bd8cb]/50 focus:outline-none"
                  >
                    <option value="visual">Visual (Neural Map)</option>
                    <option value="reading">Reading (Theory elaboration)</option>
                    <option value="kinesthetic">Kinesthetic (Active Recall)</option>
                    <option value="auditory">Auditory (Self Teach-Back)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action triggers */}
          <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-8">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-[#0f172a]/60 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-[#1e293b] hover:text-white transition-all disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : (
              <div /> // Spacer
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-on-primary shadow-[0_0_16px_rgba(107,216,203,0.15)] hover:bg-[#6bd8cb] hover:text-[#0b111e] transition-all"
              >
                Continue
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-xs font-black text-on-primary shadow-[0_0_16px_rgba(107,216,203,0.25)] hover:bg-[#6bd8cb] hover:text-[#0b111e] transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Initializing Brain...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    Enter Dashboard
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
