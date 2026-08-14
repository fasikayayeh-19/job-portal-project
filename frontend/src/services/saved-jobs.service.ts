import api from '@/lib/axios';

export interface SavedJobCompany {
  id: string;
  companyName: string;
}

export interface SavedJobCategory {
  id: string;
  name: string;
}

export interface SavedJob {
  id: string;
  createdAt: string;

  job: {
    id: string;
    title: string;
    location: string;
    jobType: string;

    company: SavedJobCompany;

    category?: SavedJobCategory;
  };
}

export async function getSavedJobs(): Promise<SavedJob[]> {
  const response = await api.get<SavedJob[]>('/saved-jobs');

  return response.data;
}

export async function saveJob(jobId: string) {
  const response = await api.post(`/saved-jobs/${jobId}`);

  return response.data;
}

export async function removeSavedJob(jobId: string) {
  const response = await api.delete(`/saved-jobs/${jobId}`);

  return response.data;
}