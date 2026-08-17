'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import JobSeekerProfile from '@/components/profile/JobSeekerProfile';
import CompanyProfile from '@/components/profile/CompanyProfile';

type UserRole = 'JOB_SEEKER' | 'COMPANY' | 'ADMIN';

interface User {
  id: string;
  email: string;
  role: UserRole;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      router.replace('/login');
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to read user:', error);
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'JOB_SEEKER':
      return <JobSeekerProfile />;

    case 'COMPANY':
      return <CompanyProfile />;

    case 'ADMIN':
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Admin Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Admin profile management.
          </p>
        </div>
      );

    default:
      router.replace('/dashboard');
      return null;
  }
}