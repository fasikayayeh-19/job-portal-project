"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import {
  useAdminUsers,
  useCreateAdmin,
  useDeleteAdmin,
} from "@/hooks/useAdmin";

export default function AdminUsersPage() {
  const [showForm, setShowForm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    data,
    isLoading,
    isError,
  } = useAdminUsers({
    page: 1,
    limit: 100,
    role: "ADMIN",
  });

  const createAdminMutation = useCreateAdmin();
  const deleteAdminMutation = useDeleteAdmin();

  const admins = data?.data ?? [];

  function resetForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setShowForm(false);
  }

  function handleCreate(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return;
    }

    createAdminMutation.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          resetForm();
        },
      },
    );
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this admin?",
    );

    if (!confirmed) return;

    deleteAdminMutation.mutate(id);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Users
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and manage administrator accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1671B9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125d99]"
        >
          <Plus className="h-4 w-4" />
          Create Admin
        </button>
      </div>

      {/* Create Admin Form */}
      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Create Administrator
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Create a new account with administrator privileges.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleCreate}
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              placeholder="First name"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <input
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              placeholder="Last name"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1671B9] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={
                  createAdminMutation.isPending
                }
                className="inline-flex items-center gap-2 rounded-xl bg-[#1671B9] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {createAdminMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                Create Admin
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Unable to load admin users.
        </div>
      )}

      {/* Admin list */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Administrators
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {admins.length} administrator
            {admins.length !== 1 ? "s" : ""}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#1671B9]" />
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No administrators found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {admin.firstName}{" "}
                      {admin.lastName}
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {admin.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
                    {admin.status}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(admin.id)
                    }
                    disabled={
                      deleteAdminMutation.isPending
                    }
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/30"
                    title="Delete admin"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}