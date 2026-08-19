
"use client";

import { useState } from "react";
import DashboardToolbar from "@/components/dashboard/DashboardToolbar";
import {
  useAdminUsers,
  useBlockAdminUser,
  useUnblockAdminUser,
  useDeleteAdminUser,
} from "@/hooks/useAdmin";

type UserRole = "ADMIN" | "COMPANY" | "JOB_SEEKER";
type UserStatus = "ACTIVE" | "BLOCKED" | "PENDING";

type AdminUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useAdminUsers({
    page,
    limit: 10,
    role: role || undefined,
    status: status || undefined,
  });

  const blockUser = useBlockAdminUser();
  const unblockUser = useUnblockAdminUser();
  const deleteUser = useDeleteAdminUser();

  const users: AdminUser[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    const fullName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase();

    return (
      fullName.includes(value) ||
      user.email.toLowerCase().includes(value)
    );
  });

  function clearFilters() {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  }

  function handleBlock(id: string) {
    if (!window.confirm("Are you sure you want to block this user?")) {
      return;
    }

    blockUser.mutate(id);
  }

  function handleUnblock(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to unblock this user?",
      )
    ) {
      return;
    }

    unblockUser.mutate(id);
  }

  function handleDelete(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this user?",
      )
    ) {
      return;
    }

    deleteUser.mutate(id);
  }

  return (
    <div className="space-y-6">

      {/* Toolbar */}
     

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Users Management
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View and manage users registered on the platform.
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

  <div className="grid gap-4 md:grid-cols-5">

    {/* Search - wider */}
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
        placeholder="Search name or email..."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      />
    </div>

    {/* Role */}
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Role
      </label>

      <select
        value={role}
        onChange={(e) => {
          setRole(e.target.value as UserRole | "");
          setPage(1);
        }}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="">All Roles</option>
        <option value="ADMIN">Admin</option>
        <option value="COMPANY">Company</option>
        <option value="JOB_SEEKER">
          Job Seeker
        </option>
      </select>
    </div>

    {/* Status */}
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Status
      </label>

      <select
        value={status}
        onChange={(e) => {
          setStatus(
            e.target.value as UserStatus | "",
          );
          setPage(1);
        }}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="">All Statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="BLOCKED">Blocked</option>
        <option value="PENDING">Pending</option>
      </select>
    </div>

    {/* Clear */}
    <div className="flex items-end">
      {(search || role || status) && (
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
          Unable to load users. Please try again.
        </div>
      )}

      {/* Users */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              All Users
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredUsers.length} of {total} users
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <UsersSkeleton />
        ) : filteredUsers.length === 0 ? (
          <EmptyUsers />
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
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

                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >

                      {/* User */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                            {getInitials(user)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {getUserName(user)}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {user.email}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <StatusBadge status={user.status} />
                      </td>

                      {/* Registered */}
                      <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(
                          user.createdAt,
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">

                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50"
                          >
                            View
                          </button>

                          {/* Block / Unblock */}
                          {user.status === "ACTIVE" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleBlock(user.id)
                              }
                              disabled={blockUser.isPending}
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                            >
                              {blockUser.isPending
                                ? "Blocking..."
                                : "Block"}
                            </button>
                          )}

                          {user.status === "BLOCKED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleUnblock(user.id)
                              }
                              disabled={
                                unblockUser.isPending
                              }
                              className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50"
                            >
                              {unblockUser.isPending
                                ? "Unblocking..."
                                : "Unblock"}
                            </button>
                          )}

                          {/* Delete */}
                          {user.role !== "ADMIN" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(user.id)
                              }
                              disabled={
                                deleteUser.isPending
                              }
                              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                              {deleteUser.isPending
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

            {/* Mobile */}
            <div className="space-y-4 p-4 md:hidden">

              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                        {getInitials(user)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {getUserName(user)}
                        </h3>

                        <p className="mt-1 break-all text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>

                    </div>

                    <StatusBadge status={user.status} />

                  </div>

                  <div className="mt-4 flex items-center justify-between">

                    <RoleBadge role={user.role} />

                    <span className="text-xs text-slate-500">
                      {new Date(
                        user.createdAt,
                      ).toLocaleDateString()}
                    </span>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedUser(user)
                      }
                      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                    >
                      View
                    </button>

                    {user.status === "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleBlock(user.id)
                        }
                        disabled={blockUser.isPending}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50 dark:bg-red-950/30 dark:text-red-400"
                      >
                        {blockUser.isPending
                          ? "Blocking..."
                          : "Block"}
                      </button>
                    )}

                    {user.status === "BLOCKED" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUnblock(user.id)
                        }
                        disabled={
                          unblockUser.isPending
                        }
                        className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 disabled:opacity-50 dark:bg-green-950/30 dark:text-green-400"
                      >
                        {unblockUser.isPending
                          ? "Unblocking..."
                          : "Unblock"}
                      </button>
                    )}

                    {user.role !== "ADMIN" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(user.id)
                        }
                        disabled={
                          deleteUser.isPending
                        }
                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {deleteUser.isPending
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

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                User Details
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <div>
                <p className="text-xs text-slate-500">
                  Name
                </p>

                <p className="font-semibold text-slate-900 dark:text-white">
                  {getUserName(selectedUser)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedUser.email}
                </p>
              </div>

              <div className="flex gap-3">
                <RoleBadge role={selectedUser.role} />
                <StatusBadge
                  status={selectedUser.status}
                />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Registered
                </p>

                <p className="font-semibold text-slate-900 dark:text-white">
                  {new Date(
                    selectedUser.createdAt,
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedUser(null)
              }
              className="mt-6 w-full rounded-xl bg-[#1671B9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#125f9d]"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getUserName(user: AdminUser) {
  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return fullName || "Unnamed User";
}

function getInitials(user: AdminUser) {
  const first =
    user.firstName?.charAt(0).toUpperCase() ?? "";

  const last =
    user.lastName?.charAt(0).toUpperCase() ?? "";

  if (first || last) {
    return `${first}${last}`;
  }

  return user.email
    .charAt(0)
    .toUpperCase();
}

/* =========================================================
   ROLE BADGE
========================================================= */

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const config: Record<
    UserRole,
    {
      label: string;
      className: string;
    }
  > = {
    ADMIN: {
      label: "Admin",
      className:
        "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
    },

    COMPANY: {
      label: "Company",
      className:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    },

    JOB_SEEKER: {
      label: "Job Seeker",
      className:
        "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    },
  };

  const item = config[role];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: UserStatus;
}) {
  const config: Record<
    UserStatus,
    {
      label: string;
      className: string;
    }
  > = {
    ACTIVE: {
      label: "Active",
      className:
        "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    },

    BLOCKED: {
      label: "Blocked",
      className:
        "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
    },

    PENDING: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
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

/* =========================================================
   LOADING
========================================================= */

function UsersSkeleton() {
  return (
    <div className="space-y-4 p-6">

      {Array.from({ length: 5 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
          />
        ),
      )}

    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyUsers() {
  return (
    <div className="p-12 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">
        👤
      </div>

      <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
        No users found
      </h3>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Try changing your search or filters.
      </p>

    </div>
  );
}
