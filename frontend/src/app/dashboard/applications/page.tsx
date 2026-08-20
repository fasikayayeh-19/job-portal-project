'use client';

import Link from 'next/link';
import type { MyApplication } from '@/services/applications.service';
import { useMyApplications } from '@/hooks/useMyApplications';

export default function MyApplicationsPage() {
  const {
    data: applications,
    isLoading,
    isError,
  } = useMyApplications();

  if (isLoading) {
    return <ApplicationsLoading />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
        Failed to load your applications.
      </div>
    );
  }

  function ApplicationStatus({
  status,
}: {
  status: string;
}) {
  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    PENDING_REVIEW: {
      label: 'Pending Review',
      className:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },

    ON_TEST: {
      label: 'On Test',
      className:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },

    INTERVIEW: {
      label: 'Interview',
      className:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },

    HIRED: {
      label: 'Hired',
      className:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },

    DECLINED: {
      label: 'Declined',
      className:
        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
  };

  const config = statusConfig[status] ?? {
    label: status,
    className:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function EmptyApplications() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">
        📄
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        No applications yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        You haven't applied for any jobs yet. Find a job that matches your
        skills and submit your first application.
      </p>

      <Link
        href="/jobs"
        className="mt-5 inline-flex rounded-lg bg-[#1671B9] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#125d99]"
      >
        Find Jobs
      </Link>

    </div>
  );
}

function ApplicationsLoading() {
  return (
    <div className="space-y-4">

      <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

      <div className="h-5 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
        />
      ))}

    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

  function ApplicationCard({
  application,
}: {
  application: MyApplication;
}) {
  const { job } = application;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        {/* Job information */}
        <div className="min-w-0">

          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {job.title}
          </h2>

          <p className="mt-1 text-sm font-medium text-[#1671B9]">
            {job.company.companyName}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              📍 {job.location}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              💼 {job.jobType?.name || 'Not specified'}
            </span>

            {job.category && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {job.category.name}
              </span>
            )}

          </div>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Applied on {formatDate(application.createdAt)}
          </p>

        </div>

        {/* Status + action */}
        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">

          <ApplicationStatus status={application.status} />

          <Link
            href={`/jobs/${job.id}`}
            className="rounded-lg bg-[#1671B9] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#125d99]"
          >
            View Job
          </Link>

        </div>

      </div>

    </div>
  );
}

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Applications
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track the jobs you have applied for.
        </p>
      </div>

      {/* Applications */}
      {applications && applications.length > 0 ? (
        <div className="space-y-4">

          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
            />
          ))}

        </div>
      ) : (
        <EmptyApplications />
      )}

    </div>
  );
  
}
