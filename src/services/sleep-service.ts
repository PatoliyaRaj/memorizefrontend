import { apiClient } from './api-client';

export type SleepLog = {
  id: string;
  userId: string;
  sleepDate: string;
  sleepTime: string;
  wakeTime: string;
  durationMin: number;
  quality: number;
  studyBeforeH: number;
  consolidationScore: number;
  notes: string | null;
  createdAt: string;
};

export type CircadianStatus = {
  ok: boolean;
  urgency: 'safe' | 'warning' | 'danger';
  message: string;
};

export async function logSleep(payload: {
  sleepDate: string;
  sleepTime: string;
  wakeTime: string;
  quality: number;
  notes?: string;
}) {
  const { data } = await apiClient.post('/api/sleep', payload);
  return data.data as SleepLog;
}

export async function getSleepLogs() {
  const { data } = await apiClient.get('/api/sleep');
  return data.data as SleepLog[];
}

export async function getCircadianStatus() {
  const { data } = await apiClient.get('/api/sleep/window');
  return data.data as CircadianStatus;
}

export type UserProfile = {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  dailyGoalMin: number;
  timezone: string;
  sleepTime: string;
  wakeTime: string;
  onboardingDone: boolean;
  academicLevel?: string | null;
  studyGoals?: string | null;
  occupation?: string | null;
};

export async function getUserProfile() {
  const { data } = await apiClient.get('/api/sleep/profile');
  return data.data as UserProfile | null;
}

export async function completeOnboarding(payload: {
  sleepTime: string;
  wakeTime: string;
  timezone: string;
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  dailyGoalMin?: number;
  academicLevel?: string;
  studyGoals?: string;
  occupation?: string;
}) {
  const { data } = await apiClient.post('/api/sleep/onboarding', payload);
  return data.data;
}
