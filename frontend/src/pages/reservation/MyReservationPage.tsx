import { useMyReservations } from "@/features/reservation/hooks/useMyReservation";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/layout/EmptyState";

export default function MyReservationsPage() {
  const navigate = useNavigate();

  const { data: reservations, isLoading, isError } = useMyReservations();

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-8 w-8 animate-spin text-midnight-indigo" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-5 text-center">
        <p className="text-sm font-semibold text-red-600">
          Failed to load your reservations. Please try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-24 md:pb-12">
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="block md:hidden">
        <MobileHeader />
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="My Reservations"
          description="Track your bookings, review statuses, and complete payments."
        />

        {!reservations || reservations.length === 0 ? (
          <EmptyState
            dashed
            icon={<Calendar className="h-10 w-10" />}
            title="No reservations found"
            description="You haven't made any property bookings yet."
            action={
              <button
                onClick={() => navigate("/")}
                className="rounded bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
              >
                Start Exploring
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/reservations/${item.id}`)}
                className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-midnight-indigo/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-semibold text-slate-muted">
                    Code:{" "}
                    <span className="text-slate-text">
                      {item.bookingCode}
                    </span>
                  </span>

                  {(() => {
                    switch (item.reservationStatus) {
                      case "WAITING_PAYMENT":
                        return (
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                            Waiting Payment
                          </span>
                        );

                      case "WAITING_CONFIRMATION":
                        return (
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                            Waiting Confirmation
                          </span>
                        );

                      case "CONFIRMED":
                        return (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Confirmed
                          </span>
                        );

                      case "CANCELLED":
                        return (
                          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700">
                            Cancelled
                          </span>
                        );

                      case "COMPLETED":
                        return (
                          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                            Completed
                          </span>
                        );

                      case "EXPIRED":
                        return (
                          <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                            Expired
                          </span>
                        );

                      default:
                        return (
                          <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                            {item.reservationStatus}
                          </span>
                        );
                    }
                  })()}
                </div>

                <div className="mt-3 space-y-1.5">
                  <h3 className="truncate font-semibold text-slate-text transition-colors group-hover:text-midnight-indigo">
                    {item.propertyName}
                  </h3>

                  <p className="flex items-center gap-1.5 truncate text-xs text-slate-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-muted" />
                    {item.roomName}
                  </p>

                  <p className="flex items-center gap-1.5 text-xs text-slate-muted">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-slate-muted" />
                    {formatDate(item.checkInDate)} –{" "}
                    {formatDate(item.checkOutDate)}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="block text-[10px] text-slate-muted">
                      Total Price
                    </span>

                    <span className="text-sm font-bold text-midnight-indigo">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        Number(item.totalPrice)
                      )}
                    </span>
                  </div>

                  <div className="flex items-center text-xs font-semibold text-midnight-indigo transition-transform group-hover:translate-x-1">
                    <span>Details</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}