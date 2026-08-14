'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layout/DashboardLayout';

import type { User } from '@/types/user';

export default function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
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
      {children}
    </DashboardLayout>
  );
}