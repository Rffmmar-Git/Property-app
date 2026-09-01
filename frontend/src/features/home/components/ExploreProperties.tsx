import { ChevronDown, Search } from "lucide-react";

import { useFeaturedProperties } from "../hooks/useFeaturedProperties";
import HomePropertyCard from "./HomePropertyCard";

export default function ExploreProperties() {
  const {
    data,
    isLoading,
    isError,
  } = useFeaturedProperties(8);

  const properties = data?.items ?? [];

  return (
    <section className="bg-surface px-6 py-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="px-1 text-base font-semibold text-midnight-indigo">
            Explore Properties
          </h2>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Search */}
            <div className="flex h-9 w-full items-center rounded border border-outline-variant px-2.5 sm:w-[180px]">
              <Search
                size={12}
                className="mr-2 text-slate-muted"
              />

              <input
                type="text"
                placeholder="Property Name..."
                className="w-full bg-transparent text-[10px] text-slate-text outline-none placeholder:text-slate-muted"
              />
            </div>

            {/* Category */}
            <button
              type="button"
              className="flex h-9 items-center justify-between rounded border border-outline-variant px-2.5 text-[10px] text-slate-text sm:w-[125px]"
            >
              All Categories
              <ChevronDown
                size={12}
                className="text-slate-muted"
              />
            </button>

            {/* Sort */}
            <button
              type="button"
              className="flex h-9 items-center justify-between rounded border border-outline-variant px-2.5 text-[10px] text-slate-text sm:w-[110px]"
            >
              Sort By
              <ChevronDown
                size={12}
                className="text-slate-muted"
              />
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                <div className="h-[150px] animate-pulse bg-slate-200" />

                <div className="space-y-3 p-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-red-700">
              Unable to load properties.
            </p>

            <p className="mt-1 text-xs text-red-600">
              Please try again later.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          properties.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center">
              <p className="text-sm font-medium text-slate-text">
                No properties available
              </p>

              <p className="mt-1 text-xs text-slate-muted">
                There are currently no properties available
                to display.
              </p>
            </div>
          )}

        {/* Real properties */}
        {!isLoading &&
          !isError &&
          properties.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {properties.map((property) => (
                <HomePropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          )}
      </div>
    </section>
  );
}