
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
  status: "PENDING" | "APPROVED" | "REJECTED";
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
  status?: "PENDING" | "APPROVED" | "REJECTED";
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