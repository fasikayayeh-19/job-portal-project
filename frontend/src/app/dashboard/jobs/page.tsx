'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Pencil,
  XCircle,
  Trash2,
  Loader2,
} from 'lucide-react';

import {
  useCompanyJobs,
  useCloseJob,
  useDeleteJob,
} from '@/hooks/useJobs';

import type { CompanyJob } from '@/services/jobs.service';

export default function MyJobsPage() {
  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useCompanyJobs();

  const closeMutation = useCloseJob();
  const deleteMutation = useDeleteJob();

  const [deleteJobId, setDeleteJobId] =
    useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        Failed to load your jobs.
      </div>
    );
  }

  const handleClose = (job: CompanyJob) => {
    if (job.status === 'CLOSED') return;

    const confirmed = window.confirm(
      `Are you sure you want to close "${job.title}"?`,
    );

    if (!confirmed) return;

    closeMutation.mutate(job.id);
  };

  const handleDelete = () => {
    if (!deleteJobId) return;

    deleteMutation.mutate(deleteJobId, {
      onSuccess: () => {
        setDeleteJobId(null);
      },
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Jobs
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your job postings and applicants.
          </p>
        </div>

        <Link
          href="/dashboard/jobs/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1671B9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125d99]"
        >
          <Briefcase size={17} />
          Post New Job
        </Link>

      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">

        <SummaryCard
          label="Total Jobs"
          value={jobs.length}
        />

        <SummaryCard
          label="Active Jobs"
          value={
            jobs.filter(
              (job) => job.status !== 'CLOSED',
            ).length
          }
        />

        <SummaryCard
          label="Total Applicants"
          value={jobs.reduce(
            (total, job) =>
              total +
              (job.applications?.length ?? 0),
            0,
          )}
        />

      </div>

      {/* Jobs */}
      {jobs.length === 0 ? (
        <EmptyJobs />
      ) : (
        <div className="space-y-4">

          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClose={() => handleClose(job)}
              onDelete={() =>
                setDeleteJobId(job.id)
              }
              closing={
                closeMutation.isPending &&
                closeMutation.variables === job.id
              }
            />
          ))}

        </div>
      )}

      {/* Delete confirmation */}
      {deleteJobId && (
        <DeleteModal
          deleting={deleteMutation.isPending}
          onCancel={() =>
            setDeleteJobId(null)
          }
          onConfirm={handleDelete}
        />
      )}

    </div>
  );
}

/* =====================================================
   JOB CARD
===================================================== */

function JobCard({
  job,
  onClose,
  onDelete,
  closing,
}: {
  job: CompanyJob;
  onClose: () => void;
  onDelete: () => void;
  closing: boolean;
}) {
  const isClosed = job.status === 'CLOSED';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Job information */}
        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {job.title}
            </h2>

            <JobStatus status={job.status} />

          </div>

          <div className="mt-3 flex flex-wrap gap-2">

            {job.category && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-[#1671B9] dark:bg-blue-950/30">
                {job.category.name}
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              📍 {job.location}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              💼 {job.jobType}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Experience: {job.experience}
            </span>

          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">

            <span className="inline-flex items-center gap-1.5">
              <Users size={16} />
              {job.applications?.length ?? 0} applicant
              {(job.applications?.length ?? 0) !== 1
                ? 's'
                : ''}
            </span>

            <span>
              Posted{' '}
              {new Date(
                job.createdAt,
              ).toLocaleDateString()}
            </span>

          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">

          <Link
            href={`/dashboard/applicants?job=${job.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Users size={16} />
            Applicants
          </Link>

          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Pencil size={16} />
            Edit
          </Link>

          {!isClosed && (
            <button
              type="button"
              disabled={closing}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-60 dark:border-amber-900/50 dark:hover:bg-amber-950/30"
            >
              {closing ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <XCircle size={16} />
              )}

              Close
            </button>
          )}

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   STATUS
===================================================== */

function JobStatus({
  status,
}: {
  status: string;
}) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    PENDING: {
      label: 'Pending',
      className:
        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },

    APPROVED: {
      label: 'Approved',
      className:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },

    PUBLISHED: {
      label: 'Published',
      className:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },

    CLOSED: {
      label: 'Closed',
      className:
        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
  };

  const current = config[status] ?? {
    label: status,
    className:
      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

/* =====================================================
   SUMMARY
===================================================== */

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}

/* =====================================================
   EMPTY
===================================================== */

function EmptyJobs() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">

      <Briefcase
        size={40}
        className="mx-auto text-slate-400"
      />

      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        No jobs yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        You haven't posted any jobs yet. Create your
        first job posting to start receiving
        applications.
      </p>

      <Link
        href="/dashboard/jobs/create"
        className="mt-5 inline-flex rounded-lg bg-[#1671B9] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#125d99]"
      >
        Post New Job
      </Link>

    </div>
  );
}

/* =====================================================
   DELETE MODAL
===================================================== */

function DeleteModal({
  deleting,
  onCancel,
  onConfirm,
}: {
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
          <Trash2 size={21} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Delete this job?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          This action cannot be undone. The job and its
          related applications may also be removed because
          your backend uses cascade deletion.
        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {deleting ? 'Deleting...' : 'Delete Job'}
          </button>

        </div>

      </div>

    </div>
  );
}