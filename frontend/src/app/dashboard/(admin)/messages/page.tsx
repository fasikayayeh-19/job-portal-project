'use client';

import { useMemo, useState } from 'react';

import {
  Check,
  CheckCheck,
  Clock,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
} from 'lucide-react';

import {
  useAdminContactMessages,
  useDeleteContactMessage,
  useMarkContactMessageRead,
} from '@/hooks/useContact';

import type {
  AdminContactMessage,
} from '@/services/contact.service';

export default function AdminMessagesPage() {
  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAdminContactMessages();

  const markAsRead =
    useMarkContactMessageRead();

  const deleteMessage =
    useDeleteContactMessage();

  const [selectedMessage, setSelectedMessage] =
    useState<AdminContactMessage | null>(null);

  const [search, setSearch] =
    useState('');

  const [filter, setFilter] =
    useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  const filteredMessages = useMemo(() => {
    const value = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !value ||
        message.name.toLowerCase().includes(value) ||
        message.email.toLowerCase().includes(value) ||
        message.subject.toLowerCase().includes(value) ||
        message.message.toLowerCase().includes(value);

      const matchesFilter =
        filter === 'ALL' ||
        message.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [messages, search, filter]);

  const unreadCount = messages.filter(
    (message) => message.status === 'UNREAD',
  ).length;

  const handleSelectMessage = (
    message: AdminContactMessage,
  ) => {
    setSelectedMessage(message);

    if (message.status === 'UNREAD') {
      markAsRead.mutate(message.id);
    }
  };

  const handleDelete = async (
    id: string,
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this message?',
    );

    if (!confirmed) return;

    await deleteMessage.mutateAsync(id);

    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8 dark:bg-[#070d18] dark:text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                <MessageSquare className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Messages
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Messages received from users and visitors.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-cyan-300 hover:text-cyan-600 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-700 dark:hover:text-cyan-400"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching ? 'animate-spin' : ''
              }`}
            />

            Refresh
          </button>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total messages
              </span>

              <MessageSquare className="h-5 w-5 text-cyan-500" />
            </div>

            <p className="mt-2 text-3xl font-bold">
              {messages.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Unread
              </span>

              <Mail className="h-5 w-5 text-blue-500" />
            </div>

            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Read
              </span>

              <CheckCheck className="h-5 w-5 text-emerald-500" />
            </div>

            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {messages.length - unreadCount}
            </p>
          </div>
        </div>

        {/* =====================================================
            SEARCH + FILTER
        ===================================================== */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search messages..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-900"
            />
          </div>

          <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {(['ALL', 'UNREAD', 'READ'] as const).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === item
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>

            <div className="hidden min-h-[500px] animate-pulse rounded-2xl bg-slate-200 lg:block dark:bg-slate-800" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <p className="font-semibold text-red-600 dark:text-red-400">
              Failed to load messages.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <MessageSquare className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No messages found
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {messages.length === 0
                ? 'Messages submitted through the contact page will appear here.'
                : 'Try changing your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            {/* =================================================
                MESSAGE LIST
            ================================================= */}

            <div className="space-y-3">
              {filteredMessages.map((message) => {
                const isSelected =
                  selectedMessage?.id === message.id;

                const isUnread =
                  message.status === 'UNREAD';

                return (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() =>
                      handleSelectMessage(message)
                    }
                    className={`w-full rounded-2xl border p-5 text-left transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg shadow-cyan-500/10 dark:border-cyan-600 dark:bg-cyan-950/20'
                        : isUnread
                          ? 'border-cyan-200 bg-white shadow-sm dark:border-cyan-900 dark:bg-slate-900'
                          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                    } hover:-translate-y-0.5 hover:shadow-lg`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isUnread
                            ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <User className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-semibold">
                            {message.name}
                          </p>

                          {isUnread && (
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500" />
                          )}
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {message.email}
                        </p>

                        <p className="mt-3 truncate text-sm font-medium">
                          {message.subject}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {message.message}
                        </p>

                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="h-3.5 w-3.5" />

                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* =================================================
                MESSAGE DETAIL
            ================================================= */}

            <div className="hidden min-h-[550px] rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
              {!selectedMessage ? (
                <div className="flex h-full min-h-[550px] flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <Mail className="h-7 w-7" />
                  </div>

                  <h2 className="mt-5 text-xl font-bold">
                    Select a message
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Select a message from the list to view its
                    complete details.
                  </p>
                </div>
              ) : (
                <MessageDetails
                  message={selectedMessage}
                  onClose={() =>
                    setSelectedMessage(null)
                  }
                  onDelete={handleDelete}
                  onMarkRead={(id) =>
                    markAsRead.mutate(id)
                  }
                  deleting={deleteMessage.isPending}
                  markingRead={markAsRead.isPending}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MESSAGE DETAILS
========================================================= */

interface MessageDetailsProps {
  message: AdminContactMessage;
  onClose: () => void;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
  deleting: boolean;
  markingRead: boolean;
}

function MessageDetails({
  message,
  onClose,
  onDelete,
  onMarkRead,
  deleting,
  markingRead,
}: MessageDetailsProps) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="flex h-full flex-col">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-slate-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xl font-bold">
              {message.subject}
            </h2>

            {message.status === 'UNREAD' ? (
              <span className="shrink-0 rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400">
                Unread
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                Read
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {formatDate(message.createdAt)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* SENDER */}

      <div className="border-b border-slate-200 p-6 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <User className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold">
              {message.name}
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {message.email}
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGE */}

      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/60">
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
            {message.message}
          </p>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row dark:border-slate-800">
        {message.status === 'UNREAD' && (
          <button
            type="button"
            onClick={() => onMarkRead(message.id)}
            disabled={markingRead}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />

            {markingRead
              ? 'Marking...'
              : 'Mark as read'}
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(message.id)}
          disabled={deleting}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="h-4 w-4" />

          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}