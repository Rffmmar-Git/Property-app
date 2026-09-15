import { useState } from "react";
import {
  CalendarDays,
  CircleAlert,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useTenantPeakSeasonRates } from "../hooks/useTenantPeakSeasonRates";
import { useCreateTenantPeakSeasonRate } from "../hooks/useCreateTenantPeakSeasonRate";
import { useUpdateTenantPeakSeasonRate } from "../hooks/useUpdateTenantPeakSeasonRate";
import { useDeleteTenantPeakSeasonRate } from "../hooks/useDeleteTenantPeakSeasonRate";
import type {
  PeakSeasonAdjustmentType,
  TenantPeakSeasonRate,
} from "../api/tenant-peak-season.api";

interface TenantPeakSeasonManagerProps {
  roomId: string;
  roomName: string;
  onBack: () => void;
}

interface FormState {
  startDate: string;
  endDate: string;
  adjustmentType: PeakSeasonAdjustmentType;
  adjustmentValue: string;
}

const initialForm: FormState = {
  startDate: "",
  endDate: "",
  adjustmentType: "PERCENTAGE",
  adjustmentValue: "",
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

const formatAdjustment = (rate: TenantPeakSeasonRate) => {
  const value = Number(rate.adjustment_value);

  if (rate.adjustment_type === "PERCENTAGE") {
    return `${value}%`;
  }

  return `Rp ${value.toLocaleString("id-ID")}`;
};

export default function TenantPeakSeasonManager({
  roomId,
  roomName,
  onBack,
}: TenantPeakSeasonManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRate, setEditingRate] =
    useState<TenantPeakSeasonRate | null>(null);
  const [deletingRate, setDeletingRate] =
    useState<TenantPeakSeasonRate | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errorMessage, setErrorMessage] = useState("");

  const ratesQuery = useTenantPeakSeasonRates(roomId);
  const createMutation = useCreateTenantPeakSeasonRate();
  const updateMutation = useUpdateTenantPeakSeasonRate();
  const deleteMutation = useDeleteTenantPeakSeasonRate();

  const rates = ratesQuery.data ?? [];
  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  const resetForm = () => {
    setForm(initialForm);
    setEditingRate(null);
    setShowForm(false);
    setErrorMessage("");
  };

  const openCreateForm = () => {
    setEditingRate(null);
    setForm(initialForm);
    setErrorMessage("");
    setShowForm(true);
  };

  const openEditForm = (rate: TenantPeakSeasonRate) => {
    setEditingRate(rate);
    setForm({
      startDate: rate.start_date.slice(0, 10),
      endDate: rate.end_date.slice(0, 10),
      adjustmentType: rate.adjustment_type,
      adjustmentValue: String(rate.adjustment_value),
    });
    setErrorMessage("");
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const adjustmentValue = Number(form.adjustmentValue);

    if (!form.startDate || !form.endDate) {
      setErrorMessage("Start date and end date are required.");
      return;
    }

    if (form.endDate < form.startDate) {
      setErrorMessage("End date must be after or equal to start date.");
      return;
    }

    if (
      !form.adjustmentValue ||
      !Number.isFinite(adjustmentValue) ||
      adjustmentValue <= 0
    ) {
      setErrorMessage("Adjustment value must be greater than zero.");
      return;
    }

    if (
      form.adjustmentType === "PERCENTAGE" &&
      adjustmentValue > 100
    ) {
      setErrorMessage("Percentage adjustment cannot exceed 100.");
      return;
    }

    const payload = {
      startDate: form.startDate,
      endDate: form.endDate,
      adjustmentType: form.adjustmentType,
      adjustmentValue,
    };

    try {
      if (editingRate) {
        await updateMutation.mutateAsync({
          rateId: editingRate.id,
          roomId,
          payload,
        });
      } else {
        await createMutation.mutateAsync({
          roomId,
          payload,
        });
      }

      resetForm();
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ??
          "Failed to save peak season rate.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingRate) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        rateId: deletingRate.id,
        roomId,
      });

      setDeletingRate(null);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ??
          "Failed to delete peak season rate.",
      );
    }
  };

  return (
    <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to Rooms
          </button>

          <h2 className="text-xl font-bold text-gray-900">
            Peak Season Rates
          </h2>

          <p className="text-sm text-gray-500">{roomName}</p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            <Plus size={16} />
            Add Rate
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-gray-200 p-4"
        >
          <h3 className="font-semibold text-gray-900">
            {editingRate ? "Edit Peak Season Rate" : "Add Peak Season Rate"}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Start Date</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
                className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">End Date</span>
              <input
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
                className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">
                Adjustment Type
              </span>
              <select
                value={form.adjustmentType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    adjustmentType:
                      event.target.value as PeakSeasonAdjustmentType,
                  }))
                }
                className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">
                {form.adjustmentType === "PERCENTAGE"
                  ? "Percentage Value"
                  : "Fixed Amount"}
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.adjustmentValue}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    adjustmentValue: event.target.value,
                  }))
                }
                placeholder={
                  form.adjustmentType === "PERCENTAGE"
                    ? "Example: 15"
                    : "Example: 50000"
                }
                className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : editingRate
                  ? "Update Rate"
                  : "Save Rate"}
            </button>
          </div>
        </form>
      )}

      {ratesQuery.isLoading && (
        <p className="text-sm text-gray-500">Loading peak season rates...</p>
      )}

      {ratesQuery.isError && (
        <p className="text-sm text-red-600">
          Failed to load peak season rates.
        </p>
      )}

      {!ratesQuery.isLoading && rates.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
          <CalendarDays className="mx-auto mb-2 text-gray-400" size={28} />
          <p className="font-medium text-gray-700">
            No peak season rates yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Add a rate to adjust this room's price during a specific period.
          </p>
        </div>
      )}

      {rates.length > 0 && (
        <div className="space-y-3">
          {rates.map((rate) => (
            <div
              key={rate.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 p-4"
            >
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">
                  {formatDate(rate.start_date)} –{" "}
                  {formatDate(rate.end_date)}
                </p>

                <p className="text-sm text-gray-600">
                  {rate.adjustment_type === "PERCENTAGE"
                    ? "Percentage adjustment"
                    : "Fixed amount adjustment"}
                  :{" "}
                  <span className="font-semibold text-gray-900">
                    {formatAdjustment(rate)}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(rate)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingRate(rate)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingRate && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-800">
            Delete this peak season rate?
          </p>

          <p className="mt-1 text-sm text-red-700">
            {formatDate(deletingRate.start_date)} –{" "}
            {formatDate(deletingRate.end_date)}
          </p>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeletingRate(null)}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}