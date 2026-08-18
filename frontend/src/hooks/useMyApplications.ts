'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getMyApplications,
  createApplication,
  type CreateApplicationData,
} from '@/services/applications.service';

export function useMyApplications(
  enabled = true,
) {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: getMyApplications,
    enabled,
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateApplicationData,
    ) => createApplication(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['my-applications'],
      });
    },
  });
}