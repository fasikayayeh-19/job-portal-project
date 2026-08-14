import api from '@/lib/axios';

export interface CompanyDashboardStats {
  totalJobs: number;
  activeJobs: number;
  applications: number;
  shortlisted: number;
  hired: number;
}

export interface ApplicationStatusStats {
  pendingReview: number;
  onTest: number;
  interview: number;
  hired: number;
  declined: number;
}

export interface RecentApplication {
  id: string;
  status: string;
  createdAt: string;

  job: {
    id: string;
    title: string;
  };

  seeker: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profileImageUrl?: string;
  };
}

export interface RecentJob {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  applications: number;
}

export interface CompanyDashboard {
  company: {
    id: string;
    companyName: string;
  };

  stats: CompanyDashboardStats;

  applicationStatus: ApplicationStatusStats;

  recentApplications: RecentApplication[];

  recentJobs: RecentJob[];
}

export async function getCompanyDashboard(): Promise<CompanyDashboard> {
  const response = await api.get<CompanyDashboard>(
    '/company-dashboard',
  );

  return response.data;
}