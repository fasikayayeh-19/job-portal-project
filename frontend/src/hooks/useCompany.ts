'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getMyCompany,
  updateMyCompany,
  getCompanies,
  getCompanyById,
  type UpdateCompanyData,
  type CompaniesResponse,
  type PublicCompanyDetails,
} from '@/services/company.service';
export function useCompanyById(id: string) {
  return useQuery<PublicCompanyDetails>({
    queryKey: ['company', id],
    queryFn: () => getCompanyById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompanyProfile() {
  return useQuery({
    queryKey: ['company-profile'],
    queryFn: getMyCompany,
  });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCompanyData) =>
      updateMyCompany(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['company-profile'],
      });
    },
  });
}


export function useCompanies(
  page: number,
  limit: number,
  search: string,
) {
  return useQuery<CompaniesResponse>({
    queryKey: [
      'companies',
      page,
      limit,
      search,
    ],

    queryFn: () =>
      getCompanies(
        page,
        limit,
        search,
      ),

    staleTime: 5 * 60 * 1000,
  });
}