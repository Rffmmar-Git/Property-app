import {
  Bell,
  Building2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

export function TenantMobileHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <Link
          to="/tenant/dashboard"
          className="flex items-center gap-2 text-midnight-indigo"
        >
          <Building2
            size={19}
            strokeWidth={2.5}
          />

          <span className="font-headline-md text-[16px] font-bold">
            Property App
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/notifications"
            className="relative rounded-full p-2 text-midnight-indigo transition-colors hover:bg-slate-100"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Link>

          <Link
            to="/profile"
            className="rounded-full p-2 text-midnight-indigo transition-colors hover:bg-slate-100"
            title="Profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}