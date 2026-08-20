"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  FolderTree,
} from "lucide-react";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";

export default function CategoriesPage() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useCategories();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [name, setName] = useState("");
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const isSaving =
    createCategory.isPending ||
    updateCategory.isPending;

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    if (editingId) {
      updateCategory.mutate(
        {
          id: editingId,
          name: trimmedName,
        },
        {
          onSuccess: () => {
            setName("");
            setEditingId(null);
          },
        },
      );

      return;
    }

    createCategory.mutate(
      {
        name: trimmedName,
      },
      {
        onSuccess: () => {
          setName("");
        },
      },
    );
  }

  function handleEdit(
    id: string,
    currentName: string,
  ) {
    setEditingId(id);
    setName(currentName);
  }

  function handleCancel() {
    setEditingId(null);
    setName("");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    deleteCategory.mutate(id);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Categories
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage the categories available for job postings.
        </p>
      </div>

      {/* Create / Edit */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2">
          {editingId ? (
            <Pencil className="h-5 w-5 text-[#1671B9]" />
          ) : (
            <Plus className="h-5 w-5 text-[#1671B9]" />
          )}

          <h2 className="font-semibold text-slate-900 dark:text-white">
            {editingId
              ? "Edit Category"
              : "Add Category"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Example: Software Development"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1671B9] focus:ring-2 focus:ring-[#1671B9]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />

          <button
            type="submit"
            disabled={isSaving || !name.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1671B9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#125d99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingId ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}

            {editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          )}
        </form>
      </section>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          Unable to load categories. Please try again.
        </div>
      )}

      {/* Category list */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            All Categories
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {categories.length} categor
            {categories.length === 1
              ? "y"
              : "ies"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#1671B9]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="mx-auto h-8 w-8 text-slate-400" />

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              No categories found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1671B9] dark:bg-blue-950/30">
                    <FolderTree className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {category.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Created{" "}
                      {new Date(
                        category.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        category.id,
                        category.name,
                      )
                    }
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-[#1671B9] dark:hover:bg-blue-950/30"
                    title="Edit category"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(category.id)
                    }
                    disabled={
                      deleteCategory.isPending
                    }
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/30"
                    title="Delete category"
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