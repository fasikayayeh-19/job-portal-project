import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getAdminDashboardStats,
  getAdminUsers,
  blockAdminUser,
  unblockAdminUser,
  deleteAdminUser,
  getAdminCompanies,
  approveCompany,
  rejectCompany,
  suspendCompany,
  activateCompany,
  deleteCompany,
  deleteAdminCompany,
  getAdminJobs,
  closeJob,
  deleteAdminJob,
  
} from "@/services/admin.service";

import type {
  AdminCompaniesResponse,
  AdminJobsResponse,
  AdminJobStatus,
} from "@/services/admin.service";

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
}

/* =========================================================
   ADMIN USERS
========================================================= */

interface UseAdminUsersParams {
  page?: number;
  limit?: number;
  role?: "ADMIN" | "COMPANY" | "JOB_SEEKER";
  status?: "ACTIVE" | "BLOCKED" | "PENDING";
}

export function useAdminUsers({
  page = 1,
  limit = 10,
  role,
  status,
}: UseAdminUsersParams = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "users",
      page,
      limit,
      role,
      status,
    ],

    queryFn: () =>
      getAdminUsers({
        page,
        limit,
        role,
        status,
      }),

    staleTime: 5 * 60 * 1000,
  });
}

export function useBlockAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

export function useUnblockAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

/* =========================================================
   ADMIN COMPANIES
========================================================= */

interface UseAdminCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?:
    | "PENDING"
    | "APPROVED"
    | "SUSPENDED"
    | "REJECTED";
}

export function useAdminCompanies({
  page = 1,
  limit = 10,
  search,
  status,
}: UseAdminCompaniesParams = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "companies",
      page,
      limit,
      search,
      status,
    ],

    queryFn: () =>
      getAdminCompanies({
        page,
        limit,
        search,
        status,
      }),

    staleTime: 5 * 60 * 1000,
  });
}

/* =========================================================
   APPROVE COMPANY
========================================================= */

export function useApproveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveCompany,

    onSuccess: (_data, companyId) => {
      queryClient.setQueriesData(
        { queryKey: ["admin", "companies"] },
        (oldData: AdminCompaniesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            data: oldData.data.map((company) =>
              company.id === companyId
                ? {
                    ...company,
                    status: "APPROVED" as const,
                  }
                : company
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["admin", "companies"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

/* =========================================================
   REJECT COMPANY
========================================================= */

export function useRejectCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectCompany,

    onSuccess: (_data, companyId) => {
      queryClient.setQueriesData(
        { queryKey: ["admin", "companies"] },
        (oldData: AdminCompaniesResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            data: oldData.data.map((company) =>
              company.id === companyId
                ? {
                    ...company,
                    status: "REJECTED" as const,
                  }
                : company
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["admin", "companies"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

/* =========================================================
   SUSPEND COMPANY
========================================================= */

export function useSuspendCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendCompany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "companies"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

/* =========================================================
   ACTIVATE COMPANY
========================================================= */

export function useActivateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateCompany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "companies"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

/* =========================================================
   DELETE COMPANY
========================================================= */

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCompany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "companies"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

/* =========================================================
   DELETE ADMIN COMPANY
========================================================= */

export function useDeleteAdminCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminCompany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "companies"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

/* =========================================================
   ADMIN JOBS
   IMPORTANT:
   ADMIN DOES NOT APPROVE OR REJECT JOBS.
   ========================================================= */

interface UseAdminJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminJobStatus;
}

export function useAdminJobs({
  page = 1,
  limit = 10,
  search,
  status,
}: UseAdminJobsParams = {}) {
  return useQuery<AdminJobsResponse>({
    queryKey: [
      "admin",
      "jobs",
      page,
      limit,
      search,
      status,
    ],

    queryFn: () =>
      getAdminJobs({
        page,
        limit,
        search,
        status,
      }),

    staleTime: 5 * 60 * 1000,
  });
}

/* =========================================================
   CLOSE JOB
========================================================= */

export function useCloseJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeJob,

    onSuccess: (_data, jobId) => {
      queryClient.setQueriesData(
        { queryKey: ["admin", "jobs"] },
        (oldData: AdminJobsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            data: oldData.data.map((job) =>
              job.id === jobId
                ? {
                    ...job,
                    status: "CLOSED" as const,
                  }
                : job
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["admin", "jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}

/* =========================================================
   DELETE JOB
   Only CLOSED jobs should be deleted.
========================================================= */

export function useDeleteAdminJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminJob,

    onSuccess: (_data, jobId) => {
      queryClient.setQueriesData(
        { queryKey: ["admin", "jobs"] },
        (oldData: AdminJobsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,

            data: oldData.data.filter(
              (job) => job.id !== jobId
            ),

            total: Math.max(
              0,
              oldData.total - 1
            ),

            totalPages: Math.max(
              1,
              Math.ceil(
                Math.max(
                  0,
                  oldData.total - 1
                ) / oldData.limit
              )
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["admin", "jobs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "dashboard"],
      });
    },
  });
}