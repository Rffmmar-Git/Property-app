import {
  Building2,
  Clock3,
  FileBarChart,
  ReceiptText,
} from "lucide-react";
import { Link } from "react-router-dom";

import SurfaceCard from "@/components/layout/SurfaceCard";

import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";
import { useTenantTransactions } from "@/features/payment/hooks/useTenantTransaction";
import { useSalesReport } from "@/features/report/hooks/useReport";

import type { TenantTransactionQuery } from "@/features/payment/types/payment.types";

const transactionQuery: TenantTransactionQuery = {
  page: 1,
  limit: 5,
  sortBy: "created_at",
  order: "desc",
};

const salesQuery = {
  page: 1,
  limit: 10,
  sortBy: "created_at" as const,
  order: "desc" as const,
};

export default function TenantDashboardSummary() {
  const {
    data: propertiesResponse,
    isLoading: isPropertiesLoading,
  } = useTenantProperties({
    page: 1,
    pageSize: 1,
  });

  const {
    data: transactionResponse,
    isLoading: isTransactionsLoading,
  } = useTenantTransactions(transactionQuery);

  const {
    data: salesResponse,
    isLoading: isSalesLoading,
  } = useSalesReport(salesQuery);

  const propertyTotal =
    propertiesResponse?.pagination.totalItems ?? 0;

  const transactionTotal =
    transactionResponse?.pagination.total ?? 0;

  const salesTransactionTotal =
    salesResponse?.pagination.total ?? 0;

  const transactions = transactionResponse?.data ?? [];

  const waitingConfirmationCount = transactions.filter(
    (transaction) =>
      transaction.reservationStatus === "WAITING_CONFIRMATION",
  ).length;

  const needsAttention = waitingConfirmationCount > 0;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SurfaceCard className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-muted">
              Properties
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-text">
              {isPropertiesLoading ? "—" : propertyTotal}
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 p-3">
            <Building2 className="h-5 w-5 text-slate-text" />
          </div>
        </div>

        <Link
          to="/tenant/properties"
          className="mt-4 inline-flex items-center text-sm font-medium text-midnight-indigo hover:text-blue-800"
        >
          Manage properties
        </Link>
      </SurfaceCard>

      <SurfaceCard className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-muted">
              Transactions
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-text">
              {isTransactionsLoading ? "—" : transactionTotal}
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 p-3">
            <ReceiptText className="h-5 w-5 text-slate-text" />
          </div>
        </div>

        <Link
          to="/tenant/transactions"
          className="mt-4 inline-flex items-center text-sm font-medium text-midnight-indigo hover:text-blue-800"
        >
          View transactions
        </Link>
      </SurfaceCard>

      <SurfaceCard className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-muted">
              Sales Transactions
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-text">
              {isSalesLoading ? "—" : salesTransactionTotal}
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 p-3">
            <FileBarChart className="h-5 w-5 text-slate-text" />
          </div>
        </div>

        <Link
          to="/tenant/reports"
          className="mt-4 inline-flex items-center text-sm font-medium text-midnight-indigo hover:text-blue-800"
        >
          View reports
        </Link>
      </SurfaceCard>

      <SurfaceCard
        className={`p-5 ${
          needsAttention
            ? "border-l-4 border-l-sunrise-amber"
            : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-muted">
              Needs Attention
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-text">
              {isTransactionsLoading
                ? "—"
                : waitingConfirmationCount}
            </p>
          </div>

          <div
            className={`rounded-xl p-3 ${
              needsAttention
                ? "bg-sunrise-amber/10"
                : "bg-slate-100"
            }`}
          >
            <Clock3
              className={`h-5 w-5 ${
                needsAttention
                  ? "text-sunrise-amber"
                  : "text-slate-text"
              }`}
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-muted">
          Waiting for payment confirmation
        </p>
      </SurfaceCard>
    </section>
  );
}