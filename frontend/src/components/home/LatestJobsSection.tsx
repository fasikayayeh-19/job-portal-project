'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Clock3,
  CalendarDays,
} from 'lucide-react';

import type { HomeJob } from '@/services/home.service';

interface LatestJobsSectionProps {
  jobs: HomeJob[];
}

export default function LatestJobsSection({
  jobs,
}: LatestJobsSectionProps) {
  return (
    <section className="relative bg-white py-20 dark:bg-slate-950">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-blue-50/80 blur-3xl dark:bg-blue-950/20" />
        <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-blue-50/80 blur-3xl dark:bg-blue-950/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-7 rounded-full bg-[#1671B9]" />

              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#1671B9]">
                Fresh Opportunities
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Latest Jobs
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Explore the latest opportunities from companies currently hiring.
            </p>
          </div>

          <Link
            href="/jobs"
            className="
              group
              inline-flex
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#1671B9]/20
              bg-[#1671B9]/5
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[#1671B9]
              transition-all
              duration-200
              hover:border-[#1671B9]/40
              hover:bg-[#1671B9]/10
              hover:shadow-sm
              dark:border-blue-400/20
              dark:bg-blue-400/5
              dark:text-blue-400
              dark:hover:border-blue-400/40
              dark:hover:bg-blue-400/10
            "
          >
            View all jobs

            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* ================= EMPTY STATE ================= */}

        {jobs.length === 0 ? (
          <div
            className="
              mt-10
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-6
              py-14
              text-center
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-50
                text-[#1671B9]
                dark:bg-blue-950/40
                dark:text-blue-400
              "
            >
              <BriefcaseBusiness size={25} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No jobs available
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              New opportunities will appear here when companies publish jobs.
            </p>
          </div>
        ) : (

          /* ================= JOB CARDS ================= */

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {jobs.slice(0, 3).map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="
                  group
                  flex
                  flex-col
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  p-6
                  shadow-sm
                  shadow-slate-100/50
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:shadow-lg
                  hover:shadow-blue-100/50
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:shadow-none
                  dark:hover:border-blue-800
                  dark:hover:shadow-none
                "
              >

                {/* ================= TOP ================= */}

                <div className="flex items-start gap-3.5">

                  {/* Company icon */}
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-blue-50
                      to-blue-100/50
                      text-[#1671B9]
                      transition-all
                      duration-300
                      group-hover:from-[#1671B9]
                      group-hover:to-[#125f9c]
                      group-hover:text-white
                      group-hover:shadow-md
                      group-hover:shadow-[#1671B9]/20
                      dark:from-blue-950/40
                      dark:to-blue-900/30
                      dark:text-blue-400
                      dark:group-hover:from-[#1671B9]
                      dark:group-hover:to-[#125f9c]
                      dark:group-hover:text-white
                    "
                  >
                    <BriefcaseBusiness size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {job.company?.companyName ?? 'Company'}
                    </p>

                    <h3
                      className="
                        mt-1
                        text-lg
                        font-bold
                        leading-snug
                        text-slate-900
                        transition-colors
                        duration-200
                        group-hover:text-[#1671B9]
                        dark:text-white
                        dark:group-hover:text-blue-400
                      "
                    >
                      {job.title}
                    </h3>
                  </div>
                </div>

                {/* ================= BADGES ================= */}                <div className="mt-4 flex flex-wrap gap-2">

                  {job.category?.name && (
                    <span
                      className="
                        rounded-lg
                        bg-[#1671B9]/8
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        text-[#1671B9]
                        dark:bg-blue-400/10
                        dark:text-blue-400
                      "
                    >
                      {job.category.name}
                    </span>
                  )}

                  {job.jobType?.name && (
                    <span
                      className="
                        rounded-lg
                        bg-slate-100
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        text-slate-600
                        dark:bg-slate-800
                        dark:text-slate-300
                      "
                    >
                      {job.jobType.name}
                    </span>
                  )}

                  <span
                    className="
                      rounded-lg
                      bg-emerald-50
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      text-emerald-600
                      dark:bg-emerald-950/30
                      dark:text-emerald-400
                    "
                  >
                    Open
                  </span>

                </div>

                {/* ================= DETAILS ================= */}

                <div
                  className="
                    mt-4
                    space-y-2.5
                    border-t
                    border-slate-100
                    pt-4
                    dark:border-slate-800
                  "
                >

                  {/* Location */}
                  <div className="flex items-center gap-2.5">

                    <MapPin
                      size={14}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="truncate text-[13px] text-slate-600 dark:text-slate-300">
                      {job.location}
                    </span>

                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-2.5">

                    <Clock3
                      size={14}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="text-[13px] text-slate-600 dark:text-slate-300">
                      {job.experience} experience
                    </span>

                  </div>

                  {/* Deadline */}
                  {job.deadline && (
                    <div className="flex items-center gap-2.5">

                      <CalendarDays
                        size={14}
                        className="shrink-0 text-slate-400"
                      />

                      <span className="text-[13px] text-slate-600 dark:text-slate-300">
                        Apply by{' '}
                        {new Date(job.deadline).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </span>

                    </div>
                  )}

                </div>

                {/* ================= FOOTER ================= */}

                <div
                  className="
                    mt-auto
                    flex
                    items-end
                    justify-between
                    border-t
                    border-slate-100
                    pt-4
                    dark:border-slate-800
                  "
                >

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Salary
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                      {job.salary || 'Not specified'}
                    </p>
                  </div>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      text-xs
                      font-semibold
                      text-[#1671B9]
                      transition-all
                      duration-200
                      group-hover:text-blue-700
                      dark:text-blue-400
                      dark:group-hover:text-blue-300
                    "
                  >
                    View details
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>

                </div>

              </Link>
            ))}

          </div>
        )}

        {/* ================= BOTTOM CTA ================= */}

        {jobs.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/jobs"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                py-3
                text-sm
                font-semibold
                text-slate-700
                shadow-sm
                transition-all
                duration-200
                hover:border-[#1671B9]/30
                hover:bg-[#1671B9]
                hover:text-white
                hover:shadow-md
                hover:shadow-[#1671B9]/15
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:border-[#1671B9]
                dark:hover:bg-[#1671B9]
                dark:hover:text-white
              "
            >
              Explore all opportunities
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}