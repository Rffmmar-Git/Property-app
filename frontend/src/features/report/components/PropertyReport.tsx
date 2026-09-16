import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import SurfaceCard from "@/components/layout/SurfaceCard";
import { SelectField } from "@/components/layout/FormField";
import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";
import { usePropertyReport } from "@/features/report/hooks/useReport";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const MONTH_OPTIONS = [
  { label: "January", value: "1" }, { label: "February", value: "2" },
  { label: "March", value: "3" }, { label: "April", value: "4" },
  { label: "May", value: "5" }, { label: "June", value: "6" },
  { label: "July", value: "7" }, { label: "August", value: "8" },
  { label: "September", value: "9" }, { label: "October", value: "10" },
  { label: "November", value: "11" }, { label: "December", value: "12" },
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayStatus = "available" | "booked-out" | "closed" | "no-data";

type PropertyReportRecord = {
  isClosed: boolean;
  availableRooms: number;
  closureReason?: string | null;
};

function getDayStatus(record?: PropertyReportRecord): DayStatus {
  if (!record) return "no-data";
  if (record.isClosed) return "closed";
  if (record.availableRooms <= 0) return "booked-out";
  return "available";
}

const DAY_STATUS_STYLES: Record <
  DayStatus,
  { cell: string; dot: string; text: string; label: string }
> = {
  available: {
    cell: "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-50",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    label: "Available",
  },
  "booked-out": {
    cell: "border-amber-200 bg-amber-50/70 hover:bg-amber-50",
    dot: "bg-amber-500",
    text: "text-amber-700",
    label: "Fully booked",
  },
  closed: {
    cell: "border-rose-200 bg-rose-50/70 hover:bg-rose-50",
    dot: "bg-rose-500",
    text: "text-rose-700",
    label: "Closed",
  },
  "no-data": {
    cell: "border-slate-100 bg-slate-50",
    dot: "bg-slate-300",
    text: "text-slate-300",
    label: "No data",
  },
};

function buildCalendarCells(year: number, month: number) {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-muted">
      {(Object.keys(DAY_STATUS_STYLES) as DayStatus[]).map((status) => (
        <span key={status} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${DAY_STATUS_STYLES[status].dot}`} />
          {DAY_STATUS_STYLES[status].label}
        </span>
      ))}
    </div>
  );
}

export default function PropertyReport() {
  const today = new Date();

  const [propertyId, setPropertyId] = useState<number | undefined>(undefined);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const { data: properties = [] } = useTenantProperties();

  const { data, isLoading, isError } = usePropertyReport({ propertyId, month, year });

  const roomCalendars = useMemo(() => {
    if (!data) return [];

    const groups = new Map <
      string,
      {
        property: { id: number; name: string };
        room: { id: number; roomName: string; totalRooms: number; basePrice: number };
        byDate: Map<string, (typeof data)[number]>;
      }
    >();

    data.forEach((item) => {
      const key = `${item.property.id}-${item.room.id}`;
      if (!groups.has(key)) {
        groups.set(key, { property: item.property, room: item.room, byDate: new Map() });
      }
      groups.get(key)!.byDate.set(item.availableDate.slice(0, 10), item);
    });

    return Array.from(groups.values());
  }, [data]);

  const cells = buildCalendarCells(year, month);

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const handleResetFilter = () => {
    setPropertyId(undefined);
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-text sm:text-lg">Property Report</h2>
        <p className="mt-1 text-xs text-slate-muted">
          View room availability across your properties in a calendar view.
        </p>
      </div>

      <SurfaceCard className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            id="property-report-property"
            label="Property"
            value={propertyId ?? ""}
            onChange={(e) => setPropertyId(e.target.value === "" ? undefined : Number(e.target.value))}
            options={[
              { label: "All Properties", value: "" },
              ...properties.map((p) => ({ label: p.name, value: String(p.id) })),
            ]}
          />

          <SelectField
            id="property-report-month"
            label="Month"
            value={String(month)}
            onChange={(e) => setMonth(Number(e.target.value))}
            options={MONTH_OPTIONS}
          />

          <SelectField
            id="property-report-year"
            label="Year"
            value={String(year)}
            onChange={(e) => setYear(Number(e.target.value))}
            options={Array.from({ length: 6 }, (_, i) => {
              const v = today.getFullYear() - 2 + i;
              return { label: String(v), value: String(v) };
            })}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button type="button" onClick={handlePrevMonth} aria-label="Previous month"
              className="rounded border border-slate-200 bg-white p-2 text-slate-text hover:bg-slate-50">
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-semibold text-slate-text">
              {MONTH_OPTIONS[month - 1].label} {year}
            </span>
            <button type="button" onClick={handleNextMonth} aria-label="Next month"
              className="rounded border border-slate-200 bg-white p-2 text-slate-text hover:bg-slate-50">
              <ChevronRight size={14} />
            </button>
          </div>

          <button type="button" onClick={handleResetFilter}
            className="rounded border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-text hover:bg-slate-50">
            Reset
          </button>
        </div>
      </SurfaceCard>

      {!isLoading && !isError && roomCalendars.length > 0 && (
        <SurfaceCard className="p-4">
          <CalendarLegend />
        </SurfaceCard>
      )}

      {isLoading && (
        <SurfaceCard className="flex items-center justify-center p-10">
          <Loader2 className="h-6 w-6 animate-spin text-midnight-indigo" />
        </SurfaceCard>
      )}

      {isError && !isLoading && (
        <SurfaceCard className="p-6 text-center text-sm text-red-600">
          Failed to load property report.
        </SurfaceCard>
      )}

      {!isLoading && !isError && roomCalendars.length === 0 && (
        <SurfaceCard className="p-10 text-center text-sm text-slate-muted">
          No property availability data found.
        </SurfaceCard>
      )}

      {!isLoading && !isError && roomCalendars.map((group) => (
        <SurfaceCard key={`${group.property.id}-${group.room.id}`} className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-text">{group.property.name}</h3>
            <p className="text-xs text-slate-muted">
              {group.room.roomName} · {group.room.totalRooms} rooms · {formatCurrency(group.room.basePrice)}/night
            </p>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-slate-muted">
            {WEEKDAY_LABELS.map((label) => <div key={label} className="py-1">{label}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, index) => {
              if (day === null) return <div key={index} className="aspect-square rounded-lg" />;

              const record = group.byDate.get(toDateKey(year, month, day));
              const status = getDayStatus(record);
              const style = DAY_STATUS_STYLES[status];

              return (
                <div
                  key={index}
                  title={
                    status === "closed"
                      ? record?.closureReason ?? "Closed"
                      : status === "available"
                        ? `${record?.availableRooms} room(s) available`
                        : style.label
                  }
                  className={`flex aspect-square flex-col justify-between rounded-lg border p-1.5 text-left transition-colors ${style.cell}`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        status === "no-data" ? "text-slate-300" : "text-slate-text"
                      }`}
                    >
                      {day}
                    </span>
                    <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                  </div>

                  {record && (
                    <span className={`text-[10px] font-medium leading-tight ${style.text}`}>
                      {status === "closed"
                        ? "Closed"
                        : status === "booked-out"
                          ? "Booked out"
                          : `${record.availableRooms} left`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </SurfaceCard>
      ))}
    </section>
  );
}