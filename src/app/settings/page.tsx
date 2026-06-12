'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useUserProfile, useCompleteOnboardingMutation } from '@/hooks/use-sleep';
import { useSubscribePushMutation } from '@/hooks/use-notifications';
import { DashboardShell } from '@/components/layout/dashboard/DashboardShell';
import AuthGuard from '@/components/common/AuthGuard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Settings,
  Globe,
  Moon,
  Clock,
  Sparkles,
  Loader2,
  Bell,
  Check,
  ShieldCheck,
  Smartphone,
  BookOpen,
  Brain,
  Sliders,
  Compass,
  GraduationCap,
  Code,
  Terminal,
  Briefcase,
  Rocket,
  TrendingUp,
  Award,
  FlaskConical,
  Presentation,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const OCCUPATIONS = [
  {
    id: 'school',
    label: 'School Student',
    description: 'K-12, high school, or board exams',
    icon: BookOpen,
    academicLevel: 'school',
    studyGoals: 'exams',
  },
  {
    id: 'student',
    label: 'College Student',
    description: 'Undergraduate, graduate, or JEE/NEET/UPSC',
    icon: GraduationCap,
    academicLevel: 'college',
    studyGoals: 'academic_growth',
  },
  {
    id: 'developer',
    label: 'Software Developer',
    description: 'Coding, software engineering, upskilling',
    icon: Code,
    academicLevel: 'graduate',
    studyGoals: 'professional_dev',
  },
  {
    id: 'senior_developer',
    label: 'Senior Tech / Lead',
    description: 'System design, architecture, leadership',
    icon: Terminal,
    academicLevel: 'graduate',
    studyGoals: 'advanced_tech',
  },
  {
    id: 'business_student',
    label: 'Business / Management',
    description: 'BBA, MBA, finance, or consulting studies',
    icon: Briefcase,
    academicLevel: 'college',
    studyGoals: 'business_management',
  },
  {
    id: 'entrepreneur',
    label: 'Entrepreneur / Founder',
    description: 'Startups, pitch decks, product management',
    icon: Rocket,
    academicLevel: 'professional',
    studyGoals: 'startup_launch',
  },
  {
    id: 'investor',
    label: 'Investor / Trader',
    description: 'Stock market, portfolio management, trading',
    icon: TrendingUp,
    academicLevel: 'professional',
    studyGoals: 'market_investing',
  },
  {
    id: 'executive',
    label: 'Executive / Lead',
    description: 'Strategic planning, CEO/CTO leadership',
    icon: Award,
    academicLevel: 'professional',
    studyGoals: 'executive_strategy',
  },
  {
    id: 'researcher',
    label: 'Researcher / Scholar',
    description: 'PhD, scientist, papers, deep analysis',
    icon: FlaskConical,
    academicLevel: 'post_graduate',
    studyGoals: 'academic_research',
  },
  {
    id: 'teacher',
    label: 'Teacher / Educator',
    description: 'Lesson planning, lecturing, pedagogy',
    icon: Presentation,
    academicLevel: 'graduate',
    studyGoals: 'education_delivery',
  },
  {
    id: 'doctor',
    label: 'Medical / Healthcare',
    description: 'MBBS, residency, clinical diagnosis, nursing',
    icon: Stethoscope,
    academicLevel: 'post_graduate',
    studyGoals: 'medical_licensing',
  },
  {
    id: 'professional',
    label: 'General Professional',
    description: 'Upskilling, career pivot, life-long learning',
    icon: Compass,
    academicLevel: 'professional',
    studyGoals: 'career_pivot',
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  
  // Settings profile query & mutation
  const { data: profile, isLoading: loadingProfile } = useUserProfile();
  const completeMutation = useCompleteOnboardingMutation();
  const subscribeMutation = useSubscribePushMutation();
  
  // Local form states
  const [timezone, setTimezone] = React.useState('UTC');
  const [sleepTime, setSleepTime] = React.useState('22:30');
  const [wakeTime, setWakeTime] = React.useState('06:30');
  const [learningStyle, setLearningStyle] = React.useState<'visual' | 'auditory' | 'reading' | 'kinesthetic'>('visual');
  const [dailyGoalMin, setDailyGoalMin] = React.useState(15);
  const [occupation, setOccupation] = React.useState('student');
  const [academicLevel, setAcademicLevel] = React.useState('college');
  const [studyGoals, setStudyGoals] = React.useState('academic_growth');
  
  // Push state
  const [pushSupported, setPushSupported] = React.useState(false);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission>('default');
  const [pushLoading, setPushLoading] = React.useState(false);
  
  // Synced state check
  React.useEffect(() => {
    if (profile) {
      setTimezone(profile.timezone || 'UTC');
      setSleepTime(profile.sleepTime || '22:30');
      setWakeTime(profile.wakeTime || '06:30');
      setLearningStyle(profile.learningStyle || 'visual');
      setDailyGoalMin(profile.dailyGoalMin || 15);
      setOccupation(profile.occupation || 'student');
      setAcademicLevel(profile.academicLevel || 'college');
      setStudyGoals(profile.studyGoals || 'academic_growth');
    }
  }, [profile]);
  
  React.useEffect(() => {
    const isSupported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
    setPushSupported(isSupported);
    
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);
  
  const submitting = completeMutation.isPending;
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await completeMutation.mutateAsync({
        sleepTime,
        wakeTime,
        timezone,
        learningStyle,
        dailyGoalMin,
        occupation,
        academicLevel,
        studyGoals,
      });
      toast.success('🎉 Settings saved successfully!');
    } catch (err) {
      console.error('[Settings] Failed to save settings:', err);
      toast.error('Failed to save settings. Please try again.');
    }
  }
  
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
  async function handleEnablePush() {
    if (!pushSupported) {
      toast.error('Web Push is not supported on this browser/device.');
      return;
    }
    
    try {
      setPushLoading(true);
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission !== 'granted') {
        toast.warning('Notifications permission denied. Enable it in browser settings to receive OS alerts.');
        return;
      }
      
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[Service Worker] Service Worker registered:', registration);
      
      // Await Service Worker activation if not already active to avoid race conditions
      if (!registration.active) {
        await new Promise<void>((resolve) => {
          const worker = registration.installing || registration.waiting;
          if (!worker) {
            resolve();
            return;
          }
          if (worker.state === 'activated') {
            resolve();
            return;
          }
          const stateChangeHandler = () => {
            if (worker.state === 'activated') {
              worker.removeEventListener('statechange', stateChangeHandler);
              resolve();
            }
          };
          worker.addEventListener('statechange', stateChangeHandler);
        });
      }
      
      // Read public key from env, fallback to default for dev testing if missing
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BM_q4uPz...';
      
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      };
      
      const subscription = await registration.pushManager.subscribe(subscribeOptions);
      console.log('[Push Manager] Subscribed successfully:', subscription);
      
      await subscribeMutation.mutateAsync(subscription.toJSON());
      toast.success('🎉 Web Push OS alerts are now enabled!');
    } catch (err) {
      console.error('[Settings Push] Enrollment failed:', err);
      toast.error('Failed to configure system alerts. Make sure SSL or localhost is active.');
    } finally {
      setPushLoading(false);
    }
  }

  return (
    <AuthGuard>
      <DashboardShell>
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
          {/* Header Row */}
          <div className="border-b border-border-subtle pb-5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              <Settings className="size-6 text-primary" />
              Settings
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Customize study settings, bedtime parameters, and system alerts.
            </p>
          </div>

          {loadingProfile ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin size-8 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Config Form */}
              <div className="md:col-span-2 space-y-6">
                <form onSubmit={handleSubmit} className="rounded-2xl border border-border-subtle bg-surface-base/90 p-5 md:p-6 shadow-xl space-y-5">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-4">
                    <Sliders className="size-4 text-primary" />
                    <h2 className="text-sm font-bold text-text-primary">Spaced Repetition & Circadian Parameters</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Timezone */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="size-3.5 text-text-tertiary" />
                        Zoned Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-surface-hover/70 px-4 py-3 text-sm text-text-primary focus:border-primary/50 focus:outline-none transition-colors"
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
                      <p className="text-[10px] text-text-tertiary">
                        Standardizes date shifts and circadian lockout computations.
                      </p>
                    </div>

                    {/* Bedtime & Wake Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                          <Moon className="size-3.5 text-text-tertiary" />
                          Target Bedtime
                        </label>
                        <input
                          type="time"
                          value={sleepTime}
                          onChange={(e) => setSleepTime(e.target.value)}
                          required
                          className="w-full rounded-xl border border-border-subtle bg-surface-hover/70 px-4 py-3 text-sm text-text-primary focus:border-primary/50 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="size-3.5 text-text-tertiary" />
                          Target Wake Time
                        </label>
                        <input
                          type="time"
                          value={wakeTime}
                          onChange={(e) => setWakeTime(e.target.value)}
                          required
                          className="w-full rounded-xl border border-border-subtle bg-surface-hover/70 px-4 py-3 text-sm text-text-primary focus:border-primary/50 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Learning Style & Daily Goal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                          <Brain className="size-3.5 text-text-tertiary" />
                          Learning Strategy
                        </label>
                        <select
                          value={learningStyle}
                          onChange={(e) => setLearningStyle(e.target.value as any)}
                          className="w-full rounded-xl border border-border-subtle bg-surface-hover/70 px-4 py-3 text-sm text-text-primary focus:border-primary/50 focus:outline-none transition-colors"
                        >
                          <option value="visual">Visual (Neural Map)</option>
                          <option value="reading">Reading (Theory elaboration)</option>
                          <option value="kinesthetic">Kinesthetic (Active Recall)</option>
                          <option value="auditory">Auditory (Teach-Back)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="size-3.5 text-text-tertiary" />
                          Daily Study Goal
                        </label>
                        <select
                          value={dailyGoalMin}
                          onChange={(e) => setDailyGoalMin(Number(e.target.value))}
                          className="w-full rounded-xl border border-border-subtle bg-surface-hover/70 px-4 py-3 text-sm text-text-primary focus:border-primary/50 focus:outline-none transition-colors"
                        >
                          <option value={10}>10 minutes</option>
                          <option value={15}>15 minutes (Standard)</option>
                          <option value={30}>30 minutes (Intense)</option>
                          <option value={45}>45 minutes (Extreme)</option>
                        </select>
                      </div>
                    </div>

                    {/* Occupation Selection */}
                    <div className="space-y-2 pt-4 border-t border-border-subtle/50">
                      <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="size-3.5 text-text-tertiary" />
                        Primary Occupation / Focus
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {OCCUPATIONS.map((occ) => {
                          const Icon = occ.icon;
                          const isSelected = occupation === occ.id;
                          return (
                            <button
                              key={occ.id}
                              type="button"
                              onClick={() => {
                                setOccupation(occ.id);
                                setAcademicLevel(occ.academicLevel);
                                setStudyGoals(occ.studyGoals);
                              }}
                              className={cn(
                                "flex items-start text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                                isSelected
                                  ? "bg-[#14B8A6]/10 border-[#14B8A6]/45 text-[#E8F5F3] shadow-[0_0_12px_rgba(107,216,203,0.1)]"
                                  : "bg-[#0B1210]/60 border-[#14B8A6]/10 text-[#9BBFBB] hover:border-[#14B8A6]/20 hover:bg-[#1F312D]/40"
                              )}
                            >
                              <div className={cn(
                                "p-2 rounded-lg mr-3 transition-colors",
                                isSelected
                                  ? "bg-[#14B8A6]/20 text-[#6bd8cb]"
                                  : "bg-[#121C1A] text-[#5C8A85] group-hover:text-[#9BBFBB]"
                              )}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xs font-bold truncate transition-colors group-hover:text-[#E8F5F3]">{occ.label}</h3>
                                <p className="text-[10px] text-[#5C8A85] mt-0.5 line-clamp-2 leading-relaxed">{occ.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-text-tertiary leading-relaxed mt-2">
                        💡 Selecting a profile focus customizes the AI card generation format and taxonomy difficulty (e.g., technical equations for developers, trade stop-losses for investors, clinical cases for medical study).
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/95 text-on-primary text-xs font-bold rounded-xl py-3 transition-all shadow-[0_0_16px_rgba(107,216,203,0.15)] flex items-center justify-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin size-4" />
                        Saving parameters...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Update Parameters
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Side Alerts and Notifications Card */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-border-subtle bg-surface-base/30 p-5 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                    <Bell className="size-4 text-primary" />
                    OS Alerts Status
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center bg-surface-hover/40 p-3 rounded-xl border border-border-subtle/50">
                      <span className="text-text-secondary font-medium">Push Notification API</span>
                      {pushSupported ? (
                        <span className="text-[10px] text-primary font-bold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="size-2.5" /> Supported
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                          Unsupported
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center bg-surface-hover/40 p-3 rounded-xl border border-border-subtle/50">
                      <span className="text-text-secondary font-medium">OS Permission</span>
                      <span className={cn(
                        "text-[10px] font-bold border px-2 py-0.5 rounded-full flex items-center gap-1",
                        notificationPermission === 'granted' && "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                        notificationPermission === 'denied' && "border-red-500/20 bg-red-500/10 text-red-400",
                        notificationPermission === 'default' && "border-amber-500/20 bg-amber-500/10 text-amber-400"
                      )}>
                        {notificationPermission === 'granted' && <Check className="size-2.5" />}
                        {notificationPermission === 'granted' ? 'Allowed' : notificationPermission === 'denied' ? 'Blocked' : 'Not Requested'}
                      </span>
                    </div>

                    <div className="p-3 bg-surface-hover/20 border border-border-subtle/30 rounded-xl space-y-2 leading-relaxed text-text-secondary text-[11px]">
                      <p>
                        Allows system notifications to trigger bedtime safe alerts and spaced repetition queues even if your browser is closed.
                      </p>
                    </div>

                    {notificationPermission !== 'granted' && pushSupported && (
                      <Button
                        type="button"
                        onClick={handleEnablePush}
                        disabled={pushLoading}
                        className="w-full bg-[#0D9488]/15 hover:bg-[#0D9488]/30 border border-[#0D9488]/30 text-primary text-xs font-bold rounded-xl py-2 flex items-center justify-center gap-1.5 transition-all"
                      >
                        {pushLoading ? (
                          <>
                            <Loader2 className="animate-spin size-3.5" />
                            Configuring Alerts...
                          </>
                        ) : (
                          <>
                            <Smartphone className="size-3.5" />
                            Configure System Alerts
                          </>
                        )}
                      </Button>
                    )}

                    {notificationPermission === 'granted' && (
                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-400 text-[11px] flex items-start gap-2">
                        <ShieldCheck className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                        <div>
                          <p className="font-bold">System Alerts Active</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            You are fully registered for OS background alerts. Timezone-aligned study checks are live.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
