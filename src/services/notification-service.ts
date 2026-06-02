import { apiClient } from './api-client';

export type NotificationItem = {
  id: string;
  userId: string;
  type: 'study_reminder' | 'sleep_alert' | 'mastery' | 'streak';
  title: string;
  body: string;
  read: boolean;
  sentAt: string;
};

export async function getNotifications() {
  const { data } = await apiClient.get('/api/notifications');
  return data.data as NotificationItem[];
}

export async function markAsRead(id: string) {
  const { data } = await apiClient.patch(`/api/notifications/${id}/read`);
  return data.data as NotificationItem;
}

export async function markAllAsRead() {
  const { data } = await apiClient.post('/api/notifications/read-all');
  return data.data as { count: number };
}

export async function triggerBedtimeNotifications() {
  const { data } = await apiClient.post('/api/notifications/trigger-bedtime');
  return data.data as { alertsCreated: number; alerts: NotificationItem[] };
}

export async function subscribePush(subscription: any) {
  const { data } = await apiClient.post('/api/notifications/subscribe', { subscription });
  return data.data;
}
