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

export async function completeOnboarding(payload: {
  sleepTime: string;
  wakeTime: string;
  timezone: string;
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  dailyGoalMin?: number;
}) {
  const { data } = await apiClient.post('/api/sleep/onboarding', payload);
  return data.data;
}
