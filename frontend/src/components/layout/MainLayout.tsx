
'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('sidebarCollapsed') === 'true'
  );

  const hideLayout =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/profile';

  const isDashboard = pathname.startsWith('/dashboard');

  // Listen for sidebar toggle events from DashboardLayout
  useEffect(() => {
    if (!isDashboard) return;

    const readState = () => {
      // Defer state update to avoid updating MainLayout while DashboardLayout is rendering
      requestAnimationFrame(() => {
        setSidebarCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
      });
    };

    window.addEventListener('sidebar-toggle', readState);
    return () => {
      window.removeEventListener('sidebar-toggle', readState);
    };
  }, [isDashboard]);

  return (
    <div className="flex min-h-screen flex-col">

      {/* Navbar — fixed at the top, offset by sidebar width on dashboard */}
      {!hideLayout && (
        <div className={`sticky top-0 z-50 shrink-0 ${isDashboard ? `transition-[margin] duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}` : ''}`}>
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <main className="w-full flex-1">
        {children}
      </main>

      {/* Footer - hidden on dashboard */}
      {!hideLayout && !isDashboard && <Footer />}

    </div>
  );
}

