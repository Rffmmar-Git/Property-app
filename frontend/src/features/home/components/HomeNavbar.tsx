import { Building2 } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function HomeNavbar() {
  const navItems = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "Explore Properties",
      to: "/properties",
    },
    {
      label: "Tenant Portal",
      to: "/tenant/dashboard",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-midnight-indigo"
        >
          <Building2 size={19} strokeWidth={2.5} />

          <span className="font-headline-md text-[16px] font-bold">
            Property App
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative py-5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-midnight-indigo after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-sunrise-amber"
                    : "text-slate-muted hover:text-midnight-indigo"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-[11px] font-medium text-midnight-indigo transition-colors hover:text-blue-800"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-md bg-midnight-indigo px-4 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}