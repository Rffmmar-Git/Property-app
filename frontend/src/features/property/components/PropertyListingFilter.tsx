import { ChevronDown, Search } from "lucide-react";

interface PropertyListingFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function PropertyListingFilter({
  search,
  onSearchChange,
}: PropertyListingFilterProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        {/* Search */}
        <div className="flex h-10 items-center rounded-lg border border-outline-variant px-3">
          <Search
            size={15}
            className="mr-2 shrink-0 text-slate-muted"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => {
              onSearchChange(event.target.value);
            }}
            placeholder="Search property name..."
            className="w-full bg-transparent text-sm text-slate-text outline-none placeholder:text-slate-muted"
          />
        </div>

        {/* Category */}
        <button
          type="button"
          className="flex h-10 min-w-[150px] items-center justify-between rounded-lg border border-outline-variant px-3 text-sm text-slate-text"
        >
          <span>All Categories</span>

          <ChevronDown
            size={15}
            className="text-slate-muted"
          />
        </button>

        {/* Sort */}
        <button
          type="button"
          className="flex h-10 min-w-[130px] items-center justify-between rounded-lg border border-outline-variant px-3 text-sm text-slate-text"
        >
          <span>Sort By</span>

          <ChevronDown
            size={15}
            className="text-slate-muted"
          />
        </button>
      </div>
    </div>
  );
}