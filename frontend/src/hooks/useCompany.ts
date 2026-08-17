'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getMyCompany,
  updateMyCompany,
  type UpdateCompanyData,
} from '@/services/company.service';

export function useCompanyProfile() {
  return useQuery({
    queryKey: ['company-profile'],
    queryFn: getMyCompany,
  });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: UpdateCompanyData,
    ) => updateMyCompany(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-profile'],
      });
    },
  });
}