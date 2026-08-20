import api from "@/lib/axios";

export interface JobType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobTypeDto {
  name: string;
}

export interface UpdateJobTypeDto {
  name: string;
}

export async function getJobTypes(): Promise<JobType[]> {
  const response = await api.get<JobType[]>("/job-types");

  return response.data;
}

export async function createJobType(
  data: CreateJobTypeDto,
): Promise<JobType> {
  const response = await api.post<JobType>(
    "/job-types",
    data,
  );

  return response.data;
}

export async function updateJobType(
  id: string,
  data: UpdateJobTypeDto,
): Promise<JobType> {
  const response = await api.patch<JobType>(
    `/job-types/${id}`,
    data,
  );

  return response.data;
}

export async function deleteJobType(
  id: string,
): Promise<void> {
  await api.delete(`/job-types/${id}`);
}