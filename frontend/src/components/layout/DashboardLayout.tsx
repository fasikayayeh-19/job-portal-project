'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { User } from '@/types/user';
import { Menu } from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore collapsed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    if (stored === 'true') {
      setCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      window.dispatchEvent(new Event('sidebar-toggle'));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* ============================================================
          SIDEBAR
      ============================================================ */}
      {user && (
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
      )}

      {/* ============================================================
          CONTENT WRAPPER
          Starts after the sidebar. Margin adjusts when sidebar
          collapses/expands.
      ============================================================ */}
      <div
        className={`
          flex min-h-screen flex-1 flex-col
          transition-[margin] duration-300 ease-in-out
          ${collapsed ? 'md:ml-16' : 'md:ml-64'}
        `}
      >
        {/* Mobile-only sticky bar with hamburger */}
        {user && (
          <div className="sticky top-0 z-30 flex h-12 shrink-0 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
          </div>
        )}

        {/* ============================================================
            PAGE CONTENT
        ============================================================ */}
        <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-5 lg:py-5">
          {children}
        </main>
      </div>
    </div>
  );
}