'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getJobs,
  getMyJobs,
  createJob,
  updateJob,
  closeJob,
  getJob,
  deleteJob,
  type JobFilters,
  type UpdateJobData,
  type CreateJobData,
} from '@/services/jobs.service';

// =====================================================
// PUBLIC / JOB SEEKER - ALL JOBS
// =====================================================

export function useJobs(
  filters: JobFilters = {},
) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => getJobs(filters),
  });
}
export function useJob(id: string) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    enabled: Boolean(id),
  });
}


// =====================================================
// COMPANY - CREATE JOB
// =====================================================

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobData) =>
      createJob(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['company-dashboard'],
      });
    },
  });
}

// =====================================================
// COMPANY - MY JOBS
// =====================================================

export function useCompanyJobs() {
  return useQuery({
    queryKey: ['company-jobs'],
    queryFn: getMyJobs,
  });
}

// =====================================================
// COMPANY - UPDATE JOB
// =====================================================

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateJobData;
    }) => updateJob(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['company-dashboard'],
      });
    },
  });
}

// =====================================================
// COMPANY - CLOSE JOB
// =====================================================

export function useCloseJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      closeJob(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['company-dashboard'],
      });
    },
  });
}

// =====================================================
// COMPANY - DELETE JOB
// =====================================================

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteJob(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });

      queryClient.invalidateQueries({
        queryKey: ['company-dashboard'],
      });
    },
  });
}