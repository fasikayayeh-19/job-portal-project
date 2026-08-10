import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white border- shadow-2xl dark:border-slate-800 dark:bg-[#020817]">
      <div className="mx-auto ml-2 px-5 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center text-xl font-bold tracking-tight text-[#1671B9] transition-colors duration-200 hover:text-[#0F5F9E] dark:text-[#4da3e8] dark:hover:text-[#69b6f2]"
            >
              Job Portal
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Connecting talented people with companies and opportunities
              that help careers and businesses grow.
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1671B9] transition-colors duration-200 hover:text-[#0F5F9E] dark:text-[#4da3e8] dark:hover:text-[#69b6f2]"
            >
              Explore opportunities
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Job Seekers
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Find Jobs
                </Link>
              </li>

              <li>
                <Link
                  href="/companies"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Explore Companies
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Employers
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/register"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Create Company Account
                </Link>
              </li>

              <li>
                <Link
                  href="/companies"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Find Companies
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  About Job Portal
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-[#1671B9] dark:text-slate-400 dark:hover:text-[#4da3e8]"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-slate-200 py-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Job Portal. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-slate-400 transition-colors hover:text-[#1671B9] dark:text-slate-500 dark:hover:text-[#4da3e8]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-slate-400 transition-colors hover:text-[#1671B9] dark:text-slate-500 dark:hover:text-[#4da3e8]"
            >
              Terms
            </Link>

            <Link
              href="/contact"
              className="text-xs text-slate-400 transition-colors hover:text-[#1671B9] dark:text-slate-500 dark:hover:text-[#4da3e8]"
            >
              Support
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}