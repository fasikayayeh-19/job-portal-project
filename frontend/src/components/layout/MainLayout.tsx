
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const hideLayout =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/profile';

  const isDashboard = pathname.startsWith('/dashboard');

  // Read sidebar collapsed state from localStorage
  useEffect(() => {
    if (!isDashboard) return;

    const readState = () => {
      setSidebarCollapsed(localStorage.getItem('sidebarCollapsed') === 'true');
    };

    // Defer initial read to avoid updating during child render
    const timer = setTimeout(readState, 0);

    // Listen for changes from DashboardLayout
    window.addEventListener('sidebar-toggle', readState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('sidebar-toggle', readState);
    };
  }, [isDashboard]);

  return (
    <div className="flex min-h-screen flex-col">

      {/* Navbar — offset by sidebar width on dashboard */}
      {!hideLayout && (
        <div className={isDashboard ? `transition-[margin] duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}` : ''}>
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

