'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createContactMessage,
  getAdminContactMessages,
  getAdminContactMessage,
  markContactMessageRead,
  deleteContactMessage,
  getContactUnreadCount,
  type CreateContactMessageData,
  type AdminContactMessage,
} from '@/services/contact.service';

/* =========================================================
   PUBLIC
========================================================= */

export function useCreateContactMessage() {
  return useMutation({
    mutationFn: (data: CreateContactMessageData) =>
      createContactMessage(data),
  });
}

/* =========================================================
   ADMIN - ALL MESSAGES
========================================================= */

export function useAdminContactMessages() {
  return useQuery<AdminContactMessage[]>({
    queryKey: ['admin-contact-messages'],
    queryFn: getAdminContactMessages,
    staleTime: 30 * 1000,
  });
}

/* =========================================================
   ADMIN - SINGLE MESSAGE
========================================================= */

export function useAdminContactMessage(id: string) {
  return useQuery<AdminContactMessage>({
    queryKey: ['admin-contact-message', id],
    queryFn: () => getAdminContactMessage(id),
    enabled: Boolean(id),
  });
}

/* =========================================================
   ADMIN - UNREAD COUNT
========================================================= */

export function useContactUnreadCount() {
  return useQuery<number>({
    queryKey: ['contact-unread-count'],
    queryFn: getContactUnreadCount,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

/* =========================================================
   ADMIN - MARK READ
========================================================= */

export function useMarkContactMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      markContactMessageRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-contact-messages'],
      });

      queryClient.invalidateQueries({
        queryKey: ['contact-unread-count'],
      });
    },
  });
}

/* =========================================================
   ADMIN - DELETE
========================================================= */

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteContactMessage(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-contact-messages'],
      });

      queryClient.invalidateQueries({
        queryKey: ['contact-unread-count'],
      });
    },
  });
}