import { TenantMobileHeader } from "@/components/layout/TenantMobileHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { TenantMobileBottomNav } from "@/components/layout/TenantMobileBottomNav";
import PageHeader from "@/components/layout/PageHeader";

import TenantDashboardSummary from "@/features/home/components/TenantDashboardSummary";
import TenantDashboardTransaction from "@/features/payment/components/TenantDashboardTransaction";
import TenantDashboardProperty from "@/features/property/components/TenantDashboardProperty";
import TenantDashboardSales from "@/features/report/components/TenantDashboardSales";

export default function TenantDashboardPage() {
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

        <TenantDashboardSummary />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TenantDashboardTransaction />
          </div>

          <div>
            <TenantDashboardProperty />
          </div>
        </div>

        <TenantDashboardSales />
      </main>

      <TenantMobileBottomNav />
    </div>
  );
}