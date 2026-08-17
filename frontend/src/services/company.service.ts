import api from '@/lib/axios';
import type { CompanyDashboardData } from '@/components/dashboard/CompanyDashboard';



export const getCompanyDashboard =
  async (): Promise<CompanyDashboardData> => {
    const response = await api.get(
      '/company-dashboard',
    );

    return response.data;
  };
  export interface CompanyProfile {
  id: string;
  companyName: string;
  description: string | null;
  website: string | null;
  logo: string | null;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    email: string;
  };
}

export interface UpdateCompanyData {
  companyName?: string;
  description?: string;
  website?: string;
  logo?: string;
  location?: string;
}
export async function getMyCompany(): Promise<CompanyProfile> {
  const response = await api.get<CompanyProfile>(
    '/companies/profile',
  );

  return response.data;
}

export async function updateMyCompany(
  data: UpdateCompanyData,
): Promise<CompanyProfile> {
  const response = await api.patch<CompanyProfile>(
    '/companies/profile',
    data,
  );

  return response.data;
}