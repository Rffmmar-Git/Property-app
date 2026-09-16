import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

import { useReservation } from "@/features/reservation/hooks/useReservation";
import { useCreateReview } from "@/features/review/hooks/useReview";
import { ReviewForm } from "@/features/review/components/ReviewForm";
import { CreateReviewFormValues } from "@/validations/review.schema";
export default function ReviewPage() {
  const { reservationId } = useParams<{
    reservationId: string;
  }>();

  const navigate = useNavigate();

  const parsedId = reservationId
    ? Number(reservationId)
    : undefined;

  const {
    data: reservation,
    isLoading,
    isError,
    error,
  } = useReservation(parsedId);

  const createReviewMutation = useCreateReview();

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const handleSubmit = async (
    values: CreateReviewFormValues
  ) => {
    try {
      await createReviewMutation.mutateAsync(values);

      navigate(`/reservations/${parsedId}`);
    } catch {
      // Error is displayed below the form.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-midnight-indigo" />
      </div>
    );
  }

  if (isError || !reservation) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <div className="hidden md:block">
          <Header />
        </div>

        <div className="block md:hidden">
          <MobileHeader />
        </div>

        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">
              Reservation Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {(error as Error)?.message ||
                "The reservation could not be found."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/my-reservations")
              }
              className="mt-6 rounded-lg bg-midnight-indigo px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Back to My Reservations
            </button>
          </div>
        </main>

        <MobileBottomNav />
      </div>
    );
  }

  if (reservation.reservationStatus !== "COMPLETED") {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <div className="hidden md:block">
          <Header />
        </div>

        <div className="block md:hidden">
          <MobileHeader />
        </div>

        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">
              Review Not Available
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              You can only review a completed reservation.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(`/reservations/${parsedId}`)
              }
              className="mt-6 rounded-lg bg-midnight-indigo px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Back to Reservation
            </button>
          </div>
        </main>

        <MobileBottomNav />
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

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() =>
            navigate(`/reservations/${parsedId}`)
          }
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reservation
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Write a Review
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Share your experience with this stay.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Stay Information
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-slate-500">
                Property
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {reservation.propertyName}
              </p>
            </div>

            <div>
              <p className="text-slate-500">
                Room
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {reservation.roomName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500">
                  Check-in
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {formatDate(
                    reservation.checkInDate
                  )}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Check-out
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {formatDate(
                    reservation.checkOutDate
                  )}
                </p>
              </div>
            </div>

            <div>
              <p className="text-slate-500">
                Guests
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {reservation.guestCount} Guest(s)
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ReviewForm
            reservationId={reservation.id}
            onSubmit={handleSubmit}
            isSubmitting={
              createReviewMutation.isPending
            }
          />

          {createReviewMutation.isError && (
            <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {(
                createReviewMutation.error as Error
              )?.message ||
                "Failed to submit review. Please try again."}
            </p>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}