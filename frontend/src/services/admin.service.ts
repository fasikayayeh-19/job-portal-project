import api from "@/lib/axios";


export interface AdminUser { id: string; firstName?: string; lastName?: string; email: string; role: "ADMIN" | "COMPANY" | "JOB_SEEKER"; createdAt: string; }
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

export async function getAdminUsers(): Promise<AdminUser[]> { const response = await api.get("/admin/users"); return response.data; }