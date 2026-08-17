import api from '@/lib/axios';

// =====================================================
// SAVED JOB TYPES
// =====================================================

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
    description?: string;
    requirements?: string;
    skills?: string[];
    location: string;
    jobType: string;
    experience?: string;
    salary?: string | null;
    deadline?: string | null;
    status?: string;
    createdAt?: string;

    company: SavedJobCompany;

    category?: SavedJobCategory;
  };
}

// =====================================================
// GET MY SAVED JOBS
// GET /saved-jobs
// =====================================================

export async function getSavedJobs(): Promise<SavedJob[]> {
  const response = await api.get<SavedJob[]>(
    '/saved-jobs',
  );

  return response.data;
}

// =====================================================
// SAVE JOB
// POST /saved-jobs/:jobId
// =====================================================

export async function saveJob(
  jobId: string,
) {
  const response = await api.post(
    `/saved-jobs/${jobId}`,
  );

  return response.data;
}

// =====================================================
// REMOVE SAVED JOB
// DELETE /saved-jobs/:jobId
// =====================================================

export async function removeSavedJob(
  jobId: string,
) {
  const response = await api.delete(
    `/saved-jobs/${jobId}`,
  );

  return response.data;
}