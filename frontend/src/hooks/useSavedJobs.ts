'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getSavedJobs,
  saveJob,
  removeSavedJob,
} from '@/services/saved-jobs.service';

// =====================================================
// GET SAVED JOBS
// =====================================================

export function useSavedJobs() {
  return useQuery({
    queryKey: ['saved-jobs'],
    queryFn: getSavedJobs,
  });
}

// =====================================================
// SAVE JOB
// =====================================================

export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) =>
      saveJob(jobId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['saved-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });
    },
  });
}

// =====================================================
// REMOVE SAVED JOB
// =====================================================

export function useRemoveSavedJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) =>
      removeSavedJob(jobId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['saved-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });
    },
  });
}