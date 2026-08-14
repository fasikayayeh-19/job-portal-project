'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getCompanyDashboard,
} from '@/services/company.service';

export function useCompanyDashboard() {
  return useQuery({
    queryKey: ['company-dashboard'],
    queryFn: getCompanyDashboard,
  });
}