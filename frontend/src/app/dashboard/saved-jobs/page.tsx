'use client';

import { useRouter } from 'next/navigation';

import {
  useRemoveSavedJob,
  useSavedJobs,
} from '@/hooks/useSavedJobs';

export default function SavedJobsPage() {
  const router = useRouter();

  const {
    data: savedJobs = [],
    isLoading,
    isError,
  } = useSavedJobs();

  const removeSavedJobMutation = useRemoveSavedJob();

  const handleRemove = (jobId: string) => {
    removeSavedJobMutation.mutate(jobId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
        Failed to load saved jobs.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Saved Jobs
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Jobs you saved for later.
        </p>
      </div>

      {/* Empty */}
      {savedJobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl dark:bg-blue-900/20">
            🔖
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
            No saved jobs
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Save jobs you're interested in and find them here later.
          </p>

          <button
            type="button"
            onClick={() => router.push('/jobs')}
            className="mt-5 rounded-lg bg-[#1671B9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#125d99]"
          >
            Browse Jobs
          </button>

        </div>
      ) : (

        /* Saved jobs */
        <div className="space-y-4">

          {savedJobs.map((savedJob) => (

            <div
              key={savedJob.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                {/* Job information */}
                <div className="min-w-0">

                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {savedJob.job.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {savedJob.job.company.companyName}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      📍 {savedJob.job.location}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      💼 {savedJob.job.jobType}
                    </span>

                    {savedJob.job.category && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-[#1671B9] dark:bg-blue-900/20 dark:text-blue-400">
                        {savedJob.job.category.name}
                      </span>
                    )}

                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    Saved{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(new Date(savedJob.createdAt))}
                  </p>

                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/jobs/${savedJob.job.id}`)
                    }
                    className="rounded-lg bg-[#1671B9] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#125d99]"
                  >
                    View Job
                  </button>

                  <button
                    type="button"
                    disabled={removeSavedJobMutation.isPending}
                    onClick={() =>
                      handleRemove(savedJob.job.id)
                    }
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/20"
                  >
                    {removeSavedJobMutation.isPending
                      ? 'Removing...'
                      : 'Remove'}
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}