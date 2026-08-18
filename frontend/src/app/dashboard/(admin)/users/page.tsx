
"use client";

import DashboardToolbar from "@/components/dashboard/DashboardToolbar";
import { useAdminUsers } from "@/hooks/useAdmin";

export default function AdminUsersPage() {
  const {
    data: users,
    isLoading,
    isError,
  } = useAdminUsers();

  return (
    <div className="space-y-6">

      <DashboardToolbar
        user={{
          id: "",
          email: "",
          role: "ADMIN",
        }}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Users Management
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View and manage users registered on the platform.
        </p>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Unable to load users.
        </div>
      )}

      {/* Users Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            All Users
          </h2>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        ) : users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Name
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Email
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Role
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Registered
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {user.firstName || user.lastName
                          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                          : "Unnamed User"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No users found.
            </p>
          </div>
        )}

      </section>
    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: "ADMIN" | "COMPANY" | "JOB_SEEKER";
}) {
  const styles = {
    ADMIN:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",

    COMPANY:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",

    JOB_SEEKER:
      "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  };

  const labels = {
    ADMIN: "Admin",
    COMPANY: "Company",
    JOB_SEEKER: "Job Seeker",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[role]}`}
    >
      {labels[role]}
    </span>
  );
}
