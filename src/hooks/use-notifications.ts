'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  subscribePush,
  NotificationItem,
} from '../services/notification-service';

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 60 * 1000, // Background poll every 60 seconds (as standard fallback for SSE streams)
  });
}

export function useMarkAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: (updated) => {
      // Opt-in query cache update or invalidate to trigger refetch
      queryClient.setQueryData<NotificationItem[]>(['notifications'], (old) => {
        if (!old) return [];
        return old.map((n) => (n.id === updated.id ? updated : n));
      });
    },
  });
}

export function useMarkAllAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(['notifications'], (old) => {
        if (!old) return [];
        return old.map((n) => ({ ...n, read: true }));
      });
    },
  });
}

export function useSubscribePushMutation() {
  return useMutation({
    mutationFn: (subscription: any) => subscribePush(subscription),
  });
}
