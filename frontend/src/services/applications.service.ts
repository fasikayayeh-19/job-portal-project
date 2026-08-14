import api from '@/lib/axios';

export interface ApplicationCompany {
  id: string;
  companyName: string;
}

export interface ApplicationCategory {
  id: string;
  name: string;
}

export interface ApplicationJob {
  id: string;
  title: string;
  location: string;
  jobType: string;

  company: ApplicationCompany;

  category?: ApplicationCategory;
}

export interface MyApplication {
  id: string;
  coverLetter: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  job: ApplicationJob;
}

export async function getMyApplications(): Promise<MyApplication[]> {
  const response = await api.get<MyApplication[]>(
    '/applications/my-applications',
  );

  return response.data;
}