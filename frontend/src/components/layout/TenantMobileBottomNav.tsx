import {
  Building2,
  FileBarChart,
  Home,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function TenantMobileBottomNav() {
  const navItems = [
    {
      label: "Dashboard",
      to: "/tenant/dashboard",
      icon: Home,
    },
    {
      label: "Properties",
      to: "/tenant/properties",
      icon: Building2,
    },
    {
      label: "Transactions",
      to: "/tenant/transactions",
      icon: WalletCards,
    },
    {
      label: "Reports",
      to: "/tenant/reports",
      icon: FileBarChart,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="flex h-16 w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex h-full flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-midnight-indigo"
                    : "text-slate-400 hover:text-midnight-indigo"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}