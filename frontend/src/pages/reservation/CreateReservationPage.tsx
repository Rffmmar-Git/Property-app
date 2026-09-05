import { ArrowLeft, ShieldCheck, Loader2, Minus, Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { usePropertyDetail } from "../../features/property/hooks/usePropertyDetail";

interface BookingState {
  roomId?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export default function CreateReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const bookingState = location.state as BookingState | undefined;
  const roomId = bookingState?.roomId;
  const checkInDate = bookingState?.checkInDate;
  const checkOutDate = bookingState?.checkOutDate;
  const hasValidBookingState = Boolean(
    roomId && checkInDate && checkOutDate,
  );

  const [guests, setGuests] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const {
    data: property,
    isLoading,
    isError,
  } = usePropertyDetail(id ?? "", roomId);

  const activeRoom = useMemo(() => {
    if (!property || !roomId) {
      return null;
    }
    return property.rooms.find((room) => Number(room.id) === Number(roomId)) ?? null;
  }, [property, roomId]);

  const calculateNights = (start: string, end: string) => {
    const diffTime =
      new Date(`${end}T00:00:00`).getTime() -
      new Date(`${start}T00:00:00`).getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights =
    checkInDate && checkOutDate
      ? calculateNights(checkInDate, checkOutDate)
      : 1;

  const nightsInRange = useMemo(() => {
    if (!property || !checkInDate || !checkOutDate) {
      return [];
    }

    return property.priceCalendar.filter(
      (item) => item.date >= checkInDate && item.date < checkOutDate,
    );
  }, [property, checkInDate, checkOutDate]);

  const cleaningFee = 0;
  const serviceFee = 0;

  const totalPrice = useMemo(() => {
    if (nightsInRange.length > 0) {
      return nightsInRange.reduce(
        (sum, item) => sum + (item.price ?? activeRoom?.basePrice ?? 0),
        0,
      );
    }
    return (activeRoom?.basePrice ?? 0) * nights;
  }, [nightsInRange, activeRoom, nights]);

  const handleConfirmReservation = async () => {
    if (!roomId || !checkInDate || !checkOutDate) {
      return;
    }

    try {
      setSubmitting(true);

      // Ambil token dari key property-app-auth (Zustand persist structure)
      const rawAuth = localStorage.getItem("property-app-auth");
      let token = "";

      if (rawAuth) {
        try {
          const parsedAuth = JSON.parse(rawAuth);
          token = parsedAuth.state?.accessToken || "";
        } catch (e) {
          console.error("Gagal parsing localStorage:", e);
        }
      }

      const payload = {
        roomId: Number(roomId),
        checkInDate: new Date(`${checkInDate}T00:00:00`).toISOString(),
        checkOutDate: new Date(`${checkOutDate}T00:00:00`).toISOString(),
        guestCount: Number(guests),
      };

      const response = await fetch("http://localhost:8000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Struktur asli dari backend:", result);

      if (!response.ok) throw new Error(result.message || "Gagal membuat reservasi");

      const reservationObj = result.data?.data || result.data || result;
      const reservationId = reservationObj?.id;
      const expiredAt = reservationObj?.bookingExpiredAt;

      if (!reservationId) {
        throw new Error("ID reservasi tidak ditemukan dalam objek data");
      }

      navigate(`/payments/${reservationId}`, {
        state: {
          bookingExpiredAt: expiredAt,
        },
      });
    } catch (err: any) {
      alert(err.message || "Gagal memproses pemesanan");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasValidBookingState) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-5">
        <p className="text-sm font-semibold text-red-500">
          Reservation details are missing. Please choose your dates again.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (isLoading && !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-8 w-8 animate-spin text-midnight-indigo" />
      </div>
    );
  }

  if (isError || !property || !activeRoom) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-5">
        <p className="text-sm font-semibold text-red-500">
          {!property ? "Properti tidak ditemukan" : "Room tidak ditemukan"}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-midnight-indigo px-4 py-2 text-xs font-semibold text-white"
        >
          Kembali
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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-midnight-indigo"
        >
          <ArrowLeft size={16} />
          Back to property
        </button>

        <section>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Request to Book
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your trip details and complete your reservation.
          </p>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Your trip</h2>

              <div className="mt-4 space-y-4 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Dates</p>
                    <p className="text-xs text-slate-500">{checkInDate} – {checkOutDate}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-600">{nights} nights</span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Guests</p>
                    <p className="text-xs text-slate-500">
                      Up to {activeRoom.capacity}{" "}
                      {activeRoom.capacity === 1 ? "guest" : "guests"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((current) => Math.max(1, current - 1))}
                      disabled={guests <= 1}
                      aria-label="Decrease guests"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-midnight-indigo hover:text-midnight-indigo disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-6 text-center text-sm font-semibold text-slate-900">
                      {guests}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setGuests((current) => Math.min(activeRoom.capacity, current + 1))
                      }
                      disabled={guests >= activeRoom.capacity}
                      aria-label="Increase guests"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-midnight-indigo hover:text-midnight-indigo disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Ground rules</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                We ask every guest to remember a few simple things that make a great guest, starting with community guidelines and respecting the property rules.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-midnight-indigo">
                <ShieldCheck size={16} />
                <span>Secure and verified reservation process</span>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={property.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                  alt={property.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {property.destination.city}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
                  {property.name}
                </h3>
                <p className="text-[11px] text-slate-400">{activeRoom.name}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-900">
                Price details
              </h4>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Rp {new Intl.NumberFormat("id-ID").format(activeRoom.basePrice)} x {nights} nights</span>
                <span className="text-slate-900 font-medium">
                  Rp {new Intl.NumberFormat("id-ID").format(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Cleaning fee</span>
                <span className="text-slate-900 font-medium">Rp {new Intl.NumberFormat("id-ID").format(cleaningFee)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Service fee</span>
                <span className="text-slate-900 font-medium">Rp {new Intl.NumberFormat("id-ID").format(serviceFee)}</span>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between text-sm font-bold text-slate-900">
                <span>Total (IDR)</span>
                <span className="text-midnight-indigo">
                  Rp {new Intl.NumberFormat("id-ID").format(totalPrice + cleaningFee + serviceFee)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmReservation}
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-midnight-indigo py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm and Pay"}
            </button>
          </aside>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}