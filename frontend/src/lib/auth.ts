import api from '@/lib/axios';

export type UserRole =
  | 'JOB_SEEKER'
  | 'COMPANY'
  | 'ADMIN';

export interface AuthUser {
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

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUser =
    localStorage.getItem('user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export async function refreshCurrentUser(): Promise<AuthUser | null> {
  try {
    const response =
      await api.get('/users/profile');

    const user =
      response.data as AuthUser;

    localStorage.setItem(
      'user',
      JSON.stringify(user),
    );

    window.dispatchEvent(
      new Event('userUpdated'),
    );

    return user;
  } catch (error) {
    console.error(
      'Failed to refresh current user:',
      error,
    );

    return null;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(
    'accessToken',
  );
}

export function logout() {
  localStorage.removeItem(
    'accessToken',
  );

  localStorage.removeItem('user');
}