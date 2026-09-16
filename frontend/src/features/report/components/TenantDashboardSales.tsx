import { FileBarChart } from "lucide-react";
import DashboardSectionCard from "@/components/layout/DashboardSectionCard";
import { useSalesReport } from "@/features/report/hooks/useReport";

const salesQuery = {
  page: 1,
  limit: 10,
  sortBy: "created_at" as const,
  order: "desc" as const,
};

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export default function TenantDashboardSales() {
  const { data: salesResponse, isLoading, isError } = useSalesReport(salesQuery);
  const sales = salesResponse?.data ?? [];

  return (
    <DashboardSectionCard
      title="Recent Sales"
      description="Latest accepted payment records from your sales report"
      actionLabel="Full report"
      actionTo="/tenant/reports"
    >
      {isLoading && (
        <div className="px-5 py-10 text-center text-sm text-slate-muted">
          Loading sales...
        </div>
      )}

      {isError && (
        <div className="px-5 py-10 text-center text-sm text-red-600">
          Failed to load sales.
        </div>
      )}

      {!isLoading && !isError && sales.length === 0 && (
        <div className="px-5 py-10 text-center">
          <FileBarChart className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-text">No sales records yet</p>
          <p className="mt-1 text-sm text-slate-muted">Accepted sales will appear here.</p>
        </div>
      )}

      {!isLoading && !isError && sales.length > 0 && (
        <div className="divide-y divide-slate-100">
          {sales.slice(0, 5).map((sale) => (
            <div
              key={sale.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-text">{sale.bookingCode}</p>
                <p className="mt-1 truncate text-sm text-slate-muted">
                  {sale.property.name} · {sale.room.roomName}
                </p>
                <p className="mt-1 text-xs text-slate-muted">
                  {sale.user.fullName} · {formatDate(sale.checkIn)}
                </p>
              </div>

              <div className="shrink-0">
                <p className="text-sm font-semibold text-midnight-indigo sm:text-right">
                  {formatCurrency(sale.totalPrice)}
                </p>
                <p className="mt-1 text-xs text-slate-muted sm:text-right">
                  {sale.payment?.status ?? "No payment"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSectionCard>
  );
}