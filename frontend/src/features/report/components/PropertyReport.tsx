import { useState } from "react";
import { Loader2, Search } from "lucide-react";

import SurfaceCard from "@/components/layout/SurfaceCard";
import { SelectField, TextField } from "@/components/layout/FormField";
import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";
import { usePropertyReport } from "../hooks/useReport";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID");

const MONTH_OPTIONS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export default function PropertyReport() {
  const [propertyId, setPropertyId] = useState<number | undefined>(
    undefined,
  );
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const { data: properties = [] } = useTenantProperties();
  const query = {
    propertyId,
    month,
    year,
  };

  const {
    data,
    isLoading,
    isError,
  } = usePropertyReport(query);

  const handleApplyFilter = () => {
    if (month !== undefined && year === undefined) {
      return;
    }

    if (year !== undefined && month === undefined) {
      return;
    }
  };

  const handleResetFilter = () => {
    setPropertyId(undefined);
    setMonth(undefined);
    setYear(undefined);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-text sm:text-lg">
          Property Report
        </h2>

        <p className="mt-1 text-xs text-slate-muted">
          View room availability across your properties.
        </p>
      </div>

      <SurfaceCard className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            id="property-report-property"
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

          <SelectField
            id="property-report-month"
            label="Month"
            value={month ?? ""}
            onChange={(event) => {
              const value = event.target.value;

              setMonth(
                value === "" ? undefined : Number(value),
              );
            }}
            options={[
              { label: "All months", value: "" },
              ...MONTH_OPTIONS,
            ]}
          />

          <TextField
            id="property-report-year"
            label="Year"
            type="number"
            min="2000"
            placeholder="All years"
            value={year ?? ""}
            onChange={(event) => {
              const value = event.target.value;

              setYear(
                value === "" ? undefined : Number(value),
              );
            }}
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
            Failed to load property report.
          </div>
        )}

        {!isLoading &&
          !isError &&
          (!data || data.length === 0) && (
            <div className="p-10 text-center text-sm text-slate-muted">
              No property availability data found.
            </div>
          )}

        {!isLoading &&
          !isError &&
          data &&
          data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-muted">
                      Property
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-slate-muted">
                      Room
                    </th>

                    <th className="px-4 py-3 text-left font-medium text-slate-muted">
                      Date
                    </th>

                    <th className="px-4 py-3 text-center font-medium text-slate-muted">
                      Total Rooms
                    </th>

                    <th className="px-4 py-3 text-center font-medium text-slate-muted">
                      Available
                    </th>

                    <th className="px-4 py-3 text-right font-medium text-slate-muted">
                      Base Price
                    </th>

                    <th className="px-4 py-3 text-center font-medium text-slate-muted">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-text">
                          {item.property.name}
                        </div>

                        <div className="text-xs text-slate-muted">
                          ID: {item.property.id}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-text">
                        {item.room.roomName}
                      </td>

                      <td className="px-4 py-3 text-slate-muted">
                        {formatDate(item.availableDate)}
                      </td>

                      <td className="px-4 py-3 text-center text-slate-text">
                        {item.room.totalRooms}
                      </td>

                      <td className="px-4 py-3 text-center font-medium text-slate-text">
                        {item.availableRooms}
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-midnight-indigo">
                        {formatCurrency(item.room.basePrice)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {item.isClosed ? (
                          <div>
                            <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                              Closed
                            </span>

                            {item.closureReason && (
                              <p className="mt-1 text-xs text-slate-muted">
                                {item.closureReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </SurfaceCard>
    </section>
  );
}