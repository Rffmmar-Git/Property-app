import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getReservationById } from "@/features/reservation/api/reservation.api";
import { PaymentStatusBadge } from "@/features/payment/components/PaymentStatusBadge";
import { Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";


export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const parsedId = id ? Number(id) : undefined;
  const formatDate = (date: string) => {
    return date.split("T")[0];
    };

  const { data: reservation, isLoading, isError, error } = useQuery({
    queryKey: ["reservation-detail", parsedId],
    queryFn: () => getReservationById(parsedId!),
    enabled: !!parsedId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-midnight-indigo" />
      </div>
    );
  }

  if (isError || !reservation) 
    { 
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-xl font-bold text-slate-900">Reservation Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">
          {(error as Error)?.message || "The reservation you are looking for does not exist."}
        </p>
        <button
          onClick={() => navigate("/my-reservations")}
          className="mt-6 rounded-lg bg-midnight-indigo px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Back to My Reservations
        </button>
      </div>
    );
  }

  const renderStatusBadge = (status: typeof reservation.reservationStatus) => {
    switch (status) {
      case "WAITING_PAYMENT":
        return <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">Waiting Payment</span>;
      case "WAITING_CONFIRMATION":
        return <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">Waiting Confirmation</span>;
      case "CONFIRMED":
        return <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">Confirmed</span>;
      case "CANCELLED":
        return <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200">Cancelled</span>;
      case "COMPLETED":
        return <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">Completed</span>;
      case "EXPIRED":
        return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">Expired</span>;
      default:
        return null;
    }
  };

  return (
      <div className="flex min-h-screen flex-col bg-slate-50 pb-24 md:pb-12">
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="block md:hidden">
        <MobileHeader />
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/my-reservations")}
          className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Reservations
        </button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reservation Detail</h1>
            <p className="text-sm text-slate-500">Booking Code: <span className="font-semibold text-slate-700">{reservation.bookingCode}</span></p>
          </div>
          <div>
            {renderStatusBadge(reservation.reservationStatus)}</div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Property & Room</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Property Name</p>
                <p className="font-semibold text-slate-800 mt-1">{reservation.propertyName}</p>
              </div>
              <div>
                <p className="text-slate-500">Room Name</p>
                <p className="font-semibold text-slate-800 mt-1">{reservation.roomName}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Stay Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Check-in Date</p>
                <p className="font-semibold text-slate-800 mt-1">
                {formatDate(reservation.checkInDate)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Check-out Date</p>
                <p className="font-semibold text-slate-800 mt-1">
                {formatDate(reservation.checkOutDate)}
                </p>              
                </div>
              <div>
                <p className="text-slate-500">Guest Count</p>
                <p className="font-semibold text-slate-800 mt-1">{reservation.guestCount} Guest(s)</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
                Payment Summary
            </h2>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-sm">
                <span className="text-slate-500">Payment Status</span>

                {reservation.paymentStatus ? (
                <PaymentStatusBadge status={reservation.paymentStatus} />
                ) : (
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Not Uploaded
                </span>
                )}
            </div>

        {reservation.paymentProof && (
        <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900">
                Payment Proof
            </p>
            <p className="text-xs text-slate-500">
                Your uploaded payment proof
            </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
                src={reservation.paymentProof}
                alt="Payment proof"
                className="max-h-[420px] w-full object-contain"
            />
            </div>
        </div>
        )}

        <div className="mt-5 flex items-center justify-between text-base font-bold text-slate-900">
            <span>Total Price</span>

            <span className="text-midnight-indigo">
            Rp{" "}
            {new Intl.NumberFormat("id-ID").format(
                Number(reservation.totalPrice)
            )}
            </span>
        </div>
        </div>

          {reservation.reservationStatus === "WAITING_PAYMENT" && (
            <div className="flex justify-end gap-3">
              <button
                onClick={() => navigate(`/payments/${reservation.id}`)}
                className="rounded-lg bg-midnight-indigo px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 shadow-sm transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}