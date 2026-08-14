import { useQuery } from '@tanstack/react-query';

import {
  getJobs,
} from '@/services/jobs.service';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs', 'recommended'],
    queryFn: () => getJobs(1, 4),
  });
}