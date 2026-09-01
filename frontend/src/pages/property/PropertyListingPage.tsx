import { useState } from "react";

import HomeNavbar from "../../features/home/components/HomeNavbar";
import PropertyCard from "../../features/property/components/PropertyCard";
import PropertyListingFilter from "../../features/property/components/PropertyListingFilter";
import { useProperties } from "../../features/property/hooks/useProperties";

const PAGE_SIZE = 12;

export default function PropertyListingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useProperties({
    page,
    pageSize: PAGE_SIZE,
  });

  const properties = data?.items ?? [];
  const pagination = data?.pagination;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Navbar */}
      <HomeNavbar />

      {/* Page Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-6 lg:px-8">
          <h1 className="font-headline-lg text-3xl font-bold text-slate-text sm:text-4xl">
            Explore Properties
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-muted sm:text-base">
            Discover properties and find the right place
            for your next stay.
          </p>
        </div>
      </header>

      {/* Property Listing */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-6 sm:px-6 lg:px-8">
        <PropertyListingFilter
          search={search}
          onSearchChange={handleSearchChange}
        />

        <div className="mb-5 mt-6 flex items-center justify-between">
          <div>
            {!isLoading && pagination && (
              <p className="text-sm text-slate-muted">
                Showing{" "}
                <span className="font-medium text-slate-text">
                  {properties.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-text">
                  {pagination.totalItems}
                </span>{" "}
                properties
              </p>
            )}
          </div>

          {isFetching && !isLoading && (
            <p className="text-xs text-slate-muted">
              Updating...
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <h2 className="text-base font-semibold text-red-700">
              Unable to load properties
            </h2>

            <p className="mt-2 text-sm text-red-600">
              Something went wrong while loading the
              property list. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          properties.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
              <h2 className="text-base font-semibold text-slate-text">
                No properties found
              </h2>

              <p className="mt-2 text-sm text-slate-muted">
                There are currently no properties available
                for this page.
              </p>
            </div>
          )}

        {/* Properties */}
        {!isLoading &&
          !isError &&
          properties.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          )}

        {/* Pagination */}
        {!isLoading &&
          !isError &&
          pagination &&
          pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1 || isFetching}
                onClick={() =>
                  setPage((current) => current - 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-slate-muted transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  disabled={isFetching}
                  onClick={() => setPage(pageNumber)}
                  className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                    pageNumber === page
                      ? "bg-midnight-indigo text-white"
                      : "border border-outline-variant bg-white text-slate-text hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  page === pagination.totalPages ||
                  isFetching
                }
                onClick={() =>
                  setPage((current) => current + 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-slate-muted transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                ›
              </button>
            </div>
          )}
      </main>
    </div>
  );
}