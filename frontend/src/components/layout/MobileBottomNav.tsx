import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User } from "lucide-react";
import type { ComponentType } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "Explore", path: "/explore", icon: Search },
  { label: "Saved", path: "/saved", icon: Heart },
  { label: "Profile", path: "/profile", icon: User },
];

export function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-[env(safe-area-inset-bottom)] bg-surface border-t border-outline-variant shadow-lg rounded-t-xl">
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
        const isActive = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform duration-150 active:scale-90 active:bg-surface-variant relative ${
              isActive
                ? "text-midnight-indigo after:content-[''] after:w-1 after:h-1 after:bg-midnight-indigo after:rounded-full after:mt-1"
                : "text-on-surface-variant"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[12px] font-medium leading-[16px] mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}