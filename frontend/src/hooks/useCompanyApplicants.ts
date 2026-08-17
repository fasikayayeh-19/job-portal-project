'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getCompanyApplicants,
  updateApplicationStatus,
  updateApplicationNote,
  ApplicationStatus,
} from '@/services/applications.service';

export function useCompanyApplicants() {
  return useQuery({
    queryKey: ['company-applicants'],
    queryFn: getCompanyApplicants,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) =>
      updateApplicationStatus(
        applicationId,
        status,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-applicants'],
      });

      queryClient.invalidateQueries({
        queryKey: ['company-dashboard'],
      });
    },
  });
}

export function useUpdateApplicationNote() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      note,
    }: {
      applicationId: string;
      note: string;
    }) =>
      updateApplicationNote(
        applicationId,
        note,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-applicants'],
      });
    },
  });
}