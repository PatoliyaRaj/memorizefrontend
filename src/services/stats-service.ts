import { apiClient } from './api-client';

export type RetentionCurvePoint = {
  day: number;
  retention: number;
};

export type RetentionData = {
  averageStabilityDays: number;
  projectedRetention: RetentionCurvePoint[];
};

export type HeatmapPoint = {
  date: string;
  count: number;
};

export type WeakSpot = {
  cardId: string;
  question: string;
  nodeTitle: string;
  lapses: number;
  difficulty: number;
  reps: number;
};

export type SleepCorrelationPoint = {
  date: string;
  sleepScore: number;
  sleepDurationH: number;
  sleepQuality: number;
  recallAccuracy: number;
  reviewsCount: number;
};

export async function getRetentionData() {
  const { data } = await apiClient.get('/api/stats/retention');
  return data as RetentionData;
}

export async function getHeatmapData() {
  const { data } = await apiClient.get('/api/stats/heatmap');
  return data as HeatmapPoint[];
}

export async function getWeakSpots() {
  const { data } = await apiClient.get('/api/stats/weak-spots');
  return data as WeakSpot[];
}

export async function getSleepCorrelation() {
  const { data } = await apiClient.get('/api/stats/sleep-correlation');
  return data as SleepCorrelationPoint[];
}
