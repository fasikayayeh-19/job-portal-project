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
    pathname === '/forgot-password';

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* Navbar */}
      {!hideLayout && <Navbar />}

      {/* Main content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      {!hideLayout && <Footer />}

    </div>
  );
}