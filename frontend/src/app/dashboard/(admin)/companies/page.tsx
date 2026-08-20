"use client";
import { useState } from "react";
import {useAdminCompanies,useApproveCompany,useRejectCompany,useSuspendCompany,useDeleteCompany,useActivateCompany,useDeleteAdminCompany, } from "@/hooks/useAdmin";
type CompanyStatus =
  | "PENDING"
  | "APPROVED"
  | "SUSPENDED"
  | "REJECTED";

export default function AdminCompaniesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<CompanyStatus | "">("");
const [search, setSearch] = useState("");
const approveCompany = useApproveCompany();
const rejectCompany = useRejectCompany();
const suspendCompany = useSuspendCompany();
const activateCompany = useActivateCompany();
const deleteCompany = useDeleteAdminCompany();

const {
  data,
  isLoading,
  isError,
} = useAdminCompanies({
  page,
  limit: 10,
  
  status: status || undefined,
  search: search.trim() || undefined,
});

  const companies = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
const [selectedCompany, setSelectedCompany] =
  useState<any>(null);

function handleApprove(companyId: string) {
  if (approveCompany.isPending) return;

  approveCompany.mutate(companyId);
}

function handleReject(companyId: string) {
  if (rejectCompany.isPending) return;

  rejectCompany.mutate(companyId);
}
function handleSuspend(companyId: string) {
  if (suspendCompany.isPending) return;
  suspendCompany.mutate(companyId);
}
function handleActivate(companyId: string) {
  if (activateCompany.isPending) return;
  activateCompany.mutate(companyId);
}

function handleDelete(companyId: string) {
  if (deleteCompany.isPending) return;

  const confirmed = window.confirm(
    "Are you sure you want to delete this company? Its jobs and related data may also be deleted.",
  );

  if (!confirmed) return;

  deleteCompany.mutate(companyId);
}
  function handleStatusChange(
    value: CompanyStatus | "",
  ) {
    setStatus(value);
    setPage(1);
  }

  function clearFilters() {
    setStatus("");
    setPage(1);
  }

  return (
    <div className="space-y-6">

      

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Companies Management
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review, approve, and manage registered companies.
        </p>
      </div>

      {/* Filters */}
     <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

  <div className="grid gap-4 md:grid-cols-5 md:items-end">

    {/* Search */}
    <div className="md:col-span-3">
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
        placeholder="Search company name, owner, or email..."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      />
    </div>

    {/* Company Status */}
    <div className="md:col-span-1">
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Company Status
      </label>

      <select
        value={status}
        onChange={(e) =>
          handleStatusChange(
            e.target.value as CompanyStatus | "",
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="">All Statuses</option>

        <option value="PENDING">
          Pending
        </option>

        <option value="APPROVED">
          Approved
        </option>

        <option value="REJECTED">
          Rejected
        </option>
        <option value="SUSPENDED">
  Suspended
</option>
      </select>
    </div>

    {/* Clear Filter */}
    <div className="md:col-span-1">
      {status && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Clear Filter
        </button>
      )}
    </div>

  </div>
</section>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Unable to load companies. Please try again.
        </div>
      )}

      {/* Companies */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        {/* Table header */}
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">

          <h2 className="font-semibold text-slate-900 dark:text-white">
            All Companies
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Showing {companies.length} of {total} companies
          </p>

        </div>

        {/* Loading */}
        {isLoading ? (
          <CompaniesSkeleton />
        ) : companies.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No companies found.
            </p>
          </div>
        ) : (
          <>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Company
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Owner
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Jobs
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Registered
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {companies.map((company) => (
                    <tr
                      key={company.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >

                      {/* Company */}
                      <td className="px-6 py-5">

                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {company.companyName}
                          </p>

                          {company.website && (
                            <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                              {company.website}
                            </p>
                          )}
                        </div>

                      </td>

                      {/* Owner */}
                      <td className="px-6 py-5">

                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {getOwnerName(company)}
                        </p>

                        {company.user?.email && (
                          <p className="mt-1 text-xs text-slate-500">
                            {company.user.email}
                          </p>
                        )}

                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <CompanyStatusBadge
                          status={company.status}
                        />
                      </td>

                      {/* Jobs */}
                      <td className="px-6 py-5">

                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {company.jobs?.length ?? 0}
                        </span>

                      </td>

                      {/* Registered */}
                      <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(
                          company.createdAt,
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      {/* Actions */}
<td className="px-6 py-5">
  <div className="flex justify-end gap-2">

    <button
      type="button"
      onClick={() => setSelectedCompany(company)}
      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400"
    >
      View
    </button>

    {company.status === "PENDING" && (
      <>
        <button
          type="button"
          onClick={() => handleApprove(company.id)}
          disabled={approveCompany.isPending}
          className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-950/30 dark:text-green-400"
        >
          {approveCompany.isPending
            ? "Approving..."
            : "Approve"}
        </button>

        <button
          type="button"
          onClick={() => handleReject(company.id)}
          disabled={rejectCompany.isPending}
          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400"
        >
          {rejectCompany.isPending
            ? "Rejecting..."
            : "Reject"}
        </button>
      </>
    )}

    {company.status === "APPROVED" && (
      <>
        <button
          type="button"
          onClick={() => handleSuspend(company.id)}
          disabled={suspendCompany.isPending}
          className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-950/30 dark:text-amber-400"
        >
          {suspendCompany.isPending
            ? "Suspending..."
            : "Suspend"}
        </button>

        <button
          type="button"
          onClick={() => handleDelete(company.id)}
          disabled={deleteCompany.isPending}
          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400"
        >
          {deleteCompany.isPending
            ? "Deleting..."
            : "Delete"}
        </button>
      </>
    )}

    {company.status === "SUSPENDED" && (
      <>
        <button
          type="button"
          onClick={() => handleActivate(company.id)}
          disabled={activateCompany.isPending}
          className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-950/30 dark:text-green-400"
        >
          {activateCompany.isPending
            ? "Activating..."
            : "Activate"}
        </button>

        <button
          type="button"
          onClick={() => handleDelete(company.id)}
          disabled={deleteCompany.isPending}
          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400"
        >
          {deleteCompany.isPending
            ? "Deleting..."
            : "Delete"}
        </button>
      </>
    )}

    {company.status === "REJECTED" && (
      <button
        type="button"
        onClick={() => handleDelete(company.id)}
        disabled={deleteCompany.isPending}
        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400"
      >
        {deleteCompany.isPending
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

            {/* Mobile cards */}
            <div className="space-y-4 p-4 md:hidden">

              {companies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {company.companyName}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {company.user?.email ?? "No owner email"}
                      </p>
                    </div>

                    <CompanyStatusBadge
                      status={company.status}
                    />

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                    <div>
                      <p className="text-xs text-slate-500">
                        Jobs
                      </p>

                      <p className="font-semibold text-slate-900 dark:text-white">
                        {company.jobs?.length ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Registered
                      </p>

                      <p className="font-semibold text-slate-900 dark:text-white">
                        {new Date(
                          company.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <button
                      type="button"
                      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                    >
                      View
                    </button>

                    {company.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 dark:bg-green-950/30 dark:text-green-400"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400"
                        >
                          Reject
                        </button>
                      </>
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

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Next
                </button>

              </div>

            </div>

          </>
        )}

      </section>

      {/* Temporary Company View Modal */}
{selectedCompany && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Company Details
        </h2>

        <button
          type="button"
          onClick={() => setSelectedCompany(null)}
          className="text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          ×
        </button>
      </div>

      <div className="mt-6 space-y-4">

        <div>
          <p className="text-xs text-slate-500">
            Company
          </p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {selectedCompany.companyName}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Owner
          </p>
          <p className="font-medium text-slate-900 dark:text-white">
            {getOwnerName(selectedCompany)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Email
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            {selectedCompany.user?.email ?? "No email"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Status
          </p>
          <CompanyStatusBadge
            status={selectedCompany.status}
          />
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Website
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            {selectedCompany.website ?? "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            Location
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            {selectedCompany.location ?? "Not provided"}
          </p>
        </div>

      </div>

      <button
        type="button"
        onClick={() => setSelectedCompany(null)}
        className="mt-6 w-full rounded-xl bg-[#1671B9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#125d98]"
      >
        Close
      </button>

    </div>
  </div>
)}

    </div>
  );
}

function getOwnerName(company: {
  user?: {
    firstName?: string;
    lastName?: string;
  };
}) {
  const firstName = company.user?.firstName ?? "";
  const lastName = company.user?.lastName ?? "";

  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unnamed Owner";
}

function CompanyStatusBadge({
  status,
}: {
  status: CompanyStatus;
}) {
  const config: Record<
    CompanyStatus,
    {
      label: string;
      className: string;
    }
  > = {
    PENDING: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    },

    APPROVED: {
      label: "Approved",
      className:
        "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    },

    SUSPENDED: {
      label: "Suspended",
      className:
        "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
    },

    REJECTED: {
      label: "Rejected",
      className:
        "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function CompaniesSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
        />
      ))}
    </div>
  );
}