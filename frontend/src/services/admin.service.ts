
import api from "@/lib/axios";
export interface AdminUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "ADMIN" | "COMPANY" | "JOB_SEEKER";
  status: "ACTIVE" | "BLOCKED" | "PENDING";
  createdAt: string;
}






export interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;


}

export interface AdminDashboardData {
  totalUsers: number;
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
  totalJobs: number;
  totalApplications: number;

  applicationStatus: {
    pendingReview: number;
    test: number;
    interview: number;
    hired: number;
    declined: number;
  };

  companyStatus: {
    pending: number;
    approved: number;
  };

  applicationsOverTime: {
    month: string;
    applications: number;
  }[];

  jobsByCategory: {
    category: string;
    jobs: number;
  }[];
}

export async function getAdminJobs(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "PENDING" | "APPROVED" | "PUBLISHED" | "CLOSED";
}): Promise<AdminJobsResponse> {
  const response = await api.get<AdminJobsResponse>(
    "/admin/jobs",
    {
      params,
    }
  );

  return response.data;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardData> {
  const response = await api.get("/admin/dashboard");

  return response.data;
}

export async function getAdminUsers(params: {
  page?: number;
  limit?: number;
  role?: "ADMIN" | "COMPANY" | "JOB_SEEKER";
  status?: "ACTIVE" | "BLOCKED" | "PENDING";
}): Promise<AdminUsersResponse> {
  const response = await api.get("/admin/users", {
    params,
  });

  return response.data;
}
export async function blockAdminUser(id: string) {
  const response = await api.patch(`/admin/users/${id}/block`);
  return response.data;
}

export async function unblockAdminUser(id: string) {
  const response = await api.patch(`/admin/users/${id}/unblock`);
  return response.data;
}
export async function deleteAdminUser(
  id: string,
) {
  const response = await api.delete(
    `/admin/users/${id}`,
  );

  return response.data;
}
export interface AdminCompany {
  id: string;
  companyName: string;
  website?: string | null;
  phone?: string | null;
  description?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" |"SUSPENDED";
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  jobs?: {
    id: string;
  }[];
}

export interface AdminCompaniesResponse {
  data: AdminCompany[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getAdminCompanies(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?:
    | "PENDING"
    | "APPROVED"
    | "SUSPENDED"
    | "REJECTED";
}): Promise<AdminCompaniesResponse> {
  const response = await api.get("/admin/companies", {
    params,
  });

  return response.data;
}
export async function approveCompany(companyId: string) {
  const response = await api.patch(
    `/admin/companies/${companyId}/approve`
  );

  return response.data;
}

export async function rejectCompany(companyId: string) {
  const response = await api.patch(
    `/admin/companies/${companyId}/reject`
  );

  return response.data;
}

export async function suspendCompany(companyId: string) {
  const response = await api.patch(
    `/admin/companies/${companyId}/suspend`
  );

  return response.data;
}

export async function activateCompany(companyId: string) {
  const response = await api.patch(
    `/admin/companies/${companyId}/activate`
  );

  return response.data;
}
export async function deleteCompany(companyId: string) {
  const response = await api.delete(
    `/admin/companies/${companyId}`,
  );

  return response.data;
}
export async function deleteAdminCompany(companyId: string) {
  const response = await api.delete(
    `/admin/companies/${companyId}`,
  );

  return response.data;
}

export type AdminJobStatus = "PUBLISHED" | "CLOSED";

export interface AdminJob {
  id: string;
  title: string;
  description: string;
  requirements?: string | null;
  location: string;
  jobType: string;
  experience: string;
  salary?: string | null;
  status: AdminJobStatus;
  deadline?: string | null;
  createdAt: string;

  company?: {
    id: string;
    companyName: string;
  };

  category?: {
    id: string;
    name: string;
  };
}

export interface AdminJobsResponse {
  data: AdminJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}



export async function approveJob(jobId: string) {
  const response = await api.patch(
    `/admin/jobs/${jobId}/approve`,
  );

  return response.data;
}

export async function rejectJob(jobId: string) {
  const response = await api.patch(
    `/admin/jobs/${jobId}/reject`,
  );

  return response.data;
}

export async function closeJob(jobId: string) {
  const response = await api.patch(
    `/admin/jobs/${jobId}/close`,
  );

  return response.data;
}

export async function deleteAdminJob(jobId: string) {
  const response = await api.delete(
    `/admin/jobs/${jobId}`,
  );

  return response.data;
}

