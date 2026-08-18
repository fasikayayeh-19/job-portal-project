import api from '@/lib/axios';

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getMyNotifications(): Promise<Notification[]> {
  const response = await api.get<Notification[]>(
    '/notifications/my-notifications',
  );

  return response.data;
}

export async function markNotificationAsRead(
  id: string,
): Promise<Notification> {
  const response = await api.patch<Notification>(
    `/notifications/${id}/read`,
  );

  return response.data;
}