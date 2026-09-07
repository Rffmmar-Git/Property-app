import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";

import PageHeader from "@/components/layout/PageHeader";
import SurfaceCard from "@/components/layout/SurfaceCard";
import TenantLayout from "@/layouts/TenantLayout";
import { usePropertyCategories } from "@/features/property/hooks/usePropertyCategories";
import { useCreatePropertyCategory } from "@/features/property/hooks/useCreatePropertyCategory";
import { useUpdatePropertyCategory } from "@/features/property/hooks/useUpdatePropertyCategory";
import { useDeletePropertyCategory } from "@/features/property/hooks/useDeletePropertyCategory";

export default function PropertyCategoryPage() {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoriesQuery = usePropertyCategories();
  const createMutation = useCreatePropertyCategory();
  const updateMutation = useUpdatePropertyCategory();
  const deleteMutation = useDeletePropertyCategory();

  const categories = categoriesQuery.data ?? [];

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }

    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return;
    }

    setErrorMessage(null);

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: { name: trimmedName },
        });

        setEditingId(null);
        setName("");
        return;
      }

      await createMutation.mutateAsync({
        name: trimmedName,
      });

      setName("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleEdit = (id: string, categoryName: string) => {
    setErrorMessage(null);
    setEditingId(id);
    setName(categoryName);
  };

  const handleCancelEdit = () => {
    setErrorMessage(null);
    setEditingId(null);
    setName("");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <TenantLayout>
      <PageHeader
        title="Property Categories"
        description="Manage the categories used for your properties."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <SurfaceCard className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
              <Tag size={20} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-midnight-indigo">
                {editingId ? "Edit Category" : "Add Category"}
              </h2>

              <p className="text-xs text-slate-muted">
                {editingId
                  ? "Update the category name."
                  : "Create a new property category."}
              </p>
            </div>
          </div>

          <label
            htmlFor="category-name"
            className="mb-2 block text-xs font-semibold text-midnight-indigo"
          >
            Category Name
          </label>

          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrorMessage(null);
            }}
            placeholder="e.g. Apartment"
            maxLength={100}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
              errorMessage
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-200 focus:border-midnight-indigo focus:ring-midnight-indigo/10"
            }`}
          />

          {errorMessage && (
            <p className="mt-2 text-xs font-medium text-red-500">
              {errorMessage}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || name.trim().length < 2}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={15} />

              {isSubmitting
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Add Category"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-midnight-indigo">
              Categories
            </h2>

            <p className="mt-1 text-xs text-slate-muted">
              {categories.length} categories available
            </p>
          </div>

          {categoriesQuery.isLoading && (
            <div className="px-5 py-8 text-center text-sm text-slate-muted">
              Loading categories...
            </div>
          )}

          {categoriesQuery.isError && (
            <div className="px-5 py-8 text-center text-sm text-red-500">
              Failed to load categories.
            </div>
          )}

          {!categoriesQuery.isLoading &&
            !categoriesQuery.isError &&
            categories.length === 0 && (
              <div className="px-5 py-10 text-center">
                <Tag
                  size={28}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-midnight-indigo">
                  No categories yet
                </p>

                <p className="mt-1 text-xs text-slate-muted">
                  Add your first property category.
                </p>
              </div>
            )}

          {!categoriesQuery.isLoading &&
            !categoriesQuery.isError &&
            categories.length > 0 && (
              <div>
                {errorMessage && !isSubmitting && (
                  <div className="border-b border-red-100 bg-red-50 px-5 py-3">
                    <p className="text-xs font-medium text-red-600">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div className="divide-y divide-slate-100">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                          <Tag size={16} />
                        </div>

                        <span className="truncate text-sm font-medium text-slate-700">
                          {category.name}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              category.id,
                              category.name,
                            )
                          }
                          className="cursor-pointer rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-midnight-indigo"
                          title="Edit category"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category.id)
                          }
                          disabled={deleteMutation.isPending}
                          className="cursor-pointer rounded-md p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete category"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </SurfaceCard>
      </div>
    </TenantLayout>
  );
}