import { useState } from "react";
import { Search } from "lucide-react";

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

  const confirmMutation =
    useConfirmPayment();

  const rejectMutation =
    useRejectPayment();

  const [selectedProof, setSelectedProof] =
    useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] =
    useState<string | null>(null);

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
                { label: "All payment statuses", value: "" },
                { label: "Pending", value: "PENDING" },
                { label: "Accepted", value: "ACCEPTED" },
                { label: "Rejected", value: "REJECTED" },
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
                { label: "All reservation statuses", value: "" },
                { label: "Waiting Payment", value: "WAITING_PAYMENT" },
                {
                  label: "Waiting Confirmation",
                  value: "WAITING_CONFIRMATION",
                },
                { label: "Confirmed", value: "CONFIRMED" },
                { label: "Cancelled", value: "CANCELLED" },
                { label: "Completed", value: "COMPLETED" },
                { label: "Expired", value: "EXPIRED" },
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
                  event.target
                    .value as TenantTransactionQuery["sortBy"]
                )
              }
              options={[
                { label: "Created Date", value: "created_at" },
                { label: "Booking Code", value: "booking_code" },
                { label: "Total Price", value: "total_price" },
                { label: "Check-in Date", value: "check_in" },
                { label: "Check-out Date", value: "check_out" },
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
                { label: "Newest", value: "desc" },
                { label: "Oldest", value: "asc" },
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
              {transactions.map(
                (transaction) => (
                  <SurfaceCard
                    key={transaction.id}
                    hoverLift
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                        </div>

                        <PaymentStatusBadge
                          status={
                            transaction.paymentStatus
                          }
                        />
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      </div>
                    </div>

                    {transaction.reservationStatus ===
                      "WAITING_CONFIRMATION" && (
                      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:justify-end">
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
                  </SurfaceCard>
                )
              )}
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