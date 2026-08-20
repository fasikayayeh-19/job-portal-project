import api from '@/lib/axios';

// =====================================================
// JOB
// =====================================================

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  skills?: string[];
  location: string;
  jobType?: {
    id: string;
    name: string;
  };
  experience: string;
  salary?: string | null;
  deadline?: string | null;
  status: string;
  createdAt: string;

  company?: {
    id: string;
    companyName: string;
    logoUrl?: string;
    profileImageUrl?: string;
  };

  category?: {
    id: string;
    name: string;
  };
}

// =====================================================
// JOB FILTERS
// =====================================================

export interface JobFilters {
  page?: number;
  limit?: number;

  search?: string;
  location?: string;
  categoryId?: string;
  jobTypeId?: string;
  postedWithin?: string;
}

// =====================================================
// JOBS RESPONSE
// =====================================================

export interface JobsResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =====================================================
// CREATE JOB
// =====================================================

export interface CreateJobData {
  categoryId: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  location: string;
  jobType: string;
  experience: string;
  salary?: string;
  deadline?: string;
}

// =====================================================
// UPDATE JOB
// =====================================================

export interface UpdateJobData {
  title?: string;
  description?: string;
  requirements?: string;
  skills?: string[];
  location?: string;
  jobType?: string;
  experience?: string;
  salary?: string;
  deadline?: string;
  categoryId?: string;
}

// =====================================================
// GET ALL JOBS
// PUBLIC / JOB SEEKER
// =====================================================

export async function getJobs(
  filters: JobFilters = {},
): Promise<JobsResponse> {
  const response = await api.get<JobsResponse>(
    '/jobs',
    {
      params: {
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,

        ...(filters.search && {
          search: filters.search,
        }),

        ...(filters.location && {
          location: filters.location,
        }),

        ...(filters.categoryId && {
          categoryId: filters.categoryId,
        }),

        ...(filters.jobTypeId && {
          jobTypeId: filters.jobTypeId,
        }),

        ...(filters.postedWithin && {
          postedWithin: filters.postedWithin,
        }),
      },
    },
  );

  return response.data;
}

// =====================================================
// CREATE JOB
// =====================================================

export async function createJob(
  data: CreateJobData,
) {
  const response = await api.post(
    '/jobs',
    data,
  );

  return response.data;
}

// =====================================================
// COMPANY - MY JOBS
// =====================================================

export interface CompanyJob {
  id: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  location: string;
  jobType: string;
  experience: string;
  salary: string | null;
  status: string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;

  category?: {
    id: string;
    name: string;
  };

  applications?: {
    id: string;
  }[];
}

export async function getMyJobs(): Promise<
  CompanyJob[]
> {
  const response = await api.get<CompanyJob[]>(
    '/jobs/my-jobs',
  );

  return response.data;
}

// =====================================================
// UPDATE JOB
// =====================================================

export async function updateJob(
  id: string,
  data: UpdateJobData,
) {
  const response = await api.patch(
    `/jobs/${id}`,
    data,
  );

  return response.data;
}

// =====================================================
// CLOSE JOB
// =====================================================

export async function closeJob(
  id: string,
) {
  const response = await api.patch(
    `/jobs/${id}/close`,
  );

  return response.data;
}


export async function getJob(
  id: string,
): Promise<Job> {
  const response = await api.get<Job>(
    `/jobs/${id}`,
  );

  return response.data;
}

// =====================================================
// DELETE JOB
// =====================================================

export async function deleteJob(
  id: string,
) {
  const response = await api.delete(
    `/jobs/${id}`,
  );

  return response.data;
}