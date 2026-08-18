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

// =====================================================
// JOB SEEKER
// =====================================================

export async function getMyApplications(): Promise<MyApplication[]> {
  const response = await api.get<MyApplication[]>(
    '/applications/my-applications',
  );

  return response.data;
}

// =====================================================
// COMPANY - APPLICANTS
// =====================================================

// =====================================================
// COMPANY APPLICANTS
// =====================================================

export interface CompanyApplicant {
  id: string;
  coverLetter: string | null;
  companyNote: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;

  seeker: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    professionalTitle?: string;
    profileImageUrl?: string;
    resumeUrl?: string;
    resumeFileName?: string;
    skills?: string;
    experience?: string;
    education?: string;
    bio?: string;
  };

  job: {
    id: string;
    title: string;
    location?: string;
    jobType?: string;

    category?: {
      id: string;
      name: string;
    } | null;
  };
}

export async function getCompanyApplicants(): Promise<
  CompanyApplicant[]
> {
  const response = await api.get<CompanyApplicant[]>(
    '/applications/company',
  );

  return response.data;
}

// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

export type ApplicationStatus =
  | 'PENDING_REVIEW'
  | 'TEST'
  | 'INTERVIEW'
  | 'HIRED'
  | 'DECLINED';

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
) {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    {
      status,
    },
  );

  return response.data;
}

// =====================================================
// UPDATE PRIVATE COMPANY NOTE
// =====================================================

export async function updateApplicationNote(
  applicationId: string,
  note: string,
) {
  const response = await api.patch(
    `/applications/${applicationId}/note`,
    {
      note,
    },
  );

  return response.data;
}

// =====================================================
// JOB SEEKER - APPLY FOR JOB
// =====================================================

export interface CreateApplicationData {
  jobId: string;
  coverLetter?: string;
}



export async function createApplication(
  data: CreateApplicationData,
) {
  const response = await api.post(
    '/applications',
    data,
  );

  return response.data;
}



