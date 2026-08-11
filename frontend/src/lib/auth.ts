export type UserRole =
  | 'JOB_SEEKER'
  | 'COMPANY'
  | 'ADMIN';

export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  status?: string;
  company?: {
    id: string;
    companyName: string;
  };
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const user = localStorage.getItem('user');

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('accessToken');
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}