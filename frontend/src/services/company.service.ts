import api from '@/lib/axios';

export interface CompanyDashboardData {
  company: {
    id: string;
    companyName: string;
  };

  stats: {
    totalJobs: number;
    activeJobs: number;
    applications: number;
    shortlisted: number;
    hired: number;
  };

  applicationStatus: {
    pendingReview: number;
    onTest: number;
    interview: number;
    hired: number;
    declined: number;
  };

  recentApplications: {
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
  }[];

  recentJobs: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    applications: number;
  }[];
}

export async function getCompanyDashboard(): Promise<CompanyDashboardData> {
  const response = await api.get<CompanyDashboardData>(
    '/company-dashboard',
  );

  return response.data;
}