'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getRetentionData,
  getHeatmapData,
  getWeakSpots,
  getSleepCorrelation,
  RetentionData,
  HeatmapPoint,
  WeakSpot,
  SleepCorrelationPoint,
} from '../services/stats-service';

export function useRetentionData() {
  return useQuery<RetentionData>({
    queryKey: ['stats', 'retention'],
    queryFn: getRetentionData,
  });
}

export function useHeatmapData() {
  return useQuery<HeatmapPoint[]>({
    queryKey: ['stats', 'heatmap'],
    queryFn: getHeatmapData,
  });
}

export function useWeakSpots() {
  return useQuery<WeakSpot[]>({
    queryKey: ['stats', 'weak-spots'],
    queryFn: getWeakSpots,
  });
}

export function useSleepCorrelation() {
  return useQuery<SleepCorrelationPoint[]>({
    queryKey: ['stats', 'sleep-correlation'],
    queryFn: getSleepCorrelation,
  });
}
