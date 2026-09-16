import { ReceiptText } from "lucide-react";

import DashboardSectionCard from "@/components/layout/DashboardSectionCard";
import { useTenantTransactions } from "../hooks/useTenantTransaction";
import type { TenantTransactionQuery } from "@/features/payment/types/payment.types";

const transactionQuery: TenantTransactionQuery = {
  page: 1,
  limit: 5,
  sortBy: "created_at",
  order: "desc",
};

const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    WAITING_PAYMENT: "Waiting Payment",
    WAITING_CONFIRMATION: "Waiting Confirmation",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
    EXPIRED: "Expired",
  };

  return labels[status] ?? status;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "CONFIRMED":
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";

    case "WAITING_CONFIRMATION":
    case "WAITING_PAYMENT":
      return "bg-sunrise-amber/10 text-sunrise-amber";

    case "CANCELLED":
    case "EXPIRED":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-text";
  }
};

export default function TenantDashboardTransaction() {
  const {
    data: transactionResponse,
    isLoading,
    isError,
  } = useTenantTransactions(transactionQuery);

  const transactions = transactionResponse?.data ?? [];

  return (
    <DashboardSectionCard
      title="Recent Transactions"
      description="Your latest tenant transactions"
      actionLabel="View all"
      actionTo="/tenant/transactions"
    >
      {isLoading && (
        <div className="px-5 py-10 text-center text-sm text-slate-muted">
          Loading transactions...
        </div>
      )}

      {isError && (
        <div className="px-5 py-10 text-center text-sm text-red-600">
          Failed to load transactions.
        </div>
      )}

      {!isLoading && !isError && transactions.length === 0 && (
        <div className="px-5 py-10 text-center">
          <ReceiptText className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm font-medium text-slate-text">
            No transactions yet
          </p>

          <p className="mt-1 text-sm text-slate-muted">
            Transactions will appear here when customers make reservations.
          </p>
        </div>
      )}

      {!isLoading && !isError && transactions.length > 0 && (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Booking
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Property
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Check In
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Total
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-text">
                        {transaction.bookingCode}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-muted">
                        {transaction.customerName}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-[180px] truncate text-sm text-slate-muted">
                        {transaction.propertyName}
                      </p>
                      <p className="mt-1 text-xs text-slate-muted">
                        {transaction.roomName}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-muted">
                      {formatDate(transaction.checkInDate)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-midnight-indigo">
                      {formatCurrency(transaction.totalPrice)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          transaction.reservationStatus,
                        )}`}
                      >
                        {getStatusLabel(transaction.reservationStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-text">
                      {transaction.bookingCode}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-muted">
                      {transaction.propertyName}
                    </p>
                    <p className="mt-1 text-xs text-slate-muted">
                      {transaction.roomName}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                      transaction.reservationStatus,
                    )}`}
                  >
                    {getStatusLabel(transaction.reservationStatus)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-muted">
                    {formatDate(transaction.checkInDate)}
                  </span>
                  <span className="font-semibold text-midnight-indigo">
                    {formatCurrency(transaction.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardSectionCard>
  );
}