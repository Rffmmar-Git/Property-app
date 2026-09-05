import { useState } from "react";

import { TenantMobileHeader } from "@/components/layout/TenantMobileHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { TenantMobileBottomNav } from "@/components/layout/TenantMobileBottomNav";
import PageHeader from "@/components/layout/PageHeader";

import SalesReport from "@/features/report/components/SalesReport";
import TransactionReport from "@/features/report/components/TransactionReport";
import PropertyReport from "@/features/report/components/PropertyReport";

const tabs = [
  {
    id: "sales",
    label: "Sales Report",
  },
  {
    id: "transactions",
    label: "Transaction Report",
  },
  {
    id: "property",
    label: "Property Report",
  },
];

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState("sales");

  return (
    <div className="flex min-h-screen flex-col bg-surface pb-24 md:pb-12">
      <div className="hidden md:block">
        <TenantHeader />
      </div>

      <div className="md:hidden">
        <TenantMobileHeader />
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Reports & Analysis"
          description="Analyze sales, transactions, and property availability."
        />

        <div className="mb-6 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition sm:px-5 ${
                    isActive
                      ? "bg-midnight-indigo text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "sales" && <SalesReport />}

        {activeTab === "transactions" && (
          <TransactionReport />
        )}

        {activeTab === "property" && <PropertyReport />}
      </main>

      <TenantMobileBottomNav />
    </div>
  );
}