"use client";

import { useState } from "react";

import type {
  AdminJob,
  AdminJobStatus,
} from "@/services/admin.service";

import {
  useAdminJobs,
  useCloseJob,
  useDeleteAdminJob,
} from "@/hooks/useAdmin";

export default function AdminJobsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<AdminJobStatus | undefined>(undefined);

  const [selectedJob, setSelectedJob] =
    useState<AdminJob | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useAdminJobs({
    page,
    limit: 10,
    search: search.trim() || undefined,
    status,
  });

  const closeJob = useCloseJob();
  const deleteJob = useDeleteAdminJob();

  const jobs = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  function clearFilters() {
    setSearch("");
    setStatus(undefined);
    setPage(1);
  }

  function handleClose(id: string) {
    if (closeJob.isPending) return;
    closeJob.mutate(id);
  }

  function handleDelete(id: string) {
    if (deleteJob.isPending) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    deleteJob.mutate(id);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Jobs Management
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor and manage jobs posted by companies.
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search job title, company..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Status
            </label>

            <select
  value={status ?? ""}
  onChange={(e) => {
    const value = e.target.value;

    setStatus(
      value === ""
        ? undefined
        : (value as AdminJobStatus)
    );

    setPage(1);
  }}
  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
>
  <option value="">All Jobs</option>
  <option value="PUBLISHED">Published</option>
  <option value="CLOSED">Closed</option>
</select>
          </div>

          {/* Clear */}
          <div className="flex items-end">
            {(search || status) && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Unable to load jobs. Please try again.
        </div>
      )}

      {/* Jobs */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            All Jobs
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Showing {jobs.length} of {total} jobs
          </p>
        </div>

        {/* Loading */}
        {isLoading ? (
          <JobsSkeleton />
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No jobs found.
            </p>
          </div>
        ) : (
          <>
            {/* ================= DESKTOP ================= */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Job
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Company
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Posted
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      {/* Job */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {job.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {job.jobType}
                        </p>
                      </td>

                      {/* Company */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {job.company?.companyName ??
                            "Unknown Company"}
                        </p>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                        {job.location}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <JobStatusBadge
                          status={job.status}
                        />
                      </td>

                      {/* Posted */}
                      <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(
                          job.createdAt
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedJob(job)
                            }
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
                          >
                            View
                          </button>

                          {/* Close */}
                          {job.status === "PUBLISHED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleClose(job.id)
                              }
                              disabled={
                                closeJob.isPending
                              }
                              className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50"
                            >
                              {closeJob.isPending
                                ? "Closing..."
                                : "Close"}
                            </button>
                          )}

                          {/* Delete */}
                          {job.status === "CLOSED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(job.id)
                              }
                              disabled={
                                deleteJob.isPending
                              }
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                            >
                              {deleteJob.isPending
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE ================= */}
            <div className="space-y-4 p-4 md:hidden">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                        {job.title}
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {job.company?.companyName ??
                          "Unknown Company"}
                      </p>
                    </div>

                    <JobStatusBadge
                      status={job.status}
                    />
                  </div>

                  {/* Information */}
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {job.location}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Job Type
                      </p>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {job.jobType}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Posted
                      </p>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {new Date(
                          job.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    {/* View */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedJob(job)
                      }
                      className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
                    >
                      View
                    </button>

                    {/* Close */}
                    {job.status === "PUBLISHED" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleClose(job.id)
                        }
                        disabled={closeJob.isPending}
                        className="flex-1 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50"
                      >
                        {closeJob.isPending
                          ? "Closing..."
                          : "Close"}
                      </button>
                    )}

                    {/* Delete */}
                    {job.status === "CLOSED" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(job.id)
                        }
                        disabled={
                          deleteJob.isPending
                        }
                        className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                      >
                        {deleteJob.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(
                      (current) => current - 1
                    )
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage(
                      (current) => current + 1
                    )
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* View Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedJob.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedJob.company?.companyName ??
                    "Unknown Company"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedJob(null)
                }
                className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-6 space-y-5">
              {/* Description */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Requirements
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {selectedJob.requirements}
                  </p>
                </div>
              )}

              {/* Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Info
                  label="Location"
                  value={selectedJob.location}
                />

                <Info
                  label="Job Type"
                  value={selectedJob.jobType}
                />

                <Info
                  label="Experience"
                  value={selectedJob.experience}
                />

                <Info
                  label="Salary"
                  value={
                    selectedJob.salary ??
                    "Not specified"
                  }
                />

                <Info
                  label="Status"
                  value={selectedJob.status}
                />

                <Info
                  label="Posted"
                  value={new Date(
                    selectedJob.createdAt
                  ).toLocaleDateString()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STATUS BADGE ================= */
function JobStatusBadge({
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
    PUBLISHED: {
      label: "Published",
      className:
        "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    },

    CLOSED: {
      label: "Closed",
      className:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    },

    PENDING: {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
    },

    APPROVED: {
      label: "Approved",
      className:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    },
  };

  const item = config[status] ?? {
    label: status || "Unknown",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* ================= INFO ================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
        {value}
      </p>
    </div>
  );
}

/* ================= SKELETON ================= */

function JobsSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
          />
        )
      )}
    </div>
  );
}