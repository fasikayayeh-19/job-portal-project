'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layout/DashboardLayout';

import JobSeekerDashboard from '@/components/dashboard/JobSeekerDashboard';
import CompanyDashboard from '@/components/dashboard/CompanyDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

type UserRole =
  | 'JOB_SEEKER'
  | 'COMPANY'
  | 'ADMIN';

interface User {
  id: string;
  email: string;

  role: UserRole;

  firstName?: string;
  lastName?: string;

  company?: {
    companyName: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.replace('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;

      setUser(parsedUser);
    } catch (error) {
      console.error('Invalid user data:', error);

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');

      router.replace('/login');
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user}>

      {/* Job Seeker */}
      {user.role === 'JOB_SEEKER' && (
        <JobSeekerDashboard user={user} />
      )}

      {/* Company */}
      {user.role === 'COMPANY' && (
        <CompanyDashboard user={user} />
      )}

      {/* Admin */}
      {user.role === 'ADMIN' && (
        <AdminDashboard user={user} />
      )}

    </DashboardLayout>
  );
}