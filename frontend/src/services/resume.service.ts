import api from '@/lib/axios';

export interface ResumeResponse {
  message: string;
  resumeUrl: string;
  resumeFileName: string;
}

export async function uploadResume(
  file: File,
): Promise<ResumeResponse> {
  const formData = new FormData();

  formData.append('file', file);

  const response = await api.post<ResumeResponse>(
    '/users/resume',
    formData,
  );

  return response.data;
}

export async function deleteResume(): Promise<{
  message: string;
}> {
  const response = await api.delete(
    '/users/resume',
  );

  return response.data;
}