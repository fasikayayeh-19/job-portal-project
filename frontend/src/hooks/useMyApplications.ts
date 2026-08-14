'use client';

import { useQuery } from '@tanstack/react-query';

import { getMyApplications } from '@/services/applications.service';

export function useMyApplications() {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: getMyApplications,
  });
}