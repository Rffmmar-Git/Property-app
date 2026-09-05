import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HomeNavbar from "../../features/home/components/HomeNavbar";
import { usePropertyDetail } from "../../features/property/hooks/usePropertyDetail";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const formatCalendarDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

const formatFullDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

const formatTime = (value: string | null) => {
  if (!value) {
    return "Not specified";
  }

  const match = /^(\d{2}):(\d{2})/.exec(value);

  if (!match) {
    return value;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return value;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
};

const addDays = (date: string, days: number) => {
  const [year, month, day] = date.split("-").map(Number);

  const result = new Date(year, month - 1, day);

  result.setDate(result.getDate() + days);

  const resultYear = result.getFullYear();
  const resultMonth = String(result.getMonth() + 1).padStart(2, "0");
  const resultDay = String(result.getDate()).padStart(2, "0");

  return `${resultYear}-${resultMonth}-${resultDay}`;
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>( undefined, );

  const [calendarStart, setCalendarStart] = useState(0);
  
  const [checkIn, setCheckIn] = useState<string | null>(null);

  const [checkOut, setCheckOut] = useState<string | null>(null);

  const [dateSelectionError, setDateSelectionError] = useState("");

  const {
    data: property,
    isLoading,
    isError,
    isFetching,
  } = usePropertyDetail(id ?? "", selectedRoomId);

  /*
   * The backend returns the default calendar using the lowest
   * available room when no roomId is provided.
   *
   * After the user selects a room, selectedRoomId becomes the
   * source of truth for the room-specific calendar.
   */
  const activeRoomId = selectedRoomId ?? property?.rooms[0]?.id;

  const activeRoom = useMemo(() => {
    if (!property || !activeRoomId) {
      return null;
    }

    return property.rooms.find((room) => room.id === activeRoomId) ?? null;
  }, [property, activeRoomId]);

  const visibleCalendar = useMemo(() => {
    if (!property) {
      return [];
    }

    return property.priceCalendar.slice(calendarStart, calendarStart + 14);
  }, [property, calendarStart]);

  const canGoPrevious = calendarStart > 0;

  const canGoNext =
    property !== undefined &&
    calendarStart + 14 < property.priceCalendar.length;

  /*
   * Get all calendar dates between check-in and
   * check-out.
   */
  const selectedStayDates = useMemo(() => {
    if (!checkIn || !checkOut) {
      return [];
    }

    const dates: string[] = [];
    let currentDate = checkIn;

    while (currentDate < checkOut) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return dates;
  }, [checkIn, checkOut]);

  /*
   * Calculate the total based on nightly prices.
   *
   * Check-in is included.
   * Check-out is excluded.
   */
  const estimatedTotal = useMemo(() => {
    if (!property || !checkIn || !checkOut) {
      return 0;
    }

    return selectedStayDates.reduce((total, date) => {
      const calendarItem = property.priceCalendar.find(
        (item) => item.date === date,
      );

      if (
        !calendarItem ||
        !calendarItem.available ||
        calendarItem.price === null
      ) {
        return total;
      }

      return total + calendarItem.price;
    }, 0);
  }, [property, checkIn, checkOut, selectedStayDates]);

  const numberOfNights = selectedStayDates.length;

  /*
   * Check whether every night in the selected
   * stay is available.
   */
  const isSelectedStayAvailable = useMemo(() => {
    if (!property || !checkIn || !checkOut) {
      return false;
    }

    return selectedStayDates.every((date) => {
      const item = property.priceCalendar.find(
        (calendarItem) => calendarItem.date === date,
      );

      return Boolean(item?.available && item.price !== null);
    });
  }, [property, checkIn, checkOut, selectedStayDates]);

  const handleBookNow = () => {
    document.getElementById("available-rooms")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleRoomSelect = (roomId: string) => {
  if (roomId === selectedRoomId) {
    document.getElementById("availability-calendar")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    return;
  }

  setSelectedRoomId(roomId);
  setCalendarStart(0);
  setCheckIn(null);
  setCheckOut(null);
  setDateSelectionError("");

  window.setTimeout(() => {
    document.getElementById("availability-calendar")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 0);
};
const handleDateSelect = (date: string, available: boolean) => {
  if (!available) {
    return;
  }

  setDateSelectionError("");

  // Belum memilih check-in, atau sebelumnya sudah punya range
  if (!checkIn || checkOut) {
    setCheckIn(date);
    setCheckOut(null);
    return;
  }

  // Tidak boleh memilih check-out sebelum / sama dengan check-in
  if (date <= checkIn) {
    setCheckIn(date);
    setCheckOut(null);
    return;
  }

  const potentialStayDates: string[] = [];
  let currentDate = checkIn;

  while (currentDate < date) {
    potentialStayDates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  const hasUnavailableDate = potentialStayDates.some((stayDate) => {
    const calendarItem = property?.priceCalendar.find(
      (item) => item.date === stayDate,
    );

    return (
      !calendarItem ||
      !calendarItem.available ||
      calendarItem.price === null
    );
  });

  if (hasUnavailableDate) {
    setDateSelectionError(
      "Your selected stay includes unavailable dates. Please choose another date range.",
    );
    return;
  }

  setCheckOut(date);
};
const handleShare = async () => {
  if (!property) {
    return;
  }

  const shareData = {
    title: property.name,
    text: `Check out ${property.name}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  } catch {
    // User cancelled the share action.
  }
};

  const mapUrl =
    property?.latitude !== null &&
    property?.latitude !== undefined &&
    property?.longitude !== null &&
    property?.longitude !== undefined
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${
          property.longitude - 0.01
        }%2C${property.latitude - 0.01}%2C${
          property.longitude + 0.01
        }%2C${property.latitude + 0.01}&layer=mapnik&marker=${
          property.latitude
        }%2C${property.longitude}`
      : null;

  const googleMapsUrl =
    property?.latitude !== null &&
    property?.latitude !== undefined &&
    property?.longitude !== null &&
    property?.longitude !== undefined
      ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
      : null;

  /*
   * Initial property loading.
   */
  if (isLoading && !property) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <HomeNavbar />

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-8 w-2/3 rounded bg-slate-200" />
            <div className="h-4 w-1/3 rounded bg-slate-200" />

            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <div className="h-[320px] rounded-xl bg-slate-200 md:col-span-2" />

              <div className="grid grid-cols-2 gap-2 md:col-span-2">
                {Array.from({
                  length: 4,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[155px] rounded-xl bg-slate-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /*
   * Only show the full error page when there is no
   * previous property data to display.
   */
  if (!property && isError) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <HomeNavbar />

        <main className="mx-auto flex w-full max-w-[1200px] flex-1 items-center justify-center px-5 py-10 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-slate-text">
              Unable to load property
            </h1>

            <p className="mt-2 text-sm text-slate-muted">
              The property could not be found or something went wrong.
            </p>

            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="mt-5 cursor-pointer rounded-lg bg-midnight-indigo px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Back to Properties
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const images = property.images;

  const selectedImageUrl = images[selectedImage]?.imageUrl ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <HomeNavbar />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-7 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/properties")}
          className="mb-5 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-muted transition hover:text-midnight-indigo"
        >
          <ArrowLeft size={16} />
          Back to properties
        </button>

        {/* Property Header */}
        <section>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-muted">
                <span className="font-medium text-slate-text">
                  {property.category}
                </span>

                <span>·</span>

                <span>
                  {property.destination.city}, {property.destination.province}
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-text sm:text-4xl">
                {property.name}
              </h1>

              <div className="mt-2 flex items-start gap-1.5 text-sm text-slate-muted">
                <MapPin size={15} className="mt-0.5 shrink-0" />

                <span>{property.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share property"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-outline-variant bg-white text-slate-muted transition hover:border-midnight-indigo hover:text-midnight-indigo"
              >
                <Share2 size={17} />
              </button>

              <button
                type="button"
                onClick={handleBookNow}
                className="ml-1 cursor-pointer rounded-lg bg-sunrise-amber px-4 py-2.5 text-sm font-semibold text-slate-text shadow-sm transition hover:brightness-95"
              >
                Choose a Room
              </button>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        {images.length > 0 && (
          <section className="mt-7">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <div className="relative h-[300px] overflow-hidden rounded-xl md:col-span-2 md:h-[420px]">
                {selectedImageUrl ? (
                  <img
                    src={selectedImageUrl}
                    alt={property.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-muted">
                    No image available
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() =>
                        setSelectedImage((current) =>
                          current === 0 ? images.length - 1 : current - 1,
                        )
                      }
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-text shadow-sm backdrop-blur transition hover:bg-white"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() =>
                        setSelectedImage((current) =>
                          current === images.length - 1 ? 0 : current + 1,
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-text shadow-sm backdrop-blur transition hover:bg-white"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 md:col-span-2">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={`${image.imageUrl}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`group relative h-[145px] cursor-pointer overflow-hidden rounded-xl md:h-[204px] ${
                      selectedImage === index
                        ? "ring-2 ring-midnight-indigo ring-offset-1"
                        : ""
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${property.name} ${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>

            {images.length > 4 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {images.slice(4).map((image, index) => {
                  const actualIndex = index + 4;

                  return (
                    <button
                      key={`${image.imageUrl}-${actualIndex}`}
                      type="button"
                      onClick={() => setSelectedImage(actualIndex)}
                      className={`h-16 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg ${
                        selectedImage === actualIndex
                          ? "ring-2 ring-midnight-indigo"
                          : ""
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${property.name} ${actualIndex + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Property Information */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <h2 className="text-lg font-semibold text-slate-text">
              About this property
            </h2>

            <div className="mt-3 border-t border-slate-200 pt-4">
              <p className="whitespace-pre-line text-sm leading-6 text-slate-muted">
                {property.description ||
                  "No description is available for this property."}
              </p>
            </div>

            {/* Location */}
            <div className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-text">
                  Location
                </h2>

                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-midnight-indigo transition hover:underline"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>

              <div className="mt-3 flex items-start gap-2 border-t border-slate-200 pt-4">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-midnight-indigo"
                />

                <div>
                  <p className="text-sm font-medium text-slate-text">
                    {property.address}
                  </p>

                  <p className="mt-1 text-sm text-slate-muted">
                    {property.destination.city}, {property.destination.province}
                  </p>
                </div>
              </div>

              {mapUrl ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <iframe
                    title={`${property.name} location map`}
                    src={mapUrl}
                    className="h-[300px] w-full border-0"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="mt-4 flex min-h-[150px] items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-6 text-center">
                  <div>
                    <MapPin size={22} className="mx-auto text-slate-muted" />

                    <p className="mt-2 text-xs font-medium text-slate-muted">
                      Map preview unavailable
                    </p>

                    <p className="mt-1 text-[11px] text-slate-muted">
                      Location coordinates are not available for this property.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Property Policies */}
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold text-slate-text">
              Property Policies
            </h2>

            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-midnight-indigo">
                  <Clock3 size={15} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-text">
                    Check-in
                  </p>

                  <p className="mt-0.5 text-xs text-slate-muted">
                    {formatTime(property.checkInTime)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-midnight-indigo">
                  <Clock3 size={15} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-text">
                    Check-out
                  </p>

                  <p className="mt-0.5 text-xs text-slate-muted">
                    {formatTime(property.checkOutTime)}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Available Rooms */}
        <section id="available-rooms" className="mt-10 scroll-mt-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-text">
                Available Rooms
              </h2>

              <p className="mt-1 text-sm text-slate-muted">
                Choose a room to view its availability and nightly pricing.
              </p>
            </div>

            <span className="text-sm text-slate-muted">
              {property.rooms.length}{" "}
              {property.rooms.length === 1 ? "room" : "rooms"}
            </span>
          </div>

          {property.rooms.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
              <h3 className="text-sm font-semibold text-slate-text">
                No rooms available
              </h3>

              <p className="mt-1 text-sm text-slate-muted">
                This property currently has no active rooms.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {property.rooms.map((room) => {
                const isSelected = activeRoomId === room.id;

                return (
                  <article
                    key={room.id}
                    onClick={() => handleRoomSelect(room.id)}
                    className={`group flex cursor-pointer flex-col rounded-xl border bg-white p-4 shadow-sm transition ${
                      isSelected
                        ? "border-midnight-indigo ring-2 ring-blue-100"
                        : "border-slate-200 hover:-translate-y-0.5 hover:border-midnight-indigo hover:shadow-md"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-slate-text">
                          {room.name}
                        </h3>

                        <div
                          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                            isSelected
                              ? "bg-blue-100 text-midnight-indigo"
                              : "bg-blue-50 text-midnight-indigo"
                          }`}
                        >
                          {isSelected ? "Selected" : "Room"}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-muted">
                        <Users size={13} />

                        <span>
                          Up to {room.capacity}{" "}
                          {room.capacity === 1 ? "guest" : "guests"}
                        </span>
                      </div>

                      <p className="mt-3 min-h-[40px] text-xs leading-5 text-slate-muted">
                        {room.description ||
                          "No room description is available."}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-slate-muted">
                            Starting from
                          </p>

                          <p className="mt-1 text-lg font-bold text-midnight-indigo">
                            Rp {formatPrice(room.basePrice)}
                            <span className="ml-1 text-[11px] font-normal text-slate-muted">
                              /night
                            </span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            handleRoomSelect(room.id);
                          }}
                          className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            isSelected
                              ? "bg-midnight-indigo text-white hover:opacity-90"
                              : "border border-midnight-indigo text-midnight-indigo hover:bg-blue-50"
                          }`}
                        >
                          {isSelected ? "Selected" : "Check Availability"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Availability Calendar */}
        <section id="availability-calendar" className="mt-10 scroll-mt-24">
          <div>
            <h2 className="text-xl font-semibold text-slate-text">
              Availability Calendar
            </h2>

            <p className="mt-1 text-sm text-slate-muted">
              {activeRoom
                ? `Availability and nightly price for ${activeRoom.name} for the next 30 days.`
                : "Availability and nightly price for the selected room for the next 30 days."}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <button
                type="button"
                disabled={!canGoPrevious}
                onClick={() =>
                  setCalendarStart((current) => Math.max(0, current - 7))
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-outline-variant text-slate-muted transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-midnight-indigo" />

                <span className="text-sm font-semibold text-slate-text">
                  {visibleCalendar.length > 0
                    ? `${formatCalendarDate(
                        visibleCalendar[0].date,
                      )} – ${formatFullDate(
                        visibleCalendar[visibleCalendar.length - 1].date,
                      )}`
                    : "Availability"}
                </span>
              </div>

              <button
                type="button"
                disabled={!canGoNext}
                onClick={() =>
                  setCalendarStart((current) =>
                    Math.min(
                      Math.max(0, property.priceCalendar.length - 14),
                      current + 7,
                    ),
                  )
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-outline-variant text-slate-muted transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {isFetching && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-muted">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-midnight-indigo" />
                Updating room calendar...
              </div>
            )}

            {visibleCalendar.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-muted">
                  No availability calendar data is available.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {visibleCalendar.map((item) => {
                  const isCheckIn = checkIn === item.date;
                  const isCheckOut = checkOut === item.date;

                  const isInRange = Boolean(
                    checkIn &&
                      checkOut &&
                      item.date >= checkIn &&
                      item.date < checkOut,
                  );

                  const isSelectedDate = isCheckIn || isCheckOut;

                  return (
                    <button
                      key={item.date}
                      type="button"
                      disabled={!item.available}
                      onClick={() => handleDateSelect(item.date, item.available)}
                      className={`relative min-h-[105px] rounded-lg border p-3 text-left transition ${
                        !item.available
                          ? "cursor-not-allowed border-slate-100 bg-slate-50"
                          : isSelectedDate
                            ? "cursor-pointer border-midnight-indigo bg-blue-50 ring-1 ring-midnight-indigo"
                            : isInRange
                              ? "cursor-pointer border-blue-200 bg-blue-50"
                              : "cursor-pointer border-slate-200 bg-white hover:border-midnight-indigo hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-muted">
                          {new Intl.DateTimeFormat("en-US", {
                            weekday: "short",
                          }).format(new Date(`${item.date}T00:00:00`))}
                        </span>

                        {item.available && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        )}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-text">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(`${item.date}T00:00:00`))}
                      </p>

                      <p
                        className={`mt-2 text-xs font-medium ${
                          item.available
                            ? "text-midnight-indigo"
                            : "text-slate-muted"
                        }`}
                      >
                        {item.price !== null
                          ? `Rp ${formatPrice(item.price)}`
                          : "Unavailable"}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-muted">
                        {isCheckIn
                          ? "Check-in"
                          : isCheckOut
                            ? "Check-out"
                            : item.available
                              ? "Available"
                              : "Not available"}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-[11px] text-slate-muted">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Available
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Not available
              </div>

              <span>
                Prices shown are for the selected room and include applicable
                peak season adjustments.
              </span>
            </div>

            
          </div>
        </section>
      </main>
    </div>
  );
}
