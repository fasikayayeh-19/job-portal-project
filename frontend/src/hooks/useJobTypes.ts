import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getJobTypes,
  createJobType,
  updateJobType,
  deleteJobType,
} from "@/services/job-type.service";

export function useJobTypes() {
  return useQuery({
    queryKey: ["admin", "job-types"],
    queryFn: getJobTypes,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateJobType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJobType,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "job-types"],
      });
    },
  });
}

export function useUpdateJobType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
    }: {
      id: string;
      name: string;
    }) =>
      updateJobType(id, {
        name,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "job-types"],
      });
    },
  });
}

export function useDeleteJobType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJobType,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "job-types"],
      });
    },
  });
}