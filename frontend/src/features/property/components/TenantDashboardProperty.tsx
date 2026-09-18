import { Building2 } from "lucide-react";

import DashboardSectionCard from "@/components/layout/DashboardSectionCard";

import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";
import { useTenantRooms } from "@/features/property/hooks/useTenantRooms";

export default function TenantDashboardProperty() {
  const {
    data: properties = [],
    isLoading: isPropertiesLoading,
    isError: isPropertiesError,
  } = useTenantProperties();

  const {
    data: rooms = [],
    isLoading: isRoomsLoading,
    isError: isRoomsError,
  } = useTenantRooms();

  const isLoading = isPropertiesLoading || isRoomsLoading;
  const isError = isPropertiesError || isRoomsError;

  return (
    <DashboardSectionCard
      title="Your Properties"
      description={`${properties.length} propert${
        properties.length === 1 ? "y" : "ies"
      } on your account`}
      actionLabel="Manage"
      actionTo="/tenant/properties"
    >
      {isLoading && (
        <div className="px-5 py-10 text-center text-sm text-slate-muted">
          Loading properties...
        </div>
      )}

      {isError && (
        <div className="px-5 py-10 text-center text-sm text-red-600">
          Failed to load properties.
        </div>
      )}

      {!isLoading && !isError && properties.length === 0 && (
        <div className="px-5 py-10 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm font-medium text-slate-text">
            No properties yet
          </p>

          <p className="mt-1 text-sm text-slate-muted">
            Your properties will appear here.
          </p>
        </div>
      )}

      {!isLoading && !isError && properties.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {properties.slice(0, 6).map((property) => {
            const propertyRooms = rooms.filter(
              (room) => room.property_id === property.id,
            );

            return (
              <li key={property.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Building2 className="h-4 w-4 text-slate-text" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-text">
                      {property.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-muted">
                      {propertyRooms.length} room type
                      {propertyRooms.length === 1 ? "" : "s"}
                    </p>

                    {propertyRooms.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {propertyRooms.map((room) => (
                          <div
                            key={room.id}
                            className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2"
                          >
                            <span className="min-w-0 truncate text-xs font-medium text-slate-text">
                              {room.room_name}
                            </span>

                            <span className="shrink-0 text-xs text-slate-muted">
                              {room.total_rooms}{" "}
                              {room.total_rooms === 1 ? "room" : "rooms"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {propertyRooms.length === 0 && (
                      <p className="mt-3 text-xs text-slate-muted">
                        No room types added yet.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardSectionCard>
  );
}