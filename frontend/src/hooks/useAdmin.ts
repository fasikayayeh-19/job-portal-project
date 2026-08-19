import { useQuery } from "@tanstack/react-query";

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
} from "@/services/admin.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
}

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
    queryKey: ["admin", "users", page, limit, role, status],

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
export function useAdminCompanies({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
} = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "companies",
      page,
      limit,
      status,
    ],
    queryFn: () =>
      getAdminCompanies({
        page,
        limit,
        status,
      }),
    staleTime: 5 * 60 * 1000,
  });
}
// Approve company
export function useApproveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyId: string) => {
      const response = await api.patch(
        `/admin/companies/${companyId}/approve`
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-companies"],
      });
    },
  });
}

// Reject company
export function useRejectCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyId: string) => {
      const response = await api.patch(
        `/admin/companies/${companyId}/reject`
      );

      return response.data;
    },
      onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-companies"],
      });
    },
  });
}

export function useSuspendCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) =>
      suspendCompany(companyId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "companies"],
      });
    },
  });
}

export function useActivateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) =>
      activateCompany(companyId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "companies"],
      });
    },
  });
}