import { Building2, Plus, Tag } from "lucide-react";
import { Link } from "react-router-dom";

import PageHeader from "@/components/layout/PageHeader";
import SurfaceCard from "@/components/layout/SurfaceCard";
import TenantLayout from "@/layouts/TenantLayout";

export default function TenantDashboardPage() {
  return (
    <TenantLayout>
      <PageHeader
        title="Dashboard"
        description="Manage your properties and accommodation business."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SurfaceCard className="p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
            <Building2 size={20} />
          </div>

          <h2 className="text-sm font-semibold text-midnight-indigo">
            Properties
          </h2>

          <p className="mt-1 text-xs text-slate-muted">
            Manage your properties and accommodation details.
          </p>

          <Link
            to="/tenant/properties"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-midnight-indigo hover:underline"
          >
            Manage Properties
          </Link>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
            <Tag size={20} />
          </div>

          <h2 className="text-sm font-semibold text-midnight-indigo">
            Categories
          </h2>

          <p className="mt-1 text-xs text-slate-muted">
            Manage property categories used across the platform.
          </p>

          <Link
            to="/tenant/categories"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-midnight-indigo hover:underline"
          >
            Manage Categories
          </Link>
        </SurfaceCard>

        <SurfaceCard className="p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-midnight-indigo/10 text-midnight-indigo">
            <Plus size={20} />
          </div>

          <h2 className="text-sm font-semibold text-midnight-indigo">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-slate-muted">
            Quickly access common property management actions.
          </p>

          <Link
            to="/tenant/properties"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-midnight-indigo hover:underline"
          >
            Add Property
          </Link>
        </SurfaceCard>
      </div>
    </TenantLayout>
  );
}