import type { ReactNode } from "react";

import { TenantHeader } from "@/components/layout/TenantHeader";
import { TenantMobileHeader } from "@/components/layout/TenantMobileHeader";
import { TenantMobileBottomNav } from "@/components/layout/TenantMobileBottomNav";

interface TenantLayoutProps {
  children: ReactNode;
}

export default function TenantLayout({
  children,
}: TenantLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden md:block">
        <TenantHeader />
      </div>

      <div className="md:hidden">
        <TenantMobileHeader />
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 md:pb-8 lg:px-8">
        {children}
      </main>

      <TenantMobileBottomNav />
    </div>
  );
}