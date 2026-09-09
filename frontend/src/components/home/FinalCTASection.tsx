'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Building2 } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 dark:bg-slate-950">
      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-linear-to-r from-[#0878A8] via-[#0788A5] to-[#10A8A5] shadow-xl">
          <div className="px-6 py-14 sm:px-10 lg:px-16 lg:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                Start your journey today
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your next opportunity is waiting
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                Whether you are looking for your next career opportunity or
                searching for the right person to join your team, we make the
                process simple.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/jobs"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#0878A8] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-xl"
                >
                  <BriefcaseBusiness className="h-5 w-5" />
                  Find a Job
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/register?role=company"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <Building2 className="h-5 w-5" />
                  Post a Job
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}