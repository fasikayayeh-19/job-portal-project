import api from '@/lib/axios';

/* =========================================================
   PUBLIC CONTACT MESSAGE
========================================================= */

export interface CreateContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  message: string;
  id: string;
}

export async function createContactMessage(
  data: CreateContactMessageData,
): Promise<ContactMessageResponse> {
  const response = await api.post<ContactMessageResponse>(
    '/contact',
    data,
  );

  return response.data;
}

/* =========================================================
   ADMIN CONTACT MESSAGE
========================================================= */

export type ContactMessageStatus = 'UNREAD' | 'READ';

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

/* GET ALL MESSAGES */

export async function getAdminContactMessages(): Promise<
  AdminContactMessage[]
> {
  const response = await api.get<AdminContactMessage[]>(
    '/contact/admin/messages',
  );

  return response.data;
}

/* GET ONE MESSAGE */

export async function getAdminContactMessage(
  id: string,
): Promise<AdminContactMessage> {
  const response = await api.get<AdminContactMessage>(
    `/contact/admin/messages/${id}`,
  );

  return response.data;
}

/* MARK AS READ */

export async function markContactMessageRead(
  id: string,
): Promise<AdminContactMessage> {
  const response = await api.patch<AdminContactMessage>(
    `/contact/admin/messages/${id}/read`,
  );

  return response.data;
}

/* DELETE */

export async function deleteContactMessage(
  id: string,
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `/contact/admin/messages/${id}`,
  );

  return response.data;
}

/* UNREAD COUNT */

export async function getContactUnreadCount(): Promise<number> {
  const response = await api.get<number>(
    '/contact/admin/messages/unread-count',
  );

  return response.data;
}