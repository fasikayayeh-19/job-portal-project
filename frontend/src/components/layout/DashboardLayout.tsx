'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { User } from '@/types/user';
export type UserRole =
  | 'JOB_SEEKER'
  | 'COMPANY'
  | 'ADMIN';


interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">

      {/* =====================================================
          Dashboard Sidebar
      ====================================================== */}

      {user && (
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          Dashboard Main Area
      ====================================================== */}

      <main className="min-w-0 flex-1 md:ml-64">

        {/* =================================================
            Mobile Sidebar Button
        ================================================== */}

        {user && (
          <div
            className="
              border-b
              border-slate-200
              bg-white
              px-4
              py-3
              dark:border-slate-800
              dark:bg-slate-900
              md:hidden
            "
          >
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="
                rounded-lg
                bg-[#1671B9]
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#0F5F9E]
              "
            >
              Open Dashboard Menu
            </button>
          </div>
        )}

        {/* =================================================
            Dashboard Page Content
        ================================================== */}

        <div className="w-full p-4 sm:p-6 lg:p-8">
          {children}
        </div>

      </main>
    </div>
  );
}