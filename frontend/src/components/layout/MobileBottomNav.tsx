import { Link, useLocation } from "react-router-dom";
import { Home, Search, Calendar, User } from "lucide-react";
import type { ComponentType } from "react";

import { useAuthStore } from "../../stores/auth.store";

interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
}

export function MobileBottomNav() {
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  // MobileBottomNav is only for the customer-facing site.
  // Tenant uses the dedicated TenantMobileBottomNav.
  if (user?.role === "TENANT") {
    return null;
  }

  const navItems: NavItem[] = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Explore",
      path: "/properties",
      icon: Search,
    },
    ...(isAuthenticated && user?.role === "CUSTOMER"
      ? [
          {
            label: "Reservations",
            path: "/my-reservations",
            icon: Calendar,
          },
          {
            label: "Profile",
            path: "/profile",
            icon: User,
          },
        ]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface px-4 py-3 pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden">
      {navItems.map(({ label, path, icon: Icon }) => {
        const isActive = pathname === path;

        return (
          <Link
            key={path}
            to={path}
            className={`relative flex flex-col items-center justify-center rounded-lg p-2 transition-transform duration-150 active:scale-90 active:bg-surface-variant ${
              isActive
                ? "text-midnight-indigo after:mt-1 after:h-1 after:w-1 after:rounded-full after:bg-midnight-indigo after:content-['']"
                : "text-on-surface-variant"
            }`}
          >
            <Icon className="h-6 w-6" />

            <span className="mt-1 text-[12px] font-medium leading-[16px]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}