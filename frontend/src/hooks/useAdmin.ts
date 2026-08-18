
import { useQuery } from "@tanstack/react-query";

import {
  getAdminDashboardStats,
  getAdminUsers,
} from "@/services/admin.service";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    staleTime: 5 * 60 * 1000,
  });
}