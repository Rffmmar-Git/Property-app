import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PropertySearchBar() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [nights, setNights] = useState("1");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (destination.trim()) {
      params.set("destination", destination.trim());
    }

    if (checkIn) {
      params.set("checkIn", checkIn);
    }

    if (nights) {
      params.set("nights", nights);
    }

    navigate(
      params.toString()
        ? `/properties?${params.toString()}`
        : "/properties",
    );
  };

  return (
    <div className="mt-5 w-full max-w-[560px] rounded-xl bg-white p-3 shadow-xl sm:p-4 lg:flex lg:items-end lg:gap-2">
      {/* Destination */}
      <div className="min-w-0 flex-1">
        <label className="mb-1 block text-[9px] font-medium text-slate-muted">
          Destination
        </label>

        <div className="flex h-9 items-center rounded border border-outline-variant px-2.5">
          <MapPin
            size={14}
            className="mr-2 shrink-0 text-slate-muted"
          />

          <input
            type="text"
            value={destination}
            onChange={(event) =>
              setDestination(event.target.value)
            }
            placeholder="Where are you going?"
            className="min-w-0 flex-1 bg-transparent text-[10px] text-slate-text outline-none placeholder:text-slate-muted"
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="mt-2 lg:mt-0 lg:w-[125px]">
        <label className="mb-1 block text-[9px] font-medium text-slate-muted">
          Check-in
        </label>

        <div className="flex h-9 items-center rounded border border-outline-variant px-2.5">
          <CalendarDays
            size={14}
            className="mr-2 shrink-0 text-slate-muted"
          />

          <input
            type="date"
            value={checkIn}
            onChange={(event) =>
              setCheckIn(event.target.value)
            }
            className="w-full min-w-0 bg-transparent text-[9px] text-slate-text outline-none"
          />
        </div>
      </div>

      {/* Nights */}
      <div className="mt-2 lg:mt-0 lg:w-[105px]">
        <label className="mb-1 block text-[9px] font-medium text-slate-muted">
          Duration (Nights)
        </label>

        <div className="flex h-9 items-center rounded border border-outline-variant px-2.5">
          <Clock3
            size={14}
            className="mr-2 shrink-0 text-slate-muted"
          />

          <input
            type="number"
            min="1"
            value={nights}
            onChange={(event) =>
              setNights(event.target.value)
            }
            className="w-full bg-transparent text-[10px] text-slate-text outline-none"
          />
        </div>
      </div>

      {/* Search */}
      <button
        type="button"
        onClick={handleSearch}
        className="mt-2 flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded bg-sunrise-amber px-5 text-[10px] font-semibold text-slate-text transition hover:bg-amber-500 lg:mt-0 lg:w-auto"
      >
        <Search size={13} />
        Search
      </button>
    </div>
  );
}