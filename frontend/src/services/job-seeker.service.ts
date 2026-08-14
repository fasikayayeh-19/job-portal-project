import api from '@/lib/axios';

export interface JobSeekerDashboardData {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'JOB_SEEKER';
  };

  stats: {
    applications: number;
    savedJobs: number;
    interviews: number;
    profileComplete: number;
  };

}
  
export interface RecentApplication {
  id: string;
  status: string;
  createdAt: string;

  job: {
    id: string;
    title: string;

    company: {
      id: string;
      companyName: string;
    };
  };
}

export interface RecentSavedJob {
  id: string;
  createdAt: string;

  job: {
    id: string;
    title: string;

    company: {
      id: string;
      companyName: string;
    };
  };
}

export interface JobSeekerDashboardData {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'JOB_SEEKER';
  };

  stats: {
    applications: number;
    savedJobs: number;
    interviews: number;
    profileComplete: number;
  };

  recentApplications: RecentApplication[];
  recentSavedJobs: RecentSavedJob[];

}

export async function getJobSeekerDashboard() {
  const response = await api.get<JobSeekerDashboardData>(
    '/job-seeker/dashboard',
  );

  return response.data;
}