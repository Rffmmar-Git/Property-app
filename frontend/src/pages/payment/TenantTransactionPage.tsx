import { useState } from "react";
import { Search } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { TenantMobileHeader } from "@/components/layout/TenantMobileHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { TenantMobileBottomNav } from "@/components/layout/TenantMobileBottomNav";
import PageHeader from "@/components/layout/PageHeader";
import SurfaceCard from "@/components/layout/SurfaceCard";
import { TextField, SelectField } from "@/components/layout/FormField";
import EmptyState from "@/components/layout/EmptyState";
import ErrorState from "@/components/layout/ErrorState";
import Pagination from "@/components/layout/Pagination";
import ImagePreviewModal from "@/components/layout/ImagepreviewModal";
import PaymentStatusBadge from "@/features/payment/hooks/PaymentStatusBadge";
import {
  useConfirmPayment,
  useRejectPayment,
  useTenantTransactions,
} from "@/features/payment/hooks/useTenantTransaction";

import type {
  TenantTransactionQuery,
} from "@/features/payment/types/payment.types";

import type { PaymentStatus } from "@/types/payment";
import type { ReservationStatus } from "@/types/reservation";

const formatDate = (date: string) => {
  return date.split("T")[0];
};

const formatPrice = (price: string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price));
};

const formatDeadline = (date: string | null) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

// Single source of truth for payment-status color/label, shared by the
// donut chart, its legend, and each transaction card's left accent.
const STATUS_META: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "#f59e0b" },
  ACCEPTED: { label: "Accepted", color: "#10b981" },
  REJECTED: { label: "Rejected", color: "#f43f5e" },
};

const FALLBACK_COLOR = "#94a3b8";

export default function TenantTransactionPage() {
  const [search, setSearch] = useState("");

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus | "">("");

  const [reservationStatus, setReservationStatus] =
    useState<ReservationStatus | "">("");

  const [sortBy, setSortBy] =
    useState<TenantTransactionQuery["sortBy"]>(
      "created_at"
    );

  const [order, setOrder] =
    useState<TenantTransactionQuery["order"]>(
      "desc"
    );

  const [page, setPage] = useState(1);

  const limit = 10;

  const query: TenantTransactionQuery = {
    page,
    limit,
    search: search.trim() || undefined,
    paymentStatus:
      paymentStatus || undefined,
    reservationStatus:
      reservationStatus || undefined,
    sortBy,
    order,
  };

  const {
    data,
    isLoading,
    isError,
  } = useTenantTransactions(query);

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  // Payment-status breakdown for the donut chart, derived from whatever
  // page/filtered result is currently loaded (labelled "this page" below,
  // since it isn't a separate all-time aggregate).
  const statusCounts = transactions.reduce<Record<string, number>>(
    (acc, transaction) => {
      acc[transaction.paymentStatus] =
        (acc[transaction.paymentStatus] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    label: STATUS_META[status]?.label ?? status,
    color: STATUS_META[status]?.color ?? FALLBACK_COLOR,
    count,
  }));

  const confirmMutation =
    useConfirmPayment();

  const rejectMutation =
    useRejectPayment();

  const [selectedProof, setSelectedProof] =
    useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] =
    useState<string | null>(null);

  const [expandedBooking, setExpandedBooking] =
    useState<number | null>(null);

  const handleConfirm = (
    reservationId: number
  ) => {
    if (
      confirmMutation.isPending ||
      rejectMutation.isPending
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve this payment?"
    );

    if (!confirmed) return;

    confirmMutation.mutate(reservationId);
  };

  const handleReject = (
    reservationId: number
  ) => {
    if (
      confirmMutation.isPending ||
      rejectMutation.isPending
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this payment?"
    );

    if (!confirmed) return;

    rejectMutation.mutate(reservationId);
  };

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handlePaymentStatusChange = (
    value: PaymentStatus | ""
  ) => {
    setPaymentStatus(value);
    setPage(1);
  };

  const handleReservationStatusChange = (
    value: ReservationStatus | ""
  ) => {
    setReservationStatus(value);
    setPage(1);
  };

  const handleSortChange = (
    value: TenantTransactionQuery["sortBy"]
  ) => {
    setSortBy(value);
    setPage(1);
  };

  const handleOrderChange = (
    value: TenantTransactionQuery["order"]
  ) => {
    setOrder(value);
    setPage(1);
  };

  const handleToggleBooking = (
    reservationId: number
  ) => {
    setExpandedBooking((current) =>
      current === reservationId
        ? null
        : reservationId
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface pb-24 md:pb-12">
      <div className="hidden md:block">
        <TenantHeader />
      </div>

      <div className="md:hidden">
        <TenantMobileHeader />
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Transaction Management"
          description="Review and manage customer payment confirmations."
        />

        {!isLoading && !isError && chartData.length > 0 && (
          <SurfaceCard className="mb-6 p-4 sm:p-6">
            <h2 className="mb-4 text-sm font-semibold text-slate-text">
              Payment status overview{" "}
              <span className="font-normal text-slate-muted">
                (this page)
              </span>
            </h2>

            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-40 w-40 shrink-0">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="label"
                      innerRadius={52}
                      outerRadius={72}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) => [
                        `${value}`,
                        "Transactions",
                      ]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-slate-text">
                    {transactions.length}
                  </span>

                  <span className="text-[9px] text-slate-muted">
                    Total
                  </span>
                </div>
              </div>

              <div className="w-full flex-1 space-y-2">
                {chartData.map((entry) => {
                  const percentage =
                    transactions.length === 0
                      ? 0
                      : Math.round(
                          (entry.count /
                            transactions.length) *
                            100
                        );

                  return (
                    <div
                      key={entry.status}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: entry.color,
                          }}
                        />

                        <span className="text-slate-text">
                          {entry.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-text">
                          {entry.count}
                        </span>

                        <span className="text-slate-muted">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SurfaceCard>
        )}

        {/* Search & Filters */}
        <SurfaceCard className="mb-6 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <TextField
                id="transaction-search"
                label="Search"
                icon={<Search size={14} />}
                value={search}
                onChange={(event) =>
                  handleSearchChange(
                    event.target.value
                  )
                }
                placeholder="Booking code or customer name"
              />
            </div>

            <SelectField
              id="payment-status"
              label="Payment Status"
              value={paymentStatus}
              onChange={(event) =>
                handlePaymentStatusChange(
                  event.target.value as PaymentStatus | ""
                )
              }
              options={[
                {
                  label: "All payment statuses",
                  value: "",
                },
                {
                  label: "Pending",
                  value: "PENDING",
                },
                {
                  label: "Accepted",
                  value: "ACCEPTED",
                },
                {
                  label: "Rejected",
                  value: "REJECTED",
                },
              ]}
            />

            <SelectField
              id="reservation-status"
              label="Reservation Status"
              value={reservationStatus}
              onChange={(event) =>
                handleReservationStatusChange(
                  event.target.value as ReservationStatus | ""
                )
              }
              options={[
                {
                  label: "All reservation statuses",
                  value: "",
                },
                {
                  label: "Waiting Payment",
                  value: "WAITING_PAYMENT",
                },
                {
                  label: "Waiting Confirmation",
                  value: "WAITING_CONFIRMATION",
                },
                {
                  label: "Confirmed",
                  value: "CONFIRMED",
                },
                {
                  label: "Cancelled",
                  value: "CANCELLED",
                },
                {
                  label: "Completed",
                  value: "COMPLETED",
                },
                {
                  label: "Expired",
                  value: "EXPIRED",
                },
              ]}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SelectField
              id="sort-by"
              label="Sort By"
              value={sortBy}
              onChange={(event) =>
                handleSortChange(
                  event.target.value as TenantTransactionQuery["sortBy"]
                )
              }
              options={[
                {
                  label: "Created Date",
                  value: "created_at",
                },
                {
                  label: "Booking Code",
                  value: "booking_code",
                },
                {
                  label: "Total Price",
                  value: "total_price",
                },
                {
                  label: "Check-in Date",
                  value: "check_in",
                },
                {
                  label: "Check-out Date",
                  value: "check_out",
                },
              ]}
            />

            <SelectField
              id="sort-order"
              label="Order"
              value={order}
              onChange={(event) =>
                handleOrderChange(
                  event.target.value as "asc" | "desc"
                )
              }
              options={[
                {
                  label: "Newest",
                  value: "desc",
                },
                {
                  label: "Oldest",
                  value: "asc",
                },
              ]}
            />
          </div>
        </SurfaceCard>

        {isLoading && (
          <SurfaceCard className="p-8 text-center">
            <p className="text-xs text-slate-muted">
              Loading transactions...
            </p>
          </SurfaceCard>
        )}

        {isError && (
          <ErrorState
            title="Failed to load transactions."
            description="Please try again later."
          />
        )}

        {!isLoading &&
          !isError &&
          transactions.length === 0 && (
            <EmptyState
              title="No transactions found"
              description="Try changing your search or filters."
            />
          )}

        {!isLoading &&
          !isError &&
          transactions.length > 0 && (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const isExpanded =
                  expandedBooking === transaction.id;

                const needsAction =
                  transaction.reservationStatus ===
                  "WAITING_CONFIRMATION";

                return (
                  <SurfaceCard
                    key={transaction.id}
                    hoverLift
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor:
                        STATUS_META[
                          transaction.paymentStatus
                        ]?.color ??
                        FALLBACK_COLOR,
                    }}
                  >
                    <div className="p-5 sm:p-6">
                      {/* Compact Booking Card */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[9px] text-slate-muted">
                            Booking
                          </p>

                          <h2 className="mt-1 text-sm font-semibold text-slate-text">
                            {transaction.bookingCode}
                          </h2>

                          <p className="mt-1 text-[10px] text-slate-muted">
                            {transaction.customerName}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-muted">
                            {transaction.propertyName} •{" "}
                            {transaction.roomName}
                          </p>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <div className="flex items-center gap-3">
                            {needsAction && (
                              <span className="rounded-full bg-amber-50 px-3 py-1 text-[9px] font-semibold text-amber-700">
                                Waiting Action
                              </span>
                            )}

                            <PaymentStatusBadge
                              status={
                                transaction.paymentStatus
                              }
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleBooking(
                                transaction.id
                              )
                            }
                            className="rounded border border-slate-200 bg-white px-4 py-2 text-[10px] font-semibold text-midnight-indigo transition hover:bg-slate-50"
                          >
                            Booking Detail
                          </button>
                        </div>
                      </div>

                      {/* Booking Detail */}
                      {isExpanded && (
                        <>
                          <div className="mt-5 border-t border-slate-100 pt-5">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[9px] font-semibold text-slate-muted">
                                Booking Details
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleBooking(
                                    transaction.id
                                  )
                                }
                                className="text-[10px] font-medium text-midnight-indigo transition hover:underline"
                              >
                                Hide Booking
                              </button>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <p className="text-[9px] text-slate-muted">
                                  Property
                                </p>

                                <p className="mt-1 text-[10px] font-medium text-slate-text">
                                  {transaction.propertyName}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] text-slate-muted">
                                  Room
                                </p>

                                <p className="mt-1 text-[10px] font-medium text-slate-text">
                                  {transaction.roomName}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] text-slate-muted">
                                  Stay
                                </p>

                                <p className="mt-1 text-[10px] font-medium text-slate-text">
                                  {formatDate(
                                    transaction.checkInDate
                                  )}
                                  {" – "}
                                  {formatDate(
                                    transaction.checkOutDate
                                  )}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] text-slate-muted">
                                  Guests
                                </p>

                                <p className="mt-1 text-[10px] font-medium text-slate-text">
                                  {transaction.guestCount}{" "}
                                  guests
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] text-slate-muted">
                                  Total Payment
                                </p>

                                <p className="mt-1 text-[10px] font-semibold text-midnight-indigo">
                                  {formatPrice(
                                    transaction.totalPrice
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 border-t border-slate-100 pt-5">
                              <p className="text-[9px] text-slate-muted">
                                Payment Proof
                              </p>

                              {transaction.reservationStatus ===
                              "WAITING_PAYMENT" ? (
                                <div className="mt-2">
                                  <p className="text-[10px] text-slate-muted">
                                    Customer has not uploaded payment proof yet.
                                  </p>

                                  <p className="mt-2 text-[10px] text-slate-muted">
                                    Payment deadline:{" "}
                                    <span className="font-medium text-slate-text">
                                      {formatDeadline(
                                        transaction.bookingExpiredAt
                                      )}
                                    </span>
                                  </p>
                                </div>
                              ) : transaction.paymentStatus ===
                                "REJECTED" ? (
                                <p className="mt-2 text-[10px] text-red-500">
                                  Payment proof was rejected.
                                </p>
                              ) : transaction.paymentProof ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProof(
                                      transaction.paymentProof
                                    );
                                    setSelectedBooking(
                                      transaction.bookingCode
                                    );
                                  }}
                                  className="mt-2 text-[10px] font-medium text-midnight-indigo transition hover:underline"
                                >
                                  View payment proof
                                </button>
                              ) : (
                                <p className="mt-2 text-[10px] text-slate-muted">
                                  No payment proof available.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action only for bookings waiting for tenant action */}
                          {needsAction && (
                            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:justify-end">
                              <button
                                type="button"
                                disabled={
                                  confirmMutation.isPending ||
                                  rejectMutation.isPending
                                }
                                onClick={() =>
                                  handleReject(
                                    transaction.id
                                  )
                                }
                                className="rounded border border-red-200 bg-white px-5 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {rejectMutation.isPending
                                  ? "Processing..."
                                  : "Reject"}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  confirmMutation.isPending ||
                                  rejectMutation.isPending
                                }
                                onClick={() =>
                                  handleConfirm(
                                    transaction.id
                                  )
                                }
                                className="rounded bg-sunrise-amber px-5 py-3 text-xs font-semibold text-slate-text transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {confirmMutation.isPending
                                  ? "Processing..."
                                  : "Approve"}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>
          )}

        {/* Pagination */}
        {!isLoading &&
          !isError &&
          pagination &&
          pagination.totalPages > 1 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPrevious={() =>
                setPage((current) =>
                  Math.max(current - 1, 1)
                )
              }
              onNext={() =>
                setPage((current) =>
                  Math.min(
                    current + 1,
                    pagination.totalPages
                  )
                )
              }
            />
          )}
      </main>

      {selectedProof && (
        <ImagePreviewModal
          imageUrl={selectedProof}
          title={
            selectedBooking
              ? `Payment Proof — ${selectedBooking}`
              : "Payment Proof"
          }
          onClose={() => {
            setSelectedProof(null);
            setSelectedBooking(null);
          }}
        />
      )}

      <TenantMobileBottomNav />
    </div>
  );
}