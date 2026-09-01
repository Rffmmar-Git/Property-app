import { ChevronDown, Search } from "lucide-react";

import type { PropertyCategory } from "../api/property-category.api";

interface PropertyListingFilterProps {
  search: string;
  category: string;
  categories: PropertyCategory[];
  sortBy: "created_at" | "name" | "price";
  order: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (
    sortBy: "created_at" | "name" | "price",
    order: "asc" | "desc",
  ) => void;
}

const sortOptions = [
  {
    label: "Newest",
    sortBy: "created_at" as const,
    order: "desc" as const,
  },
  {
    label: "Oldest",
    sortBy: "created_at" as const,
    order: "asc" as const,
  },
  {
    label: "Name A–Z",
    sortBy: "name" as const,
    order: "asc" as const,
  },
  {
    label: "Name Z–A",
    sortBy: "name" as const,
    order: "desc" as const,
  },
  {
    label: "Price Low–High",
    sortBy: "price" as const,
    order: "asc" as const,
  },
  {
    label: "Price High–Low",
    sortBy: "price" as const,
    order: "desc" as const,
  },
];

export default function PropertyListingFilter({
  search,
  category,
  categories,
  sortBy,
  order,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: PropertyListingFilterProps) {
  const selectedSort =
    sortOptions.find(
      (option) =>
        option.sortBy === sortBy &&
        option.order === order,
    ) ?? sortOptions[0];

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
        <div className="relative">
          <select
            value={category}
            onChange={(event) => {
              onCategoryChange(event.target.value);
            }}
            className="h-10 min-w-[150px] appearance-none rounded-lg border border-outline-variant bg-white px-3 pr-9 text-sm text-slate-text outline-none"
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option
                key={item.id}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={`${selectedSort.sortBy}:${selectedSort.order}`}
            onChange={(event) => {
              const [newSortBy, newOrder] =
                event.target.value.split(":") as [
                  "created_at" | "name" | "price",
                  "asc" | "desc",
                ];

              onSortChange(newSortBy, newOrder);
            }}
            className="h-10 min-w-[160px] appearance-none rounded-lg border border-outline-variant bg-white px-3 pr-9 text-sm text-slate-text outline-none"
          >
            {sortOptions.map((option) => (
              <option
                key={`${option.sortBy}:${option.order}`}
                value={`${option.sortBy}:${option.order}`}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-muted"
          />
        </div>
      </div>
    </div>
  );
}