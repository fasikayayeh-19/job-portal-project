import { useQuery } from '@tanstack/react-query';

import {
  getJobSeekerDashboard,
} from '@/services/job-seeker.service';

export function useJobSeekerDashboard() {
  return useQuery({
    queryKey: ['job-seeker-dashboard'],
    queryFn: getJobSeekerDashboard,
  });
}