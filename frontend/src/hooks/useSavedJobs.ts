'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getSavedJobs,
  saveJob,
  removeSavedJob,
} from '@/services/saved-jobs.service';

export function useSavedJobs() {
  return useQuery({
    queryKey: ['saved-jobs'],
    queryFn: getSavedJobs,
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['saved-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['job-seeker-dashboard'],
      });
    },
  });
}

export function useRemoveSavedJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeSavedJob,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['saved-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['job-seeker-dashboard'],
      });
    },
  });
}