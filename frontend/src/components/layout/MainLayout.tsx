"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  return (
    <div className="flex min-h-screen w-full flex-col bg-white text-slate-900 dark:bg-[#020817] dark:text-white">

      {/* Navbar */}
      {!hideLayout && (
        <header className="sticky top-0 z-50 w-full">
          <Navbar />
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      {!hideLayout && (
        <footer className="w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#020817]">
          <Footer />
        </footer>
      )}

    </div>
  );
}