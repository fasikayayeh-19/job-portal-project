
import api from '@/lib/axios';

export interface HomeStats {
  totalJobs: number;
  totalCompanies: number;
  totalCategories: number;
}

export interface HomeCategory {
  id: string;
  name: string;
  jobCount:number;
}

export interface HomeJob {
  id: string;
  title: string;
  location: string;
  salary?: string;
  experience: string;
  deadline?: string;
  createdAt: string;

  company?: {
    id: string;
    companyName: string;
  };

  category?: {
    id: string;
    name: string;
  };

  jobType?: {
    id: string;
    name: string;
  };
}

export interface HomeData {
  stats: HomeStats;
  categories: HomeCategory[];
  latestJobs: HomeJob[];
  trustedCompanies: TrustedCompany[];
}
export interface TrustedCompany {
  id: string;
  companyName: string;
  logoUrl: string;
  jobCount: number;
}

export async function getHomeData(): Promise<HomeData> {
  const response = await api.get<HomeData>('/home');

  return response.data;
}
