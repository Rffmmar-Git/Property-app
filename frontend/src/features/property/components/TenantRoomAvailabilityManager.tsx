import { useState } from "react";
import { CalendarDays, CircleX, Lock } from "lucide-react";

import { useTenantRoomAvailability } from "../hooks/useTenantRoomAvailability";
import { useCloseTenantRoomDate } from "../hooks/useCloseTenantRoomDate";
import { useOpenTenantRoomDate } from "../hooks/useOpenTenantRoomDate";

interface TenantRoomAvailabilityManagerProps {
  roomId: string;
}

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
};

const formatDate = (value: string): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
};

export default function TenantRoomAvailabilityManager({
  roomId,
}: TenantRoomAvailabilityManagerProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [roomsToClose, setRoomsToClose] = useState("");
  const [closureReason, setClosureReason] = useState("");
  const [cancelAvailabilityId, setCancelAvailabilityId] = useState<
    string | null
  >(null);

  const {
    data: closedDates = [],
    isLoading,
    isError,
  } = useTenantRoomAvailability(roomId);

  const closeDateMutation = useCloseTenantRoomDate();
  const cancelClosureMutation = useOpenTenantRoomDate();

  const handleCloseDate = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!startDate || !endDate || !roomsToClose) {
      return;
    }

    const parsedRoomsToClose = Number(roomsToClose);

    if (
      !Number.isInteger(parsedRoomsToClose) ||
      parsedRoomsToClose <= 0
    ) {
      return;
    }

    if (endDate < startDate) {
      return;
    }

    closeDateMutation.mutate(
      {
        roomId,
        payload: {
          startDate,
          endDate,
          roomsToClose: parsedRoomsToClose,
          ...(closureReason.trim()
            ? { closureReason: closureReason.trim() }
            : {}),
        },
      },
      {
        onSuccess: () => {
          setStartDate("");
          setEndDate("");
          setRoomsToClose("");
          setClosureReason("");
        },
      },
    );
  };

  const handleCancelClosure = () => {
    if (!cancelAvailabilityId) {
      return;
    }

    cancelClosureMutation.mutate(
      {
        roomId,
        availabilityId: cancelAvailabilityId,
      },
      {
        onSuccess: () => {
          setCancelAvailabilityId(null);
        },
      },
    );
  };

  const isClosing = closeDateMutation.isPending;
  const isCancelling = cancelClosureMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Close Room Availability Form */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Close Room Availability
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Select a date range and the number of rooms to close.
            </p>
          </div>
        </div>

        <form onSubmit={handleCloseDate} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start-date"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Start Date
              </label>

              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);

                  if (
                    endDate &&
                    event.target.value > endDate
                  ) {
                    setEndDate(event.target.value);
                  }
                }}
                disabled={isClosing}
                className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                End Date
              </label>

              <input
                id="end-date"
                type="date"
                min={startDate || undefined}
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                disabled={isClosing}
                className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="rooms-to-close"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Rooms to Close
            </label>

            <input
              id="rooms-to-close"
              type="number"
              min={1}
              step={1}
              value={roomsToClose}
              onChange={(event) => setRoomsToClose(event.target.value)}
              placeholder="e.g. 2"
              disabled={isClosing}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="mt-1 text-xs text-slate-500">
              Enter the number of rooms to close on each selected date.
            </p>
          </div>

          <div>
            <label
              htmlFor="closure-reason"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Reason
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              id="closure-reason"
              type="text"
              value={closureReason}
              onChange={(event) => setClosureReason(event.target.value)}
              placeholder="e.g. Room maintenance"
              maxLength={255}
              disabled={isClosing}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {closeDateMutation.isError && (
            <p className="text-sm text-red-600">
              {getErrorMessage(
                closeDateMutation.error,
                "Failed to close room availability. Please try again.",
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={
              !startDate ||
              !endDate ||
              !roomsToClose ||
              Number(roomsToClose) <= 0 ||
              endDate < startDate ||
              isClosing
            }
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {isClosing ? "Closing Rooms..." : "Close Rooms"}
          </button>
        </form>
      </div>

      {/* Room Availability Records */}
      <div>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Room Availability
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Dates with manually reduced room availability.
            </p>
          </div>

          {closedDates.length > 0 && (
            <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {closedDates.length}{" "}
              {closedDates.length === 1 ? "date" : "dates"}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Loading room availability...
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Failed to load room availability. Please try again.
          </div>
        )}

        {!isLoading && !isError && closedDates.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-2 text-sm font-medium text-slate-700">
              No availability adjustments
            </p>

            <p className="mt-1 text-xs text-slate-500">
              This room is currently available on all dates.
            </p>
          </div>
        )}

        {!isLoading && !isError && closedDates.length > 0 && (
          <div className="space-y-3">
            {closedDates.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <Lock className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(item.available_date)}
                      </p>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          item.is_closed
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.is_closed
                          ? "Fully Unavailable"
                          : "Partially Unavailable"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.available_rooms} room
                      {item.available_rooms === 1 ? "" : "s"} available
                    </p>

                    {item.closure_reason && (
                      <p className="mt-1 break-words text-xs text-slate-500">
                        {item.closure_reason}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCancelAvailabilityId(item.id)}
                  disabled={isCancelling}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0"
                >
                  <CircleX className="h-4 w-4" />
                  Cancel Closure
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Closure Confirmation Modal */}
      {cancelAvailabilityId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/20 p-4">
          <div className="w-[28rem] max-w-[calc(100vw-2rem)] rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <CircleX className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900">
                  Cancel this closure?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This will cancel the room closure for this date and make
                  all rooms available again. Are you sure you want to
                  continue?
                </p>
              </div>
            </div>

            {cancelClosureMutation.isError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {getErrorMessage(
                  cancelClosureMutation.error,
                  "Failed to cancel this closure. Please try again.",
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelAvailabilityId(null)}
                disabled={isCancelling}
                className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Closure
              </button>

              <button
                type="button"
                onClick={handleCancelClosure}
                disabled={isCancelling}
                className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Cancel Closure"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}