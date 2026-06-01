import { apiClient } from './api-client';

export interface PulseQueueItem {
  cardId: string;
  nodeId: string;
  nodeTitle: string;
  playlistId: string;
  playlistTitle: string;
  subjectId: string;
  subjectTitle: string;
  basketId: string;
  basketTitle: string;
  question: string;
  answer: string;
  explanation: string | null;
  questionType: 'free_recall' | 'cloze' | 'ordering' | 'matching' | 'multiple_choice';
  type: 'warmup' | 'due' | 'weak' | 'expansion';
  reviewedToday: boolean;
}

export interface PulseQueue {
  id: string;
  userId: string;
  queueDate: string;
  cards: PulseQueueItem[];
  completed: boolean;
  generatedAt: string;
}

export async function getTodayPulse(): Promise<PulseQueue> {
  const { data } = await apiClient.get('/api/pulse');
  return data as PulseQueue;
}

export async function forceRegeneratePulse(): Promise<PulseQueue> {
  const { data } = await apiClient.post('/api/pulse/regenerate');
  return data as PulseQueue;
}
