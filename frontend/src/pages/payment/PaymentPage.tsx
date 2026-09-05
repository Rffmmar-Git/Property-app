import { Loader2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useReservation } from "../../features/reservation/hooks/useReservation";
import { PaymentProofUploader } from "../../features/payment/components/PaymentProofUploader";
import { PaymentCountdown } from "@/features/payment/components/PaymentConfirmation";
import { BankTransferInfo } from "../../features/payment/components/BankTransferInfo";
import { PaymentStatusBadge } from "../../features/payment/components/PaymentStatusBadge";

interface PaymentLocationState {
  bookingExpiredAt?: string;
}

const formatDateOnly = (dateString?: string) => {
  if (!dateString) return "-";
  const cleanDate = dateString.split("T")[0];
  const [year, month, day] = cleanDate.split("-");
  
  if (!year || !month || !day) return dateString;

  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationId } = useParams<{ reservationId: string }>();

  const bookingExpiredAt = (
    location.state as PaymentLocationState | undefined
  )?.bookingExpiredAt;

  const parsedReservationId = reservationId
    ? Number(reservationId)
    : undefined;

  const { data: reservation, isLoading, isError } =
    useReservation(parsedReservationId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-midnight-indigo" />
      </div>
    );
  }

  if (isError || !reservation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5">
        <p className="text-sm font-semibold text-red-500">
          Reservation not found.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        >
          Back to home
        </button>
      </div>
    );
  }

  const hasUploaded = Boolean(reservation.paymentProof || reservation.reservationStatus === "WAITING_CONFIRMATION");  
  const canUploadProof = !hasUploaded || reservation.paymentStatus === "REJECTED";

  return (
       <div className="flex min-h-screen flex-col bg-slate-50 pb-24 md:pb-12">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="block md:hidden">
        <MobileHeader />
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Complete your payment
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Booking code: <span className="font-medium text-slate-700">{reservation.bookingCode}</span>
          </p>
        </section>

        {/* Timer hanya akan muncul jika ada batas waktu DAN belum melakukan upload */}
        {bookingExpiredAt && !hasUploaded && (
          <div className="mb-6">
            <PaymentCountdown expiresAt={bookingExpiredAt} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:gap-8 items-start">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <BankTransferInfo />
            </div>

            {canUploadProof ? (
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
                  Upload Payment Proof
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Please upload your transfer receipt so the tenant can verify your payment.
                </p>
                <PaymentProofUploader reservationId={reservation.id} />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  Payment proof submitted
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {reservation.paymentStatus === "ACCEPTED"
                    ? "Your payment has been successfully confirmed and accepted by the host."
                    : "Your payment proof has been uploaded. Waiting for the tenant to approve or reject your payment."}
                </p>
              </div>
            )}
          </div>

          {/* Kolom Kanan / Sidebar */}
          <aside className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Booking summary
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Property</span>
                <span className="font-medium text-slate-900 text-right max-w-[200px] truncate">
                  {reservation.propertyName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room</span>
                <span className="font-medium text-slate-900 text-right max-w-[200px] truncate">
                  {reservation.roomName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dates</span>
                <span className="font-medium text-slate-900">
                  {formatDateOnly(reservation.checkInDate)} – {formatDateOnly(reservation.checkOutDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guests</span>
                <span className="font-medium text-slate-900">
                  {reservation.guestCount} guest(s)
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-slate-700">
                Payment status
              </span>
              {reservation.reservationStatus === "WAITING_CONFIRMATION" ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                    Waiting confirmation
                  </span>
                ) : reservation.paymentStatus ? (
                  <PaymentStatusBadge status={reservation.paymentStatus} />
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                    Pending
                  </span>
                )}
            </div>

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-base font-bold text-slate-900">
              <span>Total (IDR)</span>
              <span className="text-midnight-indigo">
                Rp{" "}
                {new Intl.NumberFormat("id-ID").format(
                  Number(reservation.totalPrice),
                )}
              </span>
            </div>
          </aside>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}