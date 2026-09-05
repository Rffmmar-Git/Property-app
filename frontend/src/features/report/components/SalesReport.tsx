import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import SurfaceCard from "@/components/layout/SurfaceCard";
import Pagination from "@/components/layout/Pagination";
import { SelectField, TextField } from "@/components/layout/FormField";
import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";
import { useSalesReport } from "../hooks/useReport";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID");

export default function SalesReport() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [propertyId, setPropertyId] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: properties = [] } = useTenantProperties();

  const [sortBy, setSortBy] = useState<
    "check_in" | "created_at" | "total_price"
  >("check_in");

  const [order, setOrder] = useState<
    "asc" | "desc"
  >("desc");

    const query = {
    page,
    limit,
    propertyId,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy,
    order,
    };

  const {
    data,
    isLoading,
    isError,
  } = useSalesReport(query);

  const reservations = data?.data ?? [];
  const pagination = data?.pagination;

  const handleApplyFilter = () => {
    setPage(1);
  };

  const handleResetFilter = () => {
  setPropertyId(undefined);
  setStartDate("");
  setEndDate("");
  setSortBy("check_in");
  setOrder("desc");
  setPage(1);
};

  // Chart is derived from whatever reservations are currently loaded
  // (i.e. the current page/filtered result), not a separate all-time
  // aggregate endpoint — labelled accordingly below.
  const revenueByProperty = reservations.reduce<Record<string, number>>(
    (acc, reservation) => {
      const key = reservation.property.name;
      acc[key] = (acc[key] ?? 0) + Number(reservation.totalPrice);
      return acc;
    },
    {},
  );

  const chartData = Object.entries(revenueByProperty).map(
    ([name, revenue]) => ({ name, revenue }),
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-text sm:text-lg">
          Sales Report
        </h2>

        <p className="mt-1 text-xs text-slate-muted">
          View sales and accepted payments from your
          properties.
        </p>
      </div>

      <SurfaceCard className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <SelectField
            id="sales-property"
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
            id="sales-start-date"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
          />

          <TextField
            id="sales-end-date"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(event.target.value)
            }
          />

          <SelectField
            id="sales-sort"
            label="Sort By"
            value={sortBy}
            onChange={(event) => {
              setSortBy(
                event.target.value as
                  | "check_in"
                  | "created_at"
                  | "total_price",
              );
              setPage(1);
            }}
            options={[
              { label: "Check In", value: "check_in" },
              { label: "Created At", value: "created_at" },
              { label: "Total Price", value: "total_price" },
            ]}
          />

          <SelectField
            id="sales-order"
            label="Order"
            value={order}
            onChange={(event) => {
              setOrder(
                event.target.value as
                  | "asc"
                  | "desc",
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

      {!isLoading && !isError && chartData.length > 0 && (
        <SurfaceCard className="p-4 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-text">
            Revenue by property (this page)
          </h3>

          <div className="h-64 w-full text-midnight-indigo">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                    }).format(Number(value))
                  }
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  cursor={{ fill: "rgba(79, 70, 229, 0.06)" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="currentColor"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SurfaceCard>
      )}

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
            Failed to load sales report.
          </div>
        )}

        {!isLoading &&
          !isError &&
          reservations.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-muted">
              No sales data found.
            </div>
          )}

        {!isLoading &&
          !isError &&
          reservations.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-sm">
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
                        Payment
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-4 py-3 font-medium text-slate-text">
                          {reservation.bookingCode}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-text">
                            {reservation.user.fullName}
                          </div>

                          <div className="text-xs text-slate-muted">
                            {reservation.user.email}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-slate-text">
                          {reservation.property.name}
                        </td>

                        <td className="px-4 py-3 text-slate-text">
                          {reservation.room.roomName}
                        </td>

                        <td className="px-4 py-3 text-slate-muted">
                          {formatDate(reservation.checkIn)}
                        </td>

                        <td className="px-4 py-3 text-slate-muted">
                          {formatDate(reservation.checkOut)}
                        </td>

                        <td className="px-4 py-3 text-right font-medium text-midnight-indigo">
                          {formatCurrency(reservation.totalPrice)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Accepted
                          </span>
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