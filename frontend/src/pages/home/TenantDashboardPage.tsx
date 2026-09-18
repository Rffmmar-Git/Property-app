import { Building2, Plus, Tag } from "lucide-react";
import { Link } from "react-router-dom";

import { TenantMobileHeader } from "@/components/layout/TenantMobileHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { TenantMobileBottomNav } from "@/components/layout/TenantMobileBottomNav";
import PageHeader from "@/components/layout/PageHeader";

import TenantDashboardSummary from "@/features/home/components/TenantDashboardSummary";
import TenantDashboardTransaction from "@/features/payment/components/TenantDashboardTransaction";
import TenantDashboardSales from "@/features/report/components/TenantDashboardSales";

import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";
import { useTenantRooms } from "@/features/property/hooks/useTenantRooms";

export default function TenantDashboardPage() {
  const { data: propertiesData, isLoading: isPropertiesLoading } =
    useTenantProperties({
      page: 1,
      pageSize: 3,
      sortBy: "created_at",
      order: "desc",
    });

  const { data: rooms = [], isLoading: isRoomsLoading } = useTenantRooms();

  const properties = propertiesData?.items ?? [];
  const totalProperties = propertiesData?.pagination.totalItems ?? 0;

  const totalRooms = rooms.reduce((total, room) => total + room.total_rooms, 0);

  return (
    <div className="flex min-h-screen flex-col bg-surface pb-24 md:pb-12">
      <div className="hidden md:block">
        <TenantHeader />
      </div>

      <div className="md:hidden">
        <TenantMobileHeader />
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Tenant Dashboard"
          description="Overview of your properties, transactions, and sales activity."
        />

        {/* EXISTING DASHBOARD SUMMARY - FEATURE 2 */}
        <TenantDashboardSummary />

        {/* FEATURE 1 - PROPERTY MANAGEMENT */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-text">
              Property Management
            </h2>

            <p className="mt-1 text-sm text-slate-muted">
              Manage your properties and property categories.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/tenant/properties"
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-midnight-indigo/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
                <Plus size={20} />
              </div>

              <h3 className="text-sm font-semibold text-slate-text">
                Add Property
              </h3>

              <p className="mt-1 text-xs text-slate-muted">
                Create a new property and complete its setup.
              </p>

              <span className="mt-4 inline-flex items-center text-xs font-semibold text-midnight-indigo group-hover:underline">
                Add →
              </span>
            </Link>

            <Link
              to="/tenant/categories"
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-midnight-indigo/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
                <Tag size={20} />
              </div>

              <h3 className="text-sm font-semibold text-slate-text">
                Manage Categories
              </h3>

              <p className="mt-1 text-xs text-slate-muted">
                Manage the categories used for your properties.
              </p>

              <span className="mt-4 inline-flex items-center text-xs font-semibold text-midnight-indigo group-hover:underline">
                Manage →
              </span>
            </Link>

            <Link
              to="/tenant/properties"
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-midnight-indigo/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
                <Building2 size={20} />
              </div>

              <h3 className="text-sm font-semibold text-slate-text">
                Manage Properties
              </h3>

              <p className="mt-1 text-xs text-slate-muted">
                Manage property information, rooms, availability, and seasonal
                rates.
              </p>

              <span className="mt-4 inline-flex items-center text-xs font-semibold text-midnight-indigo group-hover:underline">
                Manage →
              </span>
            </Link>
          </div>
        </section>

        {/* FEATURE 1 - PROPERTY OVERVIEW */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-text">
              Property Overview
            </h2>

            <p className="mt-1 text-sm text-slate-muted">
              A quick overview of your accommodation setup.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-muted">
                    Properties
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-text">
                    {isPropertiesLoading ? "—" : totalProperties}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <Building2 className="h-5 w-5 text-slate-text" />
                </div>
              </div>

              <Link
                to="/tenant/properties"
                className="mt-4 inline-flex cursor-pointer items-center text-sm font-medium text-midnight-indigo hover:text-blue-800"
              >
                Manage properties →
              </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-muted">
                    Total Rooms
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-text">
                    {isRoomsLoading ? "—" : totalRooms}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <Building2 className="h-5 w-5 text-slate-text" />
                </div>
              </div>

              <Link
                to="/tenant/properties"
                className="mt-4 inline-flex cursor-pointer items-center text-sm font-medium text-midnight-indigo hover:text-blue-800"
              >
                Manage rooms →
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURE 1 - YOUR PROPERTIES */}
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-text">
                Your Properties
              </h2>

              <p className="mt-1 text-sm text-slate-muted">
                Your three newest properties and their room types.
              </p>
            </div>

            <Link
              to="/tenant/properties"
              className="shrink-0 text-sm font-medium text-midnight-indigo hover:text-blue-800"
            >
              Manage →
            </Link>
          </div>

          {isPropertiesLoading && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-muted shadow-sm">
              Loading properties...
            </div>
          )}

          {!isPropertiesLoading && properties.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
              <Building2 className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-text">
                No properties yet
              </p>

              <p className="mt-1 text-xs text-slate-muted">
                Add your first property to see it here.
              </p>

              <Link
                to="/tenant/properties"
                className="mt-4 inline-flex items-center text-xs font-semibold text-midnight-indigo hover:text-blue-800"
              >
                Add property →
              </Link>
            </div>
          )}

          {!isPropertiesLoading && properties.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-3">
              {properties.map((property) => {
                const propertyRooms = property.rooms ?? [];

                return (
                  <div
                    key={property.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-text">
                          {property.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-muted">
                          {property.property_categories?.name ?? "No category"}
                          {" · "}
                          {property.destinations?.city ?? "No location"}
                        </p>
                      </div>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
                        <Building2 size={17} />
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold text-slate-text">
                        Room Types
                      </p>

                      {propertyRooms.length === 0 ? (
                        <p className="mt-3 text-xs text-slate-muted">
                          No room types yet.
                        </p>
                      ) : (
                        <div className="mt-3 space-y-2">
                          {propertyRooms.map((room) => (
                            <div
                              key={room.id}
                              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                            >
                              <p className="min-w-0 truncate text-xs text-slate-700">
                                {room.room_name}
                              </p>

                              <p className="shrink-0 text-xs font-semibold text-midnight-indigo">
                                {room.total_rooms}{" "}
                                {room.total_rooms === 1 ? "room" : "rooms"}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      to="/tenant/properties"
                      className="mt-4 inline-flex text-xs font-medium text-midnight-indigo hover:text-blue-800"
                    >
                      Manage property →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* EXISTING DASHBOARD SECTION - FEATURE 2 */}
        <TenantDashboardTransaction />

        <TenantDashboardSales />
      </main>

      <TenantMobileBottomNav />
    </div>
  );
}
