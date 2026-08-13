export type UserRole =
  | 'JOB_SEEKER'
  | 'COMPANY'
  | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;

  firstName?: string;
  lastName?: string;

  phone?: string;
  location?: string;
  professionalTitle?: string;
  bio?: string;

  profileImageUrl?: string;

  resumeUrl?: string;
  resumeFileName?: string;

  company?: {
    companyName: string;
  };
}