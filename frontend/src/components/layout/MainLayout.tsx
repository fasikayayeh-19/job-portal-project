
'use client';

import { usePathname } from 'next/navigation';

import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/profile';

  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <div className="flex min-h-screen flex-col">

      {/* Navbar */}
      {!hideLayout && <Navbar />}

      {/* Main Content */}
      <main className="w-full flex-1">
        {children}
      </main>

      {/* Footer - hidden on dashboard */}
      {!hideLayout && !isDashboard && <Footer />}

    </div>
  );
}

