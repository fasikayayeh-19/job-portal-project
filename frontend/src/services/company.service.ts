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
  logoUrl: string | null;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    email: string;
  };
}

export interface PublicCompany {
  id: string;
  companyName: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  location: string | null;
  jobCount: number;
  createdAt: string;
}

export interface CompaniesResponse {
  data: PublicCompany[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateCompanyData {
  companyName?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  location?: string;
}

export interface CompanyJob {
  id: string;
  title: string;
  description: string;
  location: string;
  experience: string;
  salary: string | null;
  deadline: string | null;

  jobType: {
    id: string;
    name: string;
  } | null;

  category: {
    id: string;
    name: string;
  } | null;
}

export interface PublicCompanyDetails {
  id: string;
  companyName: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  location: string | null;
  jobCount: number;
  createdAt: string;
  jobs: CompanyJob[];
}

export interface PublicCompanyDetails {
  id: string;
  companyName: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  location: string | null;
  jobCount: number;
  createdAt: string;
  jobs: CompanyJob[];
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

export async function getCompanyById(
  id: string,
): Promise<PublicCompanyDetails> {
  const response =
    await api.get<PublicCompanyDetails>(
      `/companies/${id}`,
    );

  return response.data;
}

export async function getCompanies(
  page = 1,
  limit = 12,
  search = '',
): Promise<CompaniesResponse> {
  const response =
    await api.get<CompaniesResponse>(
      '/companies',
      {
        params: {
          page,
          limit,
          search: search || undefined,
        },
      },
    );

  return response.data;
}