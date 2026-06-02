'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSleepLogs,
  getCircadianStatus,
  logSleep,
  completeOnboarding,
  SleepLog,
  CircadianStatus,
} from '../services/sleep-service';

export function useSleepLogs() {
  return useQuery<SleepLog[]>({
    queryKey: ['sleepLogs'],
    queryFn: getSleepLogs,
  });
}

export function useCircadianStatus() {
  return useQuery<CircadianStatus>({
    queryKey: ['circadianStatus'],
    queryFn: getCircadianStatus,
    refetchInterval: 5 * 60 * 1000, // Refresh status every 5 minutes
  });
}

export function useLogSleepMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      sleepDate: string;
      sleepTime: string;
      wakeTime: string;
      quality: number;
      notes?: string;
    }) => logSleep(payload),
    onSuccess: () => {
      // Invalidate queries so that logs history list, radial score gauges, and statuses reload instantly!
      queryClient.invalidateQueries({ queryKey: ['sleepLogs'] });
      queryClient.invalidateQueries({ queryKey: ['circadianStatus'] });
    },
  });
}

export function useCompleteOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circadianStatus'] });
      queryClient.invalidateQueries({ queryKey: ['sleepLogs'] });
    },
  });
}
