import api from '@/lib/axios';

export interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  status: string;
  createdAt: string;

  company: {
    id: string;
    companyName: string;
  };

  category?: {
    id: string;
    name: string;
  };
}

export interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getJobs(
  page = 1,
  limit = 4,
) {
  const response = await api.get<JobsResponse>('/jobs', {
    params: {
      page,
      limit,
    },
  });

  return response.data;
}