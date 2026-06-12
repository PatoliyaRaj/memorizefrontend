'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { useCompleteOnboardingMutation } from '@/hooks/use-sleep';
import { toast } from 'sonner';
import {
  Brain,
  Moon,
  Globe,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Loader2,
  BookOpen,
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
  Compass
} from 'lucide-react';

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
  const [occupation, setOccupation] = React.useState('student');
  const [academicLevel, setAcademicLevel] = React.useState('college');
  const [studyGoals, setStudyGoals] = React.useState('academic_growth');
  
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
    if (step < 4) {
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
        occupation,
        academicLevel,
        studyGoals,
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
    <div className="min-h-screen bg-[#060A09] flex items-center justify-center p-4 relative overflow-hidden select-none font-display">
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="w-full max-w-2xl rounded-2xl border border-white/5 bg-[#0B1210]/95 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-md relative z-10">
        
        {/* Step Progress Indicator Bar */}
        <div className="w-full mb-8 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#9BBFBB]">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-[#121C1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-[#6bd8cb] transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Container */}
        <div className="min-h-[340px] flex flex-col justify-between">
          
          {/* STEP 1: Timezone */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-500/10 p-2 text-[#6bd8cb] border border-teal-500/20">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#E8F5F3]">Align Your Timezone</h2>
                  <p className="text-[11px] text-[#9BBFBB] mt-0.5">Auto-detection configures standardized logs</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9BBFBB]">Select Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#0B1210] px-4 py-3 text-sm text-[#E8F5F3] focus:border-[#6bd8cb]/50 focus:outline-none"
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
                <p className="text-[10px] text-[#5C8A85] mt-1 leading-relaxed">
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
                  <h2 className="text-base font-bold text-[#E8F5F3]">Bedtime Safe Window</h2>
                  <p className="text-[11px] text-[#9BBFBB] mt-0.5">Calibrating slow-wave NREM memory consolidation alerts</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#9BBFBB]">Target Bedtime</label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-[#0B1210] px-4 py-3 text-sm text-[#E8F5F3] focus:border-[#6bd8cb]/50 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#9BBFBB]">Target Wake Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-[#0B1210] px-4 py-3 text-sm text-[#E8F5F3] focus:border-[#6bd8cb]/50 focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[10px] text-[#5C8A85] leading-relaxed mt-2">
                🔒 Active recall studying is blocked within 60 minutes of bedtime to protect melatonin synthesis and slow-wave sharp-wave consolidation replays.
              </p>
            </div>
          )}

          {/* STEP 3: Occupation Selection */}
          {step === 3 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#6bd8cb]/10 p-2 text-[#6bd8cb] border border-[#6bd8cb]/20">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#E8F5F3]">What best describes you?</h2>
                  <p className="text-[11px] text-[#9BBFBB] mt-0.5">Select your primary occupation to personalize memory prompts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[240px] overflow-y-auto pr-1 mt-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
                      className={`flex items-start text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#14B8A6]/10 border-[#14B8A6]/45 text-[#E8F5F3] shadow-[0_0_12px_rgba(107,216,203,0.1)]'
                          : 'bg-[#0B1210]/60 border-[#14B8A6]/10 text-[#9BBFBB] hover:border-[#14B8A6]/20 hover:bg-[#1F312D]/40'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 transition-colors ${
                        isSelected
                          ? 'bg-[#14B8A6]/20 text-[#6bd8cb]'
                          : 'bg-[#121C1A] text-[#5C8A85] group-hover:text-[#9BBFBB]'
                      }`}>
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
            </div>
          )}

          {/* STEP 4: Spacing Focus & Learning Style */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 border border-amber-500/20">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#E8F5F3]">Study Strategy & Style</h2>
                  <p className="text-[11px] text-[#9BBFBB] mt-0.5">Optimize daily study queues</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#9BBFBB]">Daily Study Goal</label>
                  <select
                    value={dailyGoalMin}
                    onChange={(e) => setDailyGoalMin(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/5 bg-[#0B1210] px-4 py-3 text-sm text-[#E8F5F3] focus:border-[#6bd8cb]/50 focus:outline-none"
                  >
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes (Standard)</option>
                    <option value={30}>30 minutes (Intense)</option>
                    <option value={45}>45 minutes (Extreme)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#9BBFBB]">Preferred Mode</label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="w-full rounded-xl border border-white/5 bg-[#0B1210] px-4 py-3 text-sm text-[#E8F5F3] focus:border-[#6bd8cb]/50 focus:outline-none"
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
                type="button"
                onClick={handlePrev}
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-xl border border-[#14B8A6]/10 bg-[#0B1210]/60 px-4 py-2.5 text-xs font-bold text-[#9BBFBB] hover:bg-[#1F312D] hover:text-[#E8F5F3] transition-all disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : (
              <div /> // Spacer
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-on-primary shadow-[0_0_16px_rgba(107,216,203,0.15)] hover:bg-[#6bd8cb] hover:text-[#0b111e] transition-all"
              >
                Continue
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
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
