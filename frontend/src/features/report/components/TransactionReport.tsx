import { useState } from "react";
import { Loader2, Search } from "lucide-react";

import SurfaceCard from "@/components/layout/SurfaceCard";
import Pagination from "@/components/layout/Pagination";
import { SelectField, TextField } from "@/components/layout/FormField";
import { useTransactionReport } from "../hooks/useReport";
import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";

const STATUS_STYLES: Record<string, string> = {
  WAITING_PAYMENT: "border-amber-200 bg-amber-50 text-amber-700",
  WAITING_CONFIRMATION: "border-blue-200 bg-blue-50 text-blue-700",
  CONFIRMED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
  COMPLETED: "border-indigo-200 bg-indigo-50 text-indigo-700",
  EXPIRED: "border-slate-200 bg-slate-100 text-slate-600",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID");

export default function TransactionReport() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [propertyId, setPropertyId] = useState<number | undefined>(
    undefined,
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: properties = [] } = useTenantProperties();

  const [sortBy, setSortBy] = useState<
    "created_at" | "booking_code" | "status" | "total_price"
  >("created_at");

  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const query = {
    page,
    limit,
    propertyId,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy,
    order,
  };

  const { data, isLoading, isError } = useTransactionReport(query);

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  const handleApplyFilter = () => {
    setPage(1);
  };

  const handleResetFilter = () => {
    setPropertyId(undefined);
    setStartDate("");
    setEndDate("");
    setSortBy("created_at");
    setOrder("desc");
    setPage(1);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-text sm:text-lg">
          Transaction Report
        </h2>

        <p className="mt-1 text-xs text-slate-muted">
          View all transactions from your properties.
        </p>
      </div>

      <SurfaceCard className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <SelectField
            id="transaction-property"
            label="Property ID"
            value={propertyId ?? ""}
            onChange={(event) => {
              const value = event.target.value;

              setPropertyId(
                value === "" ? undefined : Number(value),
              );
            }}
            options={[
              { label: "All Properties", value: "" },
              ...properties.map((property) => ({
                label: property.name,
                value: String(property.id),
              })),
            ]}
          />

          <TextField
            id="transaction-start-date"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value);
              setPage(1);
            }}
          />

          <TextField
            id="transaction-end-date"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(event) => {
              setEndDate(event.target.value);
              setPage(1);
            }}
          />

          <SelectField
            id="transaction-sort"
            label="Sort By"
            value={sortBy}
            onChange={(event) => {
              setSortBy(
                event.target.value as
                  | "created_at"
                  | "booking_code"
                  | "status"
                  | "total_price",
              );
              setPage(1);
            }}
            options={[
              { label: "Created At", value: "created_at" },
              { label: "Booking Code", value: "booking_code" },
              { label: "Status", value: "status" },
              { label: "Total Price", value: "total_price" },
            ]}
          />

          <SelectField
            id="transaction-order"
            label="Order"
            value={order}
            onChange={(event) => {
              setOrder(
                event.target.value as "asc" | "desc",
              );
              setPage(1);
            }}
            options={[
              { label: "Descending", value: "desc" },
              { label: "Ascending", value: "asc" },
            ]}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleApplyFilter}
            className="inline-flex items-center gap-2 rounded bg-sunrise-amber px-4 py-2 text-xs font-semibold text-slate-text transition hover:bg-amber-500"
          >
            <Search size={14} />
            Apply Filter
          </button>

          <button
            type="button"
            onClick={handleResetFilter}
            className="rounded border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-text transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        {isLoading && (
          <div className="flex items-center justify-center p-10">
            <Loader2
              className="h-6 w-6 animate-spin text-midnight-indigo"
            />
          </div>
        )}

        {isError && !isLoading && (
          <div className="p-6 text-center text-sm text-red-600">
            Failed to load transaction report.
          </div>
        )}

        {!isLoading &&
          !isError &&
          transactions.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-muted">
              No transaction data found.
            </div>
          )}

        {!isLoading &&
          !isError &&
          transactions.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-muted">
                        Booking
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-slate-muted">
                        Customer
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-slate-muted">
                        Property
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-slate-muted">
                        Room
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-slate-muted">
                        Check In
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-slate-muted">
                        Check Out
                      </th>

                      <th className="px-4 py-3 text-right font-medium text-slate-muted">
                        Total
                      </th>

                      <th className="px-4 py-3 text-center font-medium text-slate-muted">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left font-medium text-slate-muted">
                        Created
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3 font-medium text-slate-text">
                          {transaction.bookingCode}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-text">
                            {transaction.user.fullName}
                          </div>

                          <div className="text-xs text-slate-muted">
                            {transaction.user.email}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-slate-text">
                          {transaction.property.name}
                        </td>

                        <td className="px-4 py-3 text-slate-text">
                          {transaction.room.roomName}
                        </td>

                        <td className="px-4 py-3 text-slate-muted">
                          {formatDate(transaction.checkIn)}
                        </td>

                        <td className="px-4 py-3 text-slate-muted">
                          {formatDate(transaction.checkOut)}
                        </td>

                        <td className="px-4 py-3 text-right font-medium text-midnight-indigo">
                          {formatCurrency(transaction.totalPrice)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                              STATUS_STYLES[transaction.status] ??
                              "border-slate-200 bg-slate-100 text-slate-600"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-muted">
                          {formatDate(transaction.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && (
                <div className="border-t border-slate-100 p-4">
                  <Pagination
                    bare
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    itemLabel="transactions"
                    onPrevious={() =>
                      setPage((current) => current - 1)
                    }
                    onNext={() =>
                      setPage((current) => current + 1)
                    }
                  />
                </div>
              )}
            </>
          )}
      </SurfaceCard>
    </section>
  );
}