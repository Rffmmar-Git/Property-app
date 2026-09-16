import { Building2 } from "lucide-react";
import DashboardSectionCard from "@/components/layout/DashboardSectionCard";
import { useTenantProperties } from "@/features/property/hooks/useTenantProperties";

export default function TenantDashboardProperty() {
  const { data: properties = [], isLoading, isError } = useTenantProperties();

  return (
    <DashboardSectionCard
      title="Your Properties"
      description={`${properties.length} propert${properties.length === 1 ? "y" : "ies"} on your account`}
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
          <p className="mt-3 text-sm font-medium text-slate-text">No properties yet</p>
          <p className="mt-1 text-sm text-slate-muted">Your properties will appear here.</p>
        </div>
      )}

      {!isLoading && !isError && properties.length > 0 && (
        <ul className="divide-y divide-slate-100">
          {properties.slice(0, 6).map((property) => (
            <li key={property.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Building2 className="h-4 w-4 text-slate-text" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-text">{property.name}</p>
                <p className="text-xs text-slate-muted">ID: {property.id}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardSectionCard>
  );
}