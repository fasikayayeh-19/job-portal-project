
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layout/DashboardLayout';

import JobSeekerDashboard from '@/components/dashboard/JobSeekerDashboard';
import CompanyDashboard from '@/components/dashboard/CompanyDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { url } from 'zod/v4/mini';

type JobSeekerUser = {
  id: string;
  email: string;
  role: 'JOB_SEEKER';
  firstName?: string;
  lastName?: string;
};

type CompanyUser = {
  id: string;
  email: string;
  role: 'COMPANY';
  firstName?: string;
  lastName?: string;
  company?: {
    companyName: string;
  };
};

type AdminUser = {
  id: string;
  email: string;
  role: 'ADMIN';
  firstName?: string;
  lastName?: string;
};

type User = JobSeekerUser | CompanyUser | AdminUser;

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const storedUser = localStorage.getItem('user');

if (storedUser) {
  const currentUser = JSON.parse(storedUser);

  const updatedUser = {
    ...currentUser,
    profileImageUrl: url,
  };

  localStorage.setItem('user', JSON.stringify(updatedUser));
}

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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600 dark:text-slate-300">
          Loading dashboard...
        </p>
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
